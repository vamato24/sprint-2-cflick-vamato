import * as main from "./main";

import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const startHTML = `<div class="repl">
    <label for="history">History</label>
    <div class="repl-history" data-testid="history"></div>
    <div class="repl-input">
        <label for="repl-command-box">Command Input</label>
        <input type="text" class="repl-command-box" id="repl-command-box"/>
        <button type="button" class="repl-button">Submit</button>
    </div>
</div>`;

let submitButton: HTMLElement;
let replInput: HTMLElement;
let replHistory: HTMLElement;

beforeEach(() => {
  document.body.innerHTML = startHTML;

  main.clearHistory();

  submitButton = screen.getByText("Submit");
  replInput = screen.getByLabelText("Command Input");
  replHistory = screen.getAllByTestId("history")[0];
});

test("print: adds text to history", () => {
  main.print("Does this work?");

  const printResult = screen.getAllByText("Does this work?");

  expect(printResult.length).toBe(1);
  expect(replHistory.firstChild).toBe(printResult[0]);
});

test("command is read correctly from input", () => {
  const command = "echo hi";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  const echoResult = screen.getAllByText("hi");

  expect(replHistory.childNodes.length).toBe(1);
  expect(replHistory.firstChild).toBe(echoResult[0]);
});

test("loading a file updates internal state", () => {
  const command = "load_file /test/dataNine.csv";
  replInput.innerHTML = command;

  const testDataNine = [
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

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  expect(main.returnActiveData()).toEqual(testDataNine);
});

test("load_file: produces proper brief outputs", () => {
  let command = "load_file /test/dataOne.csv"
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  const outputGoodText = screen.getByText("/test/dataOne.csv has been loaded! 😸");

  command = "load_file woefin"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const outputBadText = screen.getByText("Couldn't find woefin 😿")

  command = "load_file"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const outputUndefText = screen.getByText("Couldn't find undefined 😿")

  expect(replHistory.children.length).toBe(3);
  expect(replHistory.children.item(0)).toBe(outputGoodText);
  expect(replHistory.children.item(1)).toBe(outputBadText);
  expect(replHistory.children.item(2)).toBe(outputUndefText);
});

test("view: adds a table to history with the correct structure", () => {
  let command = "load_file /test/dataTen.csv";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "view";
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const csvOutput = screen.getByText("Vinny").parentElement?.parentElement;

  expect(replHistory.childNodes.length).toBe(2);
  expect(replHistory.children.item(1)).toBe(csvOutput);
  expect(replHistory.children.item(1)?.childNodes.length).toBe(4);
});

test("search: adds a row to history correctly", () => {
  let command = "load_file /test/dataTen.csv";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "search Name Vinny";
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const rowOutput = screen.getByText("Vinny").parentElement;

  expect(replHistory.childNodes.length).toBe(2);
  expect(replHistory.children.item(1)?.children.item(0)).toBe(rowOutput);
  expect(replHistory.children.item(1)?.children.length).toBe(1);
});

test("search: adds rows (plural) to history correctly", () => {
  let command = "load_file /test/dataOne.csv";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "search 2 3";
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const rowOutput = screen.getAllByText("3");

  expect(replHistory.childNodes.length).toBe(2);
  expect(replHistory.children.item(1)?.children.item(0)).toBe(rowOutput[0].parentElement);
  expect(replHistory.children.item(1)?.children.item(1)).toBe(rowOutput[1].parentElement);
  expect(replHistory.children.item(1)?.children.length).toBe(2);
});

test("mode: switching modes updates internal state", () => {
  let command = "mode";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  const commandText = screen.getByText("Command: mode");
  const outputText = screen.getByText("Output: switched to verbose mode!");

  expect(replHistory.children.length).toBe(2);
  expect(replHistory.children.item(0)).toBe(commandText);
  expect(replHistory.children.item(1)).toBe(outputText);
  expect(main.getBriefMode()).toBe(false);
});


test("load_file: command is managed with verbose mode", () => {
  let command = "mode";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "load_file /test/dataOne.csv"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const commandText = screen.getByText("Command: load_file /test/dataOne.csv");
  const outputText = screen.getByText("Output: /test/dataOne.csv has been loaded! 😸");

  expect(replHistory.children.length).toBe(4);
  expect(replHistory.children.item(2)).toBe(commandText);
  expect(replHistory.children.item(3)).toBe(outputText);
  expect(main.getBriefMode()).toBe(false);
});

test("view: table is managed with verbose mode", () => {
  let command = "mode";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "load_file /test/dataOne.csv"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  command = "view"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const verboseCommand = screen.getByText("Command: view")
  const verboseOutput = screen.getByText("Output:")
  const csvOutput = screen.getByText("b").parentElement?.parentElement;

  expect(replHistory.children.length).toBe(7);
  expect(replHistory.children.item(4)).toBe(verboseCommand);
  expect(replHistory.children.item(5)).toBe(verboseOutput);
  expect(replHistory.children.item(6)).toBe(csvOutput);
  expect(replHistory.children.item(6)?.childNodes.length).toBe(4);
  expect(main.getBriefMode()).toBe(false);
});

test("view: no data loaded", () => {
  let command = "view"
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  expect(replHistory.children.length).toBe(1);
});

test("search: table is managed with verbose mode", () => {
  let command = "mode";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "load_file /test/dataOne.csv"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  command = "search 2 3"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const verboseCommand = screen.getByText("Command: search 2 3")
  const verboseOutput = screen.getByText("Output:")
  const csvOutput = screen.getAllByText("3");

  expect(replHistory.children.length).toBe(7);
  expect(replHistory.children.item(4)).toBe(verboseCommand);
  expect(replHistory.children.item(5)).toBe(verboseOutput);
  expect(replHistory.children.item(6)).toBe(csvOutput[0].parentElement?.parentElement);
  expect(replHistory.children.item(6)?.children.item(0)).toBe(csvOutput[0].parentElement);
  expect(replHistory.children.item(6)?.childNodes.item(1)).toBe(csvOutput[1].parentElement);
  expect(main.getBriefMode()).toBe(false);
})


test("input illegal commands brief", () => {
  let command = "";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "echoview"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  command = "uwefdfyuiwefuiewfweui"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  command = "echoo something"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const failureOutput = screen.getAllByText("Couldn't understand command!")[0];

  expect(replHistory.children.length).toBe(4);
  for(let i = 0; i < 4; i++) {
    expect(replHistory.children.item(i)).toEqual(failureOutput);
  }
})

test("input illegal commands verbose", () => {
  let command = "mode";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "weouifbweouifn"
  replInput.innerHTML = command

  userEvent.click(submitButton);

  const verboseCommand = screen.getByText("Command: weouifbweouifn")
  const verboseOutput = screen.getByText("Output: Couldn't understand command!")

  expect(replHistory.children.length).toBe(4)
  expect(replHistory.children.item(2)).toBe(verboseCommand)
  expect(replHistory.children.item(3)).toBe(verboseOutput)
});

test("search: returns no matching elements", () => {
  let command = "MODE";
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "load_file /test/dataOne.csv"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  command = "search 0 8"
  replInput.innerHTML = command;

  userEvent.click(submitButton);

  const verboseCommand = screen.getByText("Command: search 0 8")
  const verboseOutput = screen.getByText("Output:")
  expect(() => {screen.getAllByText("8")}).toThrow()

  expect(replHistory.children.length).toBe(7);
  expect(replHistory.children.item(4)).toBe(verboseCommand);
  expect(replHistory.children.item(5)).toBe(verboseOutput);
  expect(main.getBriefMode()).toBe(false);
})

test("search: spaced term", () => {
  let command = "load_file /test/dataNine.csv"
  replInput.innerHTML = command;

  submitButton.addEventListener("click", () => {main.parseCommandCall(command)});

  userEvent.click(submitButton);

  command = "search ProperName Barnard's Star"
  replInput.innerHTML = command;

  userEvent.click(submitButton)

  const rowOutput = screen.getByText("Barnard's Star")

  expect(replHistory.childNodes.length).toBe(2);
  expect(replHistory.children.item(1)?.children.item(0)).toBe(rowOutput.parentElement);
  expect(replHistory.children.item(1)?.children.length).toBe(1);
})


