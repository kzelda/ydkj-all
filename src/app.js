// https://github.com/getify/You-Dont-Know-JS

const request = require('request');
const fs = require("fs");
const links = require("./links").Links();


const pages_dir = require('path').resolve(__dirname, '../pages');

async function append_file(filename,s) {
    await fs.appendFileSync(filename, s, function(err){console.warn(err)});
}

let nb = 0;

links.forEach((l,i) => {
    request(l, 
        async function (error, response, body) {
            
            nb++;

            if(error != null){
                console.error('error:', error); // Print the error if one occurred
            }
          
            if(response != null && response.statusCode == 200){
                console.log("Done" , l);
                //console.log(body);
                await append_file(`${pages_dir}/${i}.md`,body);
            }
        });
});

async function read_file(file_path){
    return await fs.readFileSync(file_path,{encoding:"utf-8"});
}

async function merge_all(){
    for(let i=0;i < nb;i++){
        var content = await read_file(`${pages_dir}/${i}.md`);
        await append_file(`${pages_dir}/_ALL_.md`,content)
    }
}

var intid = setInterval(async function(){

    if(nb == links.length){
        console.log("nb = ",nb);
        
        clearInterval(intid);

        await merge_all();
    }
},1000);

