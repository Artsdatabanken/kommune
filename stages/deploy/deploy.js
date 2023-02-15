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
function check_if_upstream_exists() {
    try {
        let remotes = git("remote -v");
        console.log(remotes);
        if (remotes.includes(kommune_repo_url)) {
            console.log("(repo for kommune finnes, trengs ikke å legges til..)");
            kommune_repo_is_added = true;
        } else {
            console.log("repo finnes ikke");
        }
    } catch (e) {
        // i dont care....
        console.log("Error: " + e);
    }
}

// Innkluderer Artsdatabanken/kommune som repo under alias upstream hvis den ikke allerede er lagt til 
function add_kommmunerepo_if_not_added() {
    if (!kommune_repo_is_added) {
        try {
            git("remote add upstream https://github.com/Artsdatabanken/kommune.git");
        } catch (e) {
            // i dont care....
            console.log("Error: " + e);
        }
    }
}

function add_new_files_to_be_commited() {
    try {
        git("add build/fylke.json");
        git("add build/fylke.schema.json");
        git("add build/kommune.json");
        git("add build/kommune.schema.json");
        git("add build/dummy.txt");
    } catch (e) {
        // still dont care..
        console.error("error during git add section: " + e);
    }
}


function make_new_commit() {
    var stamp = Date.now();

    try {
        let msg = git('commit -m "deploy ' + stamp + '"');
        console.log(msg);
    } catch (e) {
        //...jadajada..
        console.log("Error: " + e);
    }
}

function getShaOfLastCommit() { //-> string: msg
    try {
        let msg = git('git rev-parse HEAD');
        //console.log(msg);
        return msg;
    } catch (e) {
        //...jadajada..
        console.log("Error: " + e);
    } 
}

function deploy_with_push() { // void
    try {
        //let msg = git("push --force -u upstream master");  //git push -u gh_nd_brreg main
        let lastsha = getShaOfLastCommit();
        let cmd = "push upstream "+lastsha+":master";
        let msg = git(cmd);
        //git push <remotename> <commit SHA>:<remotebranchname>
        console.log(msg);
    } catch (e) {
        //..move on..
        console.log("Error: " + e);
    }
}

//The steps
check_if_upstream_exists();
add_kommmunerepo_if_not_added();
add_new_files_to_be_commited();
make_new_commit();
console.log(getShaOfLastCommit());
//deploy_with_push();