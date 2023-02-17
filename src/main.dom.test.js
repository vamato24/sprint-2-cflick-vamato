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
    submitButton.addEventListener("click", function () { return main.parseCommandCall(command); });
    userEvent.click(submitButton);
    var echoResult = screen.getAllByText("hi");
    expect(replHistory.childNodes.length).toBe(1);
    expect(replHistory.firstChild).toBe(echoResult[0]);
});
test("loading a file updates internal state", function () {
    var command = "load_file /test/dataSeven.csv";
    replInput.innerHTML = command;
    var testDataSeven = [
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
    submitButton.addEventListener("click", function () { return main.parseCommandCall(command); });
    userEvent.click(submitButton);
    expect(main.getActiveData()).toEqual(testDataSeven);
});
test("view: adds a table to history with the correct structure", function () {
    var _a, _b;
    var command = "load_file /test/dataEight.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { return main.parseCommandCall(command); });
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
    var command = "load_file /test/dataEight.csv";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { return main.parseCommandCall(command); });
    userEvent.click(submitButton);
    command = "search Name Vinny";
    replInput.innerHTML = command;
    userEvent.click(submitButton);
    var rowOutput = screen.getByText("Vinny").parentElement;
    expect(replHistory.childNodes.length).toBe(2);
    expect((_a = replHistory.children.item(1)) === null || _a === void 0 ? void 0 : _a.children.item(0)).toBe(rowOutput);
    expect((_b = replHistory.children.item(1)) === null || _b === void 0 ? void 0 : _b.children.length).toBe(1);
});
test("mode: switching modes updates internal state", function () {
    var command = "mode";
    replInput.innerHTML = command;
    submitButton.addEventListener("click", function () { return main.parseCommandCall(command); });
    userEvent.click(submitButton);
    var commandText = screen.getByText("Command: mode");
    var outputText = screen.getByText("Output: switched to verbose mode!");
    expect(replHistory.children.length).toBe(2);
    expect(replHistory.children.item(0)).toBe(commandText);
    expect(replHistory.children.item(1)).toBe(outputText);
    expect(main.getBriefMode()).toBe(false);
});
