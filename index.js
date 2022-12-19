const fs = require('fs');

let commandList = fs.readFileSync("./prompt.txt").toString();
commandList = commandList.split("\n");

let folderIndexer = "";
let hardDrive = [];
let isListingFiles = false;
for (let x = 0; x < commandList.length; x++) {
    let command = commandList[x].split(" ");
    // console.log(command);

    // linux commands list
    if (command[0] == "$") {
        isListingFiles = false;
        if (command[1] == "cd" && command[2] != "..") {
            folderIndexer = command[2];
            addDir(command[2], "");
        } else if (command[1] == "cd" && command[2] == "..") {
            folderIndexer = hardDrive[folderIndexer].parentDir;
        }

        if (command[1] == "ls") {
            isListingFiles = true;
        }
    }

    if (isListingFiles) {
        if (command[0] == "dir") {
            hardDrive[folderIndexer].folders.push(command[1]);
            addDir(command[1], folderIndexer);
        } else if (isNumeric(command[0])) {
            addFile(folderIndexer, command[0], command[1]);
        }
    }

    // console.log(folderIndexer);
    // console.log(hardDrive);
}

// Go to read from startFolder and cal size of other folders and files
function calFolderSize(startFolder) {
    let folder = hardDrive[startFolder];
    let dataSize = 0;

    for (let x = 0; x < folder.files.length; x++) {
        dataSize += folder.files[x].size;
    }

    if (folder.folders.length != 0) {
        for (let y = 0; y < folder.folders.length; y++) {
            dataSize += calFolderSize(folder.folders[y]);
        }
    }

    return dataSize;
}

function calTotalFilesSizeFromFolder(startFolder) {
    let folder = hardDrive[startFolder];
    let dataSize = 0;

    for (let x = 0; x < folder.files.length; x++) {
        dataSize += folder.files[x].size;
    }

    return dataSize;
}

let result = 0;
for (let folder in hardDrive) {
    let size = calTotalFilesSizeFromFolder(folder);

    if (size < 100000) {
        console.log(folder);
        result += size;
    }
}

console.log(result);

function addDir(name, parent) {
    if (!doesFolderExist(name)) {
        // Store this in a dictionary array
        let dirStructure = {
            dirName: name,
            parentDir: parent,
            isRoot: (name == "/") ? true : false,
            folders: [],
            files: []
        };

        hardDrive[name] = dirStructure;
    }
}

function addFile(dirName, fileSize, fileName) {
    if (doesFolderExist(dirName)) {
        hardDrive[dirName].files.push({
            size: parseInt(fileSize),
            fileName: fileName
        });
    }
}

function doesFolderExist(name) {
    if (hardDrive[name] != undefined) {
        return true;
    }

    return false;
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}