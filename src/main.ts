
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {    
    prepareKeypress()   
    prepareButtonPress(); 
    
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element 
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
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

// We'll use a global state reference for now
let pressCount = 0
function getPressCount() {
    return pressCount
}

function handleKeypress(event: KeyboardEvent) {    
    // The event has more fields than just the key pressed (e.g., Alt, Ctrl, etc.)
    pressCount = pressCount + 1
    console.log(`key pressed: ${event.key}. ${getPressCount()} presses seen so far.`)
}

function prepareButtonPress() {
    console.log("Test")
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
    console.log(`test`)
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
            break;
        }
        default: {
            console.log("Couldn't understand command!")
            //more front-end stuff... maybe a func to spit a message into history
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

function csvLoader(targetPath: String) {
    console.log("not implemented yet, go yell at connor");
}

function csvViewer() {
    console.log("not implemented yet, go yell at connor")
}

function csvSearcher() {
    console.log("not implemented yet, go yell at connor")
}

// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export {handleKeypress, prepareKeypress, getPressCount, prepareButtonPress, handleButtonPress}

const testData1 = [[1,2,3], ["a", "b", "c"], [true, false, 3]];


const pathMapper = new Map();

//TODO: Create some fake datasets + assc file paths
    //i.e. lots of const xyz = [][];
