const path = require("path");
const fs = require("fs");
var textEncoding = require('text-encoding');
const execSync = require("child_process").execSync;
let deploy_repo_is_added = false;
let deploy_repo_url = "https://github.com/Artsdatabanken/kommune.git";
//var gitconfig = require("./gitconfig/gitconfiglocalSync");


/**
 * Run an arbitrary git command.
 */
function git(cmd, args = "") {// : string
    var out = execSync("git " + cmd + " " + args, { skipThrow: true });
    //new TextDecoder().decode(out);
    var out_string = new TextDecoder('utf-8').decode(out);
    return out_string;
    //console.log(out);
}

function changes_to_deploy_files_found(){// : boolean
    var change = false;
    var status = git("ls-files --deleted --modified --others --exclude-standard -- :/");
    if(status.includes("fylke.") || status.includes("kommune.") || status.includes("dummy.")){
        change = true;
    }
    return change;
}

// check if upstream exists
function check_if_upstream_exists() {// void, setting bool-var
    try {
        let remotes = git("remote -v");
        //console.log(remotes);
        if (remotes.includes(deploy_repo_url)) {
            console.log("('deployrepo' allready exist in the local repo list, continuing process.. )");
            deploy_repo_is_added = true;
        } else {
            console.log("repo finnes ikke");
        }
    } catch (e) {
        // i dont care....
        console.log("Error: " + e);
    }
}

// Innkluderer Artsdatabanken/kommune som repo under alias upstream hvis den ikke allerede er lagt til 
function add_deployrepo_if_not_added() {// : void
    if (!deploy_repo_is_added) {
        try {
            console.log("Legger til repo for deploy av kartfiler (*.json)");
            git("remote add deployrepo https://github.com/Artsdatabanken/kommune.git");
        } catch (e) {
            // i dont care....
            console.log("Error: " + e);
        }
    }
}

function add_new_files_to_be_commited() {// : void
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
        let msg = git('rev-parse HEAD').replace("\n","");
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
        let cmd = "push deployrepo "+lastsha+":master";
        let msg = git(cmd);
        //git push <remotename> <commit SHA>:<remotebranchname>
        console.log(msg);
    } catch (e) {
        //..move on..
        console.log("Error: " + e);
    }
}

//The steps
console.log("\n**********  Running deploy for kommune-lastejobb  **********\n");
check_if_upstream_exists();
add_deployrepo_if_not_added();
if(changes_to_deploy_files_found()){
    add_new_files_to_be_commited();
    make_new_commit();
    console.log("Deploying to deployrepo: ", getShaOfLastCommit());
    deploy_with_push();
}else{
    console.log("!! Found no changed deployfile, aborting further git tasks (deployfiles are: 'fylke.*' or 'kommune.*' or 'dummy.*' )");
}
console.log("\n\n**********  Done  **********\n\n\n");
