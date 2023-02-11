
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {      
    prepareButtonPress(); 
    prepareKeypress()    

    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element 
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
}

function prepareButtonPress() {
    // As far as TypeScript knows, there may be *many* elements with this class.
    const maybeInputs: HTMLCollectionOf<Element> = document.getElementsByClassName('repl-button')
    // Assumption: there's only one thing
    const maybeInput: Element | null = maybeInputs.item(0)
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if(maybeInput == null) {
        console.log("Couldn't find input element")
    } else if(!(maybeInput instanceof HTMLButtonElement)) {
        console.log(`Found element ${maybeInput}, but it wasn't an input`)
    } else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        maybeInput.addEventListener("click", handleButtonPress);
    }
}

function handleButtonPress(event: MouseEvent) {
    // As far as TypeScript knows, there may be *many* elements with this class.
    const maybeInputs: HTMLCollectionOf<Element> = document.getElementsByClassName('repl-command-box')
    // Assumption: there's only one thing
    const maybeInput: Element | null = maybeInputs.item(0)
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if(maybeInput == null) {
        console.log("Couldn't find input element")
    } else if(!(maybeInput instanceof HTMLInputElement)) {
        console.log(`Found element ${maybeInput}, but it wasn't an input`)
    } else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        parseCommandCall(maybeInput.value);
        maybeInput.value = ""
        let history = document.getElementsByClassName("repl-history")[0]
        let historyHeight = history.scrollHeight;
        history.scrollTo(0, historyHeight)

    }
}

function prepareKeypress() {
    // As far as TypeScript knows, there may be *many* elements with this class.
    const maybeInputs: HTMLCollectionOf<Element> = document.getElementsByClassName('repl-command-box')
    // Assumption: there's only one thing
    const maybeInput: Element | null = maybeInputs.item(0)
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if(maybeInput == null) {
        console.log("Couldn't find input element")
    } else if(!(maybeInput instanceof HTMLInputElement)) {
        console.log(`Found element ${maybeInput}, but it wasn't an input`)
    } else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        maybeInput.addEventListener("keypress", handleKeypress);
    }
}

function handleKeypress(event: KeyboardEvent) {    
    // The event has more fields than just the key pressed (e.g., Alt, Ctrl, etc.)
    if (event.code === "Enter") {
            // As far as TypeScript knows, there may be *many* elements with this class.
        const maybeInputs: HTMLCollectionOf<Element> = document.getElementsByClassName('repl-command-box')
        // Assumption: there's only one thing
        const maybeInput: Element | null = maybeInputs.item(0)
        // Is the thing there? Is it of the expected type? 
        //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
        if(maybeInput == null) {
            console.log("Couldn't find input element")
        } else if(!(maybeInput instanceof HTMLInputElement)) {
            console.log(`Found element ${maybeInput}, but it wasn't an input`)
        } else {
            // Notice that we're passing *THE FUNCTION* as a value, not calling it.
            // The browser will invoke the function when a key is pressed with the input in focus.
            //  (This should remind you of the strategy pattern things we've done in Java.)
            parseCommandCall(maybeInput.value);
            maybeInput.value = ""
            let history = document.getElementsByClassName("repl-history")[0]
            let historyHeight = history.scrollHeight;
            history.scrollTo(0, historyHeight)

    }
    }
}

function parseCommandCall(command: string) {
    let instruction = command.split(" ")[0]     
    switch (instruction) {
        case "mode": {
            console.log("got mode command!");
            modeSwitch()
            //parse out info
            //call func
            //indicate result in command history.

            break;
        }
        case "load_file": {
            console.log("got load_file command!");
            //TODO: catch for bad input (no file path?)
            csvLoader(command.split(" ")[1])
            //something else...
            break;
        }
        case "view": {
            console.log("got view command!");
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
            print(command)
            break
        }
        default: {
            console.log("Couldn't understand command!")
            //more front-end stuff... maybe a func to spit a message into history
        }
    }
}

function print(command: string) {
    
    
    // As far as TypeScript knows, there may be *many* elements with this class.
    const maybeDivs: HTMLCollectionOf<Element> = document.getElementsByClassName('repl-history')
    // Assumption: there's only one thing
    const maybeDiv: Element | null = maybeDivs.item(0)
    // Is the thing there? Is it of the expected type? 
    //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
    if(maybeDiv == null) {
        console.log("Couldn't find input element")
    } else if(!(maybeDiv instanceof HTMLDivElement)) {
        console.log(`Found element ${maybeDiv}, but it wasn't a div`)
    } else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        let instruction = command.split(" ")[0]     
        
        if (briefMode) {
            const commandNode = document.createTextNode(command.substring(instruction.length))
            const commandElement = document.createElement("p")
            commandElement.appendChild(commandNode)
            commandElement.className = "repl-command";
            maybeDiv.appendChild(commandElement)
        } else {
            const instruction = command.split(" ")[0];
            const verboseCommandNode = document.createTextNode("Command: " + command)
            const verboseOutputNode = document.createTextNode("Output: " + command.substring(instruction.length))
            
            const verboseCommandElement = document.createElement("p")
            verboseCommandElement.appendChild(verboseCommandNode)
            verboseCommandElement.className = "repl-command"
           
            const verboseOutputElement = document.createElement("p")
            verboseOutputElement.appendChild(verboseOutputNode)
            verboseOutputElement.className = "repl-command"

            maybeDiv.appendChild(verboseCommandElement)
            maybeDiv.appendChild(verboseOutputElement)
        }
    }
    
}

//TODO: When creating an output function, make switch on briefMode.
let briefMode = true
function modeSwitch() {
    briefMode = !briefMode
    if(briefMode) {
        console.log("switched to brief mode!")
        //front end stuff
    } else {
        console.log("switched to verbose mode!")
        //front end stuff
    }
}

let activeData = new Array(new Array());

function csvLoader(targetPath: String) {
    if(pathMapper.get(targetPath) !== undefined) {
        activeData = pathMapper.get(targetPath)
        console.log("CSV LOADED")
    } else [
        console.log("Couldn't find CSV!")
    ]
}

function csvViewer() {
    console.log("not implemented yet, go yell at connor")
    //Waiting for a container to throw an html table into...
}

function csvSearcher(targIndex: string, searchTerm: string) {
    console.log("not implemented yet, go yell at connor")
    
    let accumulatedRows = new Array()

    let intIndex = -1
    let potentialIntIndex = parseInt(targIndex)
    if(potentialIntIndex.toString() == targIndex) {
        //we know it's an int index
        intIndex = potentialIntIndex
    } else {
        //we know it's an str header
        intIndex = activeData[0].indexOf(targIndex)
    }

    if(intIndex < 0 || intIndex >= activeData.sort((a, b) => a.length - b.length)[0].length) {
        console.log("Index doesn't exist or is out of bounds!")
    }

    activeData.forEach(row => {
        if(row.includes(searchTerm)){
            accumulatedRows.push(row)
        }
    });

    console.log(accumulatedRows.toString())
}

// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export {prepareButtonPress, handleButtonPress}


//TODO: Better names
//TODO: Check if we /need/ numbers as a base or if just assuming everything is given as a workable string is acceptable
const testData1 = [["1","2","3"], ["a", "b", "c"], ["true", "false", "3"]];
const testData2 = [["hi"]]
const testData3 = [["hello"], ["elements"], ["items"], ["objects"]]
const testData4 = [["hello"], ["things", "bump"], ["weilufb"], ["data"]]
const testData5 = [["long", "very long", "very very very long", "verrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrry long"], ["1", "2", "3", "4"]]
const testData6 = [[]]

//TODO: More test data

const pathMapper = new Map();
pathMapper.set("/test/dataOne.csv", testData1);
pathMapper.set("/test/dataTwo.csv", testData2);
pathMapper.set("/test/dataThree.csv", testData3);
pathMapper.set("/test/dataFoue.csv", testData4);
pathMapper.set("/test/dataFive.csv", testData5);
pathMapper.set("/test/dataSix.csv", testData6);




//TODO: Create some fake datasets + assc file paths
    //i.e. lots of const xyz = [][];
