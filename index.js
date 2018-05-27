'use strict';

const { exec } = require( 'child_process' );

function splitStr(str){
    return str.split("\n");
}

function goBackOneDir(){
    console.log("going back");
    exec('cd ..');
}

function changeBranchAndPull(currentBranch){
    console.log(`changing to develop`);
    let result = exec('git checkout develop');
    result.stdout.on('data', () => {
        console.log('pulling develop branch');
        let result = exec('git pull -f');
        result.stdout.on('data', () => {
            console.log(`checkout ${currentBranch}`);
            let command = 'git checkout ' + currentBranch;
            exec(command);
        })
    });
}

function findCurrentBranch(dir){
    console.log(`finding current branch in ${dir}`);
    let currentBranch;
    let result = exec('git branch');
    result.stdout.on('data', data => {
        let arr = splitStr(data);
        for (let x in arr){
            if(arr[x].startsWith("* ")){
                let branchTrim = arr[x];
                currentBranch = branchTrim.slice(2);
                changeBranchAndPull(currentBranch);
            }
        }
    });
}

function changeToDir(dir){
    let command = 'cd ' + dir;
    let result = exec(command, (err, stdout, stderr) => {
        if(err){
            console.log(err);
        }
        console.log(`changed to ${dir}`);
    });
    result.stdout.on('data', () => {
        findCurrentBranch(dir);
    })
}

function getOutput() {
    let output = exec('ls');
    output.stdout.on('data', (data) => {
        data = splitStr(data);
        for(let i in data){
            changeToDir(data[i]);
            goBackOneDir();
        }
    })
}

getOutput();