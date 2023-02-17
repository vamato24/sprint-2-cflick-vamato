import * as main from "./main";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
var startHTML = "<div class=\"repl\">\n    <label for=\"history\">History</label>\n    <div class=\"repl-history\" data-testid=\"history\"></div>\n    <div class=\"repl-input\">\n        <label for=\"repl-command-box\">Command Input</label>\n        <input type=\"text\" class=\"repl-command-box\" id=\"repl-command-box\"/>\n        <button type=\"button\" class=\"repl-button\">Submit</button>\n    </div>\n</div>";
var submitButton;
var replInput;
var replHistory;
beforeEach(function () {
    document.body.innerHTML = startHTML;
    main.clearHistory();
    submitButton = screen.getByText("Submit");
    replInput = screen.getByLabelText("Command Input");
    replHistory = screen.getAllByTestId("history")[0];
});
test("print: adds text to history", function () {
    main.print("Does this work?");
    var printResult = screen.getAllByText("Does this work?");
    expect(printResult.length).toBe(1);
    expect(replHistory.firstChild).toBe(printResult[0]);
});
test("command is read correctly from input", function () {
    var command = "echo hi";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    var echoResult = screen.getAllByText("hi");
    expect(replHistory.childNodes.length).toBe(1);
    expect(replHistory.firstChild).toBe(echoResult[0]);
});
test("loading a file updates internal state", function () {
    var command = "load_file /test/dataNine.csv";
    replInput.innerHTML = command;
    var testDataNine = [
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
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    expect(main.returnActiveData()).toEqual(testDataNine);
});
test("load_file: produces proper brief outputs", function () {
    var command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    var outputGoodTextOne = screen.getByText("/test/dataOne.csv has been loaded! 😸");
    var testData1 = [
        ["1", "2", "3"],
        ["a", "b", "c"],
        ["true", "false", "3"],
        ["3", "6", "9"],
    ];
    expect(main.returnActiveData()).toEqual(testData1);
    command = "load_file woefin";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var outputBadText = screen.getByText("Couldn't find woefin 😿");
    command = "load_file";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var outputUndefText = screen.getByText("Couldn't find undefined 😿");
    command = "load_file /test/dataTwo.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var outputGoodTextTwo = screen.getByText("/test/dataTwo.csv has been loaded! 😸");
    var testData2 = [["hi"]];
    expect(replHistory.children.length).toBe(4);
    expect(replHistory.children.item(0)).toBe(outputGoodTextOne);
    expect(replHistory.children.item(1)).toBe(outputBadText);
    expect(replHistory.children.item(2)).toBe(outputUndefText);
    expect(replHistory.children.item(3)).toBe(outputGoodTextTwo);
    expect(main.returnActiveData()).toEqual(testData2);
});
test("view: adds a table to history with the correct structure", function () {
    var _a, _b;
    var command = "load_file /test/dataTen.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "view";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var csvOutput = (_a = screen.getByText("Vinny").parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    expect(replHistory.childNodes.length).toBe(2);
    expect(replHistory.children.item(1)).toBe(csvOutput);
    expect((_b = replHistory.children.item(1)) === null || _b === void 0 ? void 0 : _b.childNodes.length).toBe(4);
});
test("search: adds a row to history correctly", function () {
    var _a, _b;
    var command = "load_file /test/dataTen.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "search Name Vinny";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutput = screen.getByText("Vinny").parentElement;
    expect(replHistory.childNodes.length).toBe(2);
    expect((_a = replHistory.children.item(1)) === null || _a === void 0 ? void 0 : _a.children.item(0)).toBe(rowOutput);
    expect((_b = replHistory.children.item(1)) === null || _b === void 0 ? void 0 : _b.children.length).toBe(1);
});
test("search: adds rows (plural) to history correctly", function () {
    var _a, _b, _c;
    var command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "search 2 3";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutput = screen.getAllByText("3");
    expect(replHistory.childNodes.length).toBe(2);
    expect((_a = replHistory.children.item(1)) === null || _a === void 0 ? void 0 : _a.children.item(0)).toBe(rowOutput[0].parentElement);
    expect((_b = replHistory.children.item(1)) === null || _b === void 0 ? void 0 : _b.children.item(1)).toBe(rowOutput[1].parentElement);
    expect((_c = replHistory.children.item(1)) === null || _c === void 0 ? void 0 : _c.children.length).toBe(2);
});
test("mode: switching modes updates internal state", function () {
    var command = "mode";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    var commandText = screen.getByText("Command: mode");
    var outputText = screen.getByText("Output: switched to verbose mode!");
    expect(replHistory.children.length).toBe(2);
    expect(replHistory.children.item(0)).toBe(commandText);
    expect(replHistory.children.item(1)).toBe(outputText);
    expect(main.getBriefMode()).toBe(false);
});
test("load_file: command is managed with verbose mode", function () {
    var command = "mode";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var commandText = screen.getByText("Command: load_file /test/dataOne.csv");
    var outputText = screen.getByText("Output: /test/dataOne.csv has been loaded! 😸");
    expect(replHistory.children.length).toBe(4);
    expect(replHistory.children.item(2)).toBe(commandText);
    expect(replHistory.children.item(3)).toBe(outputText);
    expect(main.getBriefMode()).toBe(false);
});
test("view: table is managed with verbose mode", function () {
    var _a, _b;
    var command = "mode";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "view";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var verboseCommand = screen.getByText("Command: view");
    var verboseOutput = screen.getByText("Output:");
    var csvOutput = (_a = screen.getByText("b").parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    expect(replHistory.children.length).toBe(7);
    expect(replHistory.children.item(4)).toBe(verboseCommand);
    expect(replHistory.children.item(5)).toBe(verboseOutput);
    expect(replHistory.children.item(6)).toBe(csvOutput);
    expect((_b = replHistory.children.item(6)) === null || _b === void 0 ? void 0 : _b.childNodes.length).toBe(4);
    expect(main.getBriefMode()).toBe(false);
});
test("view: no data loaded", function () {
    var command = "view";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    expect(replHistory.children.length).toBe(1);
});
test("search: table is managed with verbose mode", function () {
    var _a, _b, _c;
    var command = "mode";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "search 2 3";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var verboseCommand = screen.getByText("Command: search 2 3");
    var verboseOutput = screen.getByText("Output:");
    var csvOutput = screen.getAllByText("3");
    expect(replHistory.children.length).toBe(7);
    expect(replHistory.children.item(4)).toBe(verboseCommand);
    expect(replHistory.children.item(5)).toBe(verboseOutput);
    expect(replHistory.children.item(6)).toBe((_a = csvOutput[0].parentElement) === null || _a === void 0 ? void 0 : _a.parentElement);
    expect((_b = replHistory.children.item(6)) === null || _b === void 0 ? void 0 : _b.children.item(0)).toBe(csvOutput[0].parentElement);
    expect((_c = replHistory.children.item(6)) === null || _c === void 0 ? void 0 : _c.childNodes.item(1)).toBe(csvOutput[1].parentElement);
    expect(main.getBriefMode()).toBe(false);
});
test("input illegal commands brief", function () {
    var command = "";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "echoview";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "uwefdfyuiwefuiewfweui";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "echoo something";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var failureOutput = screen.getAllByText("Couldn't understand command!")[0];
    expect(replHistory.children.length).toBe(4);
    for (var i = 0; i < 4; i++) {
        expect(replHistory.children.item(i)).toEqual(failureOutput);
    }
});
test("input illegal commands verbose", function () {
    var command = "mode";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "weouifbweouifn";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var verboseCommand = screen.getByText("Command: weouifbweouifn");
    var verboseOutput = screen.getByText("Output: Couldn't understand command!");
    expect(replHistory.children.length).toBe(4);
    expect(replHistory.children.item(2)).toBe(verboseCommand);
    expect(replHistory.children.item(3)).toBe(verboseOutput);
});
test("search: returns no matching elements", function () {
    var command = "MODE";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "search 0 8";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var verboseCommand = screen.getByText("Command: search 0 8");
    var verboseOutput = screen.getByText("Output:");
    expect(function () { screen.getAllByText("8"); }).toThrow();
    expect(replHistory.children.length).toBe(7);
    expect(replHistory.children.item(4)).toBe(verboseCommand);
    expect(replHistory.children.item(5)).toBe(verboseOutput);
    expect(main.getBriefMode()).toBe(false);
});
test("search: spaced term", function () {
    var _a, _b;
    var command = "load_file /test/dataNine.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "search ProperName Barnard's Star";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutput = screen.getByText("Barnard's Star");
    expect(replHistory.childNodes.length).toBe(2);
    expect((_a = replHistory.children.item(1)) === null || _a === void 0 ? void 0 : _a.children.item(0)).toBe(rowOutput.parentElement);
    expect((_b = replHistory.children.item(1)) === null || _b === void 0 ? void 0 : _b.children.length).toBe(1);
});
test("search across multiple files", function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var command = "load_file /test/dataNine.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "search ProperName Barnard's Star";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputNine = screen.getByText("Barnard's Star");
    command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "search 2 3";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputOne = screen.getAllByText("3");
    command = "load_file /test/dataSeven.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "search fourty4 hello";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputSeven = screen.getByText("hello");
    command = "load_file /test/dataFour.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "search hello things";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputFour = screen.getByText("things");
    expect(replHistory.childNodes.length).toBe(8);
    expect((_a = replHistory.children.item(1)) === null || _a === void 0 ? void 0 : _a.children.item(0)).toBe(rowOutputNine.parentElement);
    expect((_b = replHistory.children.item(1)) === null || _b === void 0 ? void 0 : _b.children.length).toBe(1);
    expect((_c = replHistory.children.item(3)) === null || _c === void 0 ? void 0 : _c.children.length).toBe(2);
    expect(replHistory.children.item(3)).toBe((_d = rowOutputOne[0].parentElement) === null || _d === void 0 ? void 0 : _d.parentElement);
    expect((_e = replHistory.children.item(3)) === null || _e === void 0 ? void 0 : _e.children.item(0)).toBe(rowOutputOne[0].parentElement);
    expect((_f = replHistory.children.item(3)) === null || _f === void 0 ? void 0 : _f.childNodes.item(1)).toBe(rowOutputOne[1].parentElement);
    expect((_g = replHistory.children.item(5)) === null || _g === void 0 ? void 0 : _g.children.item(0)).toBe(rowOutputSeven.parentElement);
    expect((_h = replHistory.children.item(5)) === null || _h === void 0 ? void 0 : _h.children.length).toBe(1);
    expect((_j = replHistory.children.item(7)) === null || _j === void 0 ? void 0 : _j.children.item(0)).toBe(rowOutputFour.parentElement);
    expect((_k = replHistory.children.item(7)) === null || _k === void 0 ? void 0 : _k.children.length).toBe(1);
});
test("view across multiple files", function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var command = "load_file /test/dataNine.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "view";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputNine = (_a = screen.getByText("Barnard's Star").parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    command = "load_file /test/dataOne.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "view";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputOne = (_b = screen.getByText("b").parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
    command = "load_file /test/dataSeven.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "view";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputSeven = (_c = screen.getByText("hello").parentElement) === null || _c === void 0 ? void 0 : _c.parentElement;
    command = "load_file /test/dataFour.csv";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    command = "view";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutputFour = (_d = screen.getByText("things").parentElement) === null || _d === void 0 ? void 0 : _d.parentElement;
    expect(replHistory.childNodes.length).toBe(8);
    expect(replHistory.children.item(1)).toBe(rowOutputNine);
    expect((_e = replHistory.children.item(1)) === null || _e === void 0 ? void 0 : _e.children.length).toBe(11);
    expect(replHistory.children.item(3)).toBe(rowOutputOne);
    expect((_f = replHistory.children.item(3)) === null || _f === void 0 ? void 0 : _f.children.length).toBe(4);
    expect(replHistory.children.item(5)).toBe(rowOutputSeven);
    expect((_g = replHistory.children.item(5)) === null || _g === void 0 ? void 0 : _g.children.length).toBe(3);
    expect(replHistory.children.item(7)).toBe(rowOutputFour);
    expect((_h = replHistory.children.item(7)) === null || _h === void 0 ? void 0 : _h.children.length).toBe(4);
});
