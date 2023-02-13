var mostRecentCommand = "";
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = function () {
    prepareButtonPress();
    prepareKeypress();
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element 
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};
function prepareButtonPress() {
    // As far as TypeScript knows, there may be *many* elements with this class.
    var maybeInputs = document.getElementsByClassName('repl-button');
    // Assumption: there's only one thing
    var maybeInput = maybeInputs.item(0);
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLButtonElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        maybeInput.addEventListener("click", handleButtonPress);
    }
}
function handleButtonPress(event) {
    // As far as TypeScript knows, there may be *many* elements with this class.
    var maybeInputs = document.getElementsByClassName('repl-command-box');
    // Assumption: there's only one thing
    var maybeInput = maybeInputs.item(0);
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLInputElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        mostRecentCommand = maybeInput.value;
        parseCommandCall(maybeInput.value);
        maybeInput.value = "";
        var history_1 = document.getElementsByClassName("repl-history")[0];
        var historyHeight = history_1.scrollHeight;
        history_1.scrollTo(0, historyHeight);
    }
}
function prepareKeypress() {
    // As far as TypeScript knows, there may be *many* elements with this class.
    var maybeInputs = document.getElementsByClassName('repl-command-box');
    // Assumption: there's only one thing
    var maybeInput = maybeInputs.item(0);
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLInputElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        maybeInput.addEventListener("keypress", handleKeypress);
    }
}
function handleKeypress(event) {
    // The event has more fields than just the key pressed (e.g., Alt, Ctrl, etc.)
    if (event.code === "Enter") {
        // As far as TypeScript knows, there may be *many* elements with this class.
        var maybeInputs = document.getElementsByClassName('repl-command-box');
        // Assumption: there's only one thing
        var maybeInput = maybeInputs.item(0);
        // Is the thing there? Is it of the expected type? 
        //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
        if (maybeInput == null) {
            console.log("Couldn't find input element");
        }
        else if (!(maybeInput instanceof HTMLInputElement)) {
            console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
        }
        else {
            // Notice that we're passing *THE FUNCTION* as a value, not calling it.
            // The browser will invoke the function when a key is pressed with the input in focus.
            //  (This should remind you of the strategy pattern things we've done in Java.)
            mostRecentCommand = maybeInput.value;
            parseCommandCall(maybeInput.value);
            maybeInput.value = "";
            var history_2 = document.getElementsByClassName("repl-history")[0];
            var historyHeight = history_2.scrollHeight;
            history_2.scrollTo(0, historyHeight);
        }
    }
}
function parseCommandCall(command) {
    var instruction = command.split(" ")[0];
    switch (instruction) {
        case "mode": {
            modeSwitch();
            break;
        }
        case "load_file": {
            console.log("got load_file command!");
            //TODO: catch for bad input (no file path?)
            csvLoader(command.split(" ")[1]);
            //something else...
            break;
        }
        case "view": {
            csvViewer();
            //something else...
            break;
        }
        case "search": {
            console.log("got load_file command!");
            //something else...
            //handle situations where we don't get a column or search term
            break;
        }
        case "echo": {
            print(command.substring(5));
            break;
        }
        case "help": {
            print("\Available commands: \n \
            mode: switch between verbose and brief results \n \
            load_file <filepath>: load a csv file from a certain <filepath> \n \
            view: display a csv file \n \
            search <index> <term>: returns all rows in the loaded csv file that contain <term> in the column at <index>");
            break;
        }
        default: {
            print("Couldn't understand command!");
            //more front-end stuff... maybe a func to spit a message into history
        }
    }
}
function print(output) {
    // As far as TypeScript knows, there may be *many* elements with this class.
    var maybeDivs = document.getElementsByClassName('repl-history');
    // Assumption: there's only one thing
    var maybeDiv = maybeDivs.item(0);
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if (maybeDiv == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeDiv instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeDiv, ", but it wasn't a div"));
    }
    else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        var instruction = output.split(" ")[0];
        if (briefMode) {
            var commandNode = document.createTextNode(output);
            var commandElement = document.createElement("pre");
            commandElement.appendChild(commandNode);
            commandElement.className = "repl-command";
            maybeDiv.appendChild(commandElement);
        }
        else {
            var instruction_1 = output.split(" ")[0];
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
        }
    }
}
//TODO: When creating an output function, make switch on briefMode.
var briefMode = true;
function modeSwitch() {
    briefMode = !briefMode;
    if (briefMode) {
        print("switched to brief mode!");
    }
    else {
        print("switched to verbose mode!");
    }
}
var activeData = new Array(new Array());
function csvLoader(targetPath) {
    if (pathMapper.get(targetPath) !== undefined) {
        activeData = pathMapper.get(targetPath);
        //TODO: fix formatting
        print(targetPath + " has been loaded! 😸");
    }
    else {
        //TODO: fix formatting
        print("Couldn\'t find " + targetPath + " 😿");
    }
}
function csvViewer() {
    var replHistory = document.getElementsByClassName("repl-history")[0];
    var table = document.createElement("table");
    for (var row = 0; row < activeData.length; row++) {
        var rowElement = table.appendChild(document.createElement("tr"));
        for (var col = 0; col < activeData[row].length; col++) {
            var colNode = document.createTextNode(activeData[row][col]);
            var colElement = document.createElement("td");
            colElement.appendChild(colNode);
            colElement.className = "repl-command";
            rowElement.appendChild(colElement);
        }
    }
    replHistory.appendChild(table);
}
function csvSearcher(targIndex, searchTerm) {
    console.log("not implemented yet, go yell at connor");
    var accumulatedRows = new Array();
    var intIndex = -1;
    var potentialIntIndex = parseInt(targIndex);
    if (potentialIntIndex.toString() == targIndex) {
        //we know it's an int index
        intIndex = potentialIntIndex;
    }
    else {
        //we know it's an str header
        intIndex = activeData[0].indexOf(targIndex);
    }
    if (intIndex < 0 || intIndex >= activeData.sort(function (a, b) { return a.length - b.length; })[0].length) {
        console.log("Index doesn't exist or is out of bounds!");
    }
    activeData.forEach(function (row) {
        if (row.includes(searchTerm)) {
            accumulatedRows.push(row);
        }
    });
    console.log(accumulatedRows.toString());
}
// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export { prepareButtonPress, handleButtonPress };
//TODO: Better names
//TODO: Check if we /need/ numbers as a base or if just assuming everything is given as a workable string is acceptable
var testData1 = [["1", "2", "3"], ["a", "b", "c"], ["true", "false", "3"]];
var testData2 = [["hi"]];
var testData3 = [["hello"], ["elements"], ["items"], ["objects"]];
var testData4 = [["hello"], ["things", "bump"], ["weilufb"], ["data"]];
var testData5 = [["long", "very long", "very very very long", "verrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrry long"], ["1", "2", "3", "4"]];
var testData6 = [[]];
//TODO: More test data
var pathMapper = new Map();
pathMapper.set("/test/dataOne.csv", testData1);
pathMapper.set("/test/dataTwo.csv", testData2);
pathMapper.set("/test/dataThree.csv", testData3);
pathMapper.set("/test/dataFoue.csv", testData4);
pathMapper.set("/test/dataFive.csv", testData5);
pathMapper.set("/test/dataSix.csv", testData6);
//TODO: Create some fake datasets + assc file paths
//i.e. lots of const xyz = [][];
