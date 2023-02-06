const path = require("path");
const fs = require("fs");
var textEncoding = require('text-encoding');
const execSync = require("child_process").execSync;
let kommune_repo_is_added = false;
let kommune_repo_url = "https://github.com/Artsdatabanken/kommune.git";
//var gitconfig = require("./gitconfig/gitconfiglocalSync");


/**
 * Run an arbitrary git command.
 */
function git(cmd, args = "") {
  var out = execSync("git " + cmd + " " + args, { skipThrow: true });
  //new TextDecoder().decode(out);
  var out_string = new TextDecoder('utf-8').decode(out);
  return out_string;
  //console.log(out);
}

console.log("Running deploy for kommune-lastejobb!!"); 

// check if upstream exists
try{
    let remotes = git("remote -v");
    console.log(remotes);
    if(remotes.includes(kommune_repo_url)){
        console.log("(repo for kommune finnes, trengs ikke å legges til..)");
        kommune_repo_is_added = true;
    }else{
         console.log("repo finnes ikke");       
    }
}catch(e){
        // i dont care....
}

// Innkluderer Artsdatabanken/kommune som repo under alias upstream hvis den ikke allerede er lagt til 
if(!kommune_repo_is_added){
    try{    
        git("remote add upstream https://github.com/Artsdatabanken/kommune.git");
    }catch(e){
            // i dont care....
            console.log("Error: "+e);
    }
}

try{
    git("add build/fylke.json");
    git("add build/fylke.schema.json");
    git("add build/kommune.json");
    git("add build/kommune.schema.json");
}catch(e){
    // still dont care..
}
var stamp = Date.now();
try{
    git('commit -m "deploy '+stamp+'"');
}catch(e){
    //...jadajada..
}

try{
    git("push --force -u upstream master");  //git push -u gh_nd_brreg main
}catch(e){
    //..move on..
}
//git("add build/*");
// Sjekke om kommunerepo allerede ligger inne med: '

//  - git remote -v
// git remote add {alias} {github-url}

//DIV:
// remote skal være https://github.com/Artsdatabanken/kommune.git
