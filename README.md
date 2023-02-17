# Sprint 2: Echo

### Author: Vincent Amato (vamato) and Connor Flick (cflick)

### Estimated Time to Complete Project: 20 hours

**Link to [repository](https://github.com/cs0320-s2023/sprint-2-cflick-vamato)**

#### How to Run the Web Application

Just open up the index.html file in your web browser of choice

#### Design Choices

There are four main files in this project: index.html, main.js, main.ts, and main.css. Index.html is the HTML markdown for the project. It includes a REPL history area, a text input for commands, and a button to submit the commands. Main.css provides styles for the web application. Main.js is the compilied version of main.ts, the TypeScript file that contains all of our code for interacting with the web application. When interacting with the web application, users can run commands and the results of those commands are added to the REPL history, which is essentially just a div that contains the output of every command that has been run. Commands are interpreted in the TypeScript file which converts each command's output into a pre element or a table depending on the command executed.

#### Tests

##### DOM Tests

To run these tests, run npm test

###### print: adds text to history

This test makes sure that text is correctly added to the history element.

##### command is read correctly from input

This test makes sure that commands are correctly read from the input field.

##### loading a file updates internal state

This test ensures that loading a file updates the internal state of the application.

##### view: adds a table to history with the correct structure

This test ensures that the view command correctly adds a table representing the loaded csv data to the history element.

##### search: adds a row to history correctly

This test ensures that the search command correctly adds a table with the expected number of rows to the history element.

##### mode: switching modes updates internal state

This test ensures that switching modes via the command input updates the internal state of the application.

##### Main Tests
