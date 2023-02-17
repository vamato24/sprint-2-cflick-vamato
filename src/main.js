/** a String representing the most recent command executed */
var mostRecentCommand = "";
window.onload = function () {
    prepareButtonPress();
    prepareKeypress();
};
/**
 * This function adds an event listener to the submit button
 */
function prepareButtonPress() {
    var maybeInputs = document.getElementsByClassName("repl-button");
    var maybeInput = maybeInputs.item(0);
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLButtonElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else {
        maybeInput.addEventListener("click", handleButtonPress);
    }
}
function handleButtonPress(event) {
    var maybeInputs = document.getElementsByClassName("repl-command-box");
    var maybeInput = maybeInputs.item(0);
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLInputElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else {
        mostRecentCommand = maybeInput.value;
        var workedCommand = parseCommandCall(maybeInput.value);
        maybeInput.value = "";
        var history_1 = document.getElementsByClassName("repl-history")[0];
        var historyHeight = history_1.scrollHeight;
        history_1.scrollTo(0, historyHeight);
        return workedCommand;
    }
    return false;
}
function prepareKeypress() {
    var maybeInputs = document.getElementsByClassName("repl-command-box");
    var maybeInput = maybeInputs.item(0);
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLInputElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else {
        maybeInput.addEventListener("keypress", handleKeypress);
    }
}
function handleKeypress(event) {
    if (event.code === "Enter") {
        var maybeInputs = document.getElementsByClassName("repl-command-box");
        var maybeInput = maybeInputs.item(0);
        if (maybeInput == null) {
            console.log("Couldn't find input element");
        }
        else if (!(maybeInput instanceof HTMLInputElement)) {
            console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
        }
        else {
            mostRecentCommand = maybeInput.value;
            var workedCommand = parseCommandCall(maybeInput.value);
            maybeInput.value = "";
            var history_2 = document.getElementsByClassName("repl-history")[0];
            var historyHeight = history_2.scrollHeight;
            history_2.scrollTo(0, historyHeight);
            return workedCommand;
        }
    }
    return false;
}
function parseCommandCall(command) {
    var instruction = command.split(" ")[0].toLocaleLowerCase();
    mostRecentCommand = command;
    switch (instruction) {
        case "mode": {
            modeSwitch();
            return true;
        }
        case "load_file": {
            console.log("got load_file command!");
            csvLoader(command.split(" ")[1]);
            return true;
        }
        case "view": {
            csvViewer(activeData);
            return true;
        }
        case "search": {
            console.log("got search command!");
            var worked = csvSearcher(command.split(" ")[1], command.split(" ").slice(2).join().replaceAll(",", " "));
            return worked;
        }
        case "echo": {
            print(command.substring(5));
            return true;
        }
        case "help": {
            print(CONST_help_output);
            return true;
        }
        default: {
            print("Couldn't understand command!");
            return false;
        }
    }
}
function print(output) {
    var maybeDivs = document.getElementsByClassName("repl-history");
    var maybeDiv = maybeDivs.item(0);
    if (maybeDiv == null) {
        console.log("Couldn't find output element");
        return false;
    }
    else if (!(maybeDiv instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeDiv, ", but it wasn't a div"));
        return false;
    }
    else {
        if (briefMode) {
            var commandNode = document.createTextNode(output);
            var commandElement = document.createElement("pre");
            commandElement.appendChild(commandNode);
            commandElement.className = "repl-command";
            maybeDiv.appendChild(commandElement);
            return commandNode;
        }
        else {
            var verboseCommandNode = document.createTextNode("Command: " + mostRecentCommand);
            var verboseOutputNode = document.createTextNode("Output: " + output);
            var verboseCommandElement = document.createElement("pre");
            verboseCommandElement.appendChild(verboseCommandNode);
            verboseCommandElement.className = "repl-command";
            var verboseOutputElement = document.createElement("pre");
            verboseOutputElement.appendChild(verboseOutputNode);
            verboseOutputElement.className = "repl-command";
            maybeDiv.appendChild(verboseCommandElement);
            maybeDiv.appendChild(verboseOutputElement);
            return verboseOutputNode;
        }
    }
}
var briefMode = true;
function modeSwitch() {
    briefMode = !briefMode;
    if (briefMode) {
        print("switched to brief mode!");
    }
    else {
        print("switched to verbose mode!");
    }
    return briefMode;
}
function getBriefMode() {
    return briefMode;
}
var activeData = new Array(new Array());
function returnActiveData() {
    return activeData;
}
function csvLoader(targetPath) {
    if (pathMapper.get(targetPath) !== undefined) {
        activeData = pathMapper.get(targetPath);
        print(targetPath + " has been loaded! 😸");
        return true;
    }
    else {
        print("Couldn't find " + targetPath + " 😿");
        return false;
    }
}
function csvViewer(displayData) {
    var maybeDivs = document.getElementsByClassName("repl-history");
    var maybeDiv = maybeDivs.item(0);
    if (maybeDiv == null) {
        console.log("Couldn't find output element");
    }
    else if (!(maybeDiv instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeDiv, ", but it wasn't a div"));
    }
    else {
        if (!briefMode) {
            var verboseCommandNode = document.createTextNode("Command: " + mostRecentCommand);
            var verboseCommandElement = document.createElement("pre");
            verboseCommandElement.appendChild(verboseCommandNode);
            verboseCommandElement.className = "repl-command";
            maybeDiv.appendChild(verboseCommandElement);
            var verboseOutputNode = document.createTextNode("Output: ");
            var verboseOutputElement = document.createElement("pre");
            verboseOutputElement.className = "repl-command";
            verboseOutputElement.appendChild(verboseOutputNode);
            maybeDiv.appendChild(verboseOutputElement);
        }
        var table_1 = document.createElement("table");
        for (var row = 0; row < displayData.length; row++) {
            var rowElement = table_1.appendChild(document.createElement("tr"));
            for (var col = 0; col < displayData[row].length; col++) {
                var colNode = document.createTextNode(displayData[row][col]);
                var colElement = document.createElement("td");
                colElement.appendChild(colNode);
                colElement.className = "repl-command";
                rowElement.appendChild(colElement);
            }
        }
        maybeDiv.appendChild(table_1);
        //check to make sure didn't fail
        return true;
    }
    var table = document.createElement("table");
    for (var row = 0; row < displayData.length; row++) {
        var rowElement = table.appendChild(document.createElement("tr"));
        for (var col = 0; col < displayData[row].length; col++) {
            var colNode = document.createTextNode(displayData[row][col]);
            var colElement = document.createElement("td");
            colElement.appendChild(colNode);
            colElement.className = "repl-command";
            rowElement.appendChild(colElement);
        }
    }
    maybeDiv === null || maybeDiv === void 0 ? void 0 : maybeDiv.appendChild(table);
}
function csvSearcher(targIndex, searchTerm) {
    var accumulatedRows = new Array();
    var intIndex = -1;
    var potentialIntIndex = parseInt(targIndex);
    if (potentialIntIndex.toString() == targIndex) {
        intIndex = potentialIntIndex;
    }
    else {
        intIndex = activeData[0].indexOf(targIndex);
    }
    if (intIndex < 0 ||
        intIndex >= activeData.sort(function (a, b) { return a.length - b.length; })[0].length) {
        throw new Error("Index doesn't exist or is out of bounds!");
    }
    activeData.forEach(function (row) {
        if (row[intIndex].includes(searchTerm)) {
            accumulatedRows.push(row);
        }
    });
    csvViewer(accumulatedRows);
    return accumulatedRows;
}
function clearHistory() {
    var maybeDivs = document.getElementsByClassName("repl-history");
    var maybeDiv = maybeDivs.item(0);
    if (maybeDiv == null) {
        console.log("Couldn't find output element");
        return false;
    }
    else if (!(maybeDiv instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeDiv, ", but it wasn't a div"));
        return false;
    }
    else {
        maybeDiv.innerHTML = "";
        briefMode = true;
        return true;
    }
}
export { prepareButtonPress, handleButtonPress, prepareKeypress, handleKeypress, clearHistory, print, parseCommandCall, returnActiveData, getBriefMode, modeSwitch, csvLoader, csvSearcher, };
export var CONST_help_output = "Available commands: \n \
mode: switch between verbose and brief results \n \
load_file <filepath>: load a csv file from a certain <filepath> \n \
view: display a csv file \n \
search <index> <term>: returns all rows in the loaded csv file that contain <term> in the column at <index>";
var testData1 = [
    ["1", "2", "3"],
    ["a", "b", "c"],
    ["true", "false", "3"],
    ["3", "6", "9"],
];
var testData2 = [["hi"]];
var testData3 = [["hello"], ["elements"], ["items"], ["objects"]];
var testData4 = [["hello"], ["things", "bump"], ["weilufb"], ["data"]];
var testData5 = [
    [
        "long",
        "very long",
        "very very very long",
        "verrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrry long",
    ],
    ["1", "2", "3", "4"],
];
var testData6 = [[]];
var testData7 = [
    ["four", "4", "fourty4", "4th"],
    ["wioeufn", "weio", "wefuo", "dance"],
    ["hey", "hi", "hello", "what's up"],
];
var testData8 = [[""]];
var testData9 = [
    ["StarID", "ProperName", "X", "Y", "Z"],
    ["0", "Sol", "0", "0", "0"],
    ["1", "", "282.43485", "0.00449", "5.36884"],
    ["2", "", "43.04329", "0.00285", "-15.24144"],
    ["3", "", "277.11358", "0.02422", "223.27753"],
    ["3759", "G. Psc", "7.26388", "1.55643", "0.68697"],
    ["70667", "Proxima Centauri", "-0.47175", "-0.36132", "-1.15037"],
    ["71454", "Rigel Kentaurus B", "-0.50359", "-0.42128", "-1.1767"],
    ["71457", "Rigel Kentaurus A", "-0.50362", "-0.42139", "0.14824"],
    ["87666", "Barnard's Star", "0", "0", "0"],
    ["118721", "", "-2.28262", "0.64697", "0.29354"],
];
var testData10 = [
    ["Name", "Year"],
    ["Vinny", "2024"],
    ["Aidan", "2025"],
    ["Nicky", "2024"],
];
var pathMapper = new Map();
pathMapper.set("/test/dataOne.csv", testData1);
pathMapper.set("/test/dataTwo.csv", testData2);
pathMapper.set("/test/dataThree.csv", testData3);
pathMapper.set("/test/dataFour.csv", testData4);
pathMapper.set("/test/dataFive.csv", testData5);
pathMapper.set("/test/dataSix.csv", testData6);
pathMapper.set("/test/dataSeven.csv", testData7);
pathMapper.set("/test/dataEight.csv", testData8);
pathMapper.set("/test/dataNine.csv", testData9);
pathMapper.set("/test/dataTen.csv", testData10);
