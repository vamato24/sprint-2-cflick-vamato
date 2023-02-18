# Sprint 2: Echo

### Author: Vincent Amato (vamato) and Connor Flick (cflick)

### Estimated Time to Complete Project: ~20 hours (combined!)

**Link to [repository](https://github.com/cs0320-s2023/sprint-2-cflick-vamato)**

#### How to Run the Web Application

Just open up the index.html file in the project in your web browser of choice!

#### Design Choices

There are four main files in this project: index.html, main.js, main.ts, and main.css. Index.html is the HTML markdown for the project. It includes a REPL history area, a text input for commands, and a button to submit the commands. Main.css provides styles for the web application. Main.js is the compilied version of main.ts, the TypeScript file that contains all of our code for interacting with the web application. When interacting with the web application, users can run commands and the results of those commands are added to the REPL history, which is essentially just a div that contains the output of every command that has been run. Commands are interpreted in the TypeScript file which converts each command's output into a pre element or a table depending on the command executed.

#### Tests

##### DOM Tests

To run these tests, run "npm test". Relies on jest.

###### print: adds text to history

This test makes sure that text is correctly added to the history element.

##### command is read correctly from input

This test makes sure that commands are correctly read from the input field.

##### loading a file updates internal state

This test ensures that loading a file updates the internal state of the application.

##### load_file: produces proper brief outputs

This test checks that load_file command produces the correct outputs to history while updating internal state. Moves between files that do and do not exist.

##### view: adds a table to history with the correct structure

This test ensures that the view command correctly adds a table representing the loaded csv data to the history element.

##### search: adds a row to history correctly

This test ensures that the search command correctly adds a table with the expected number of rows to the history element.

##### search: adds rows (plural) to history correctly

This test des the same as above, just ensuring that it also works with several rows at once.

##### mode: switching modes updates internal state

This test ensures that switching modes via the command input updates the internal state of the application.

##### load_file: command is managed with verbose mode

This test makes sure that load_file produces the correct outputs when the program is in verbose mode.

##### view: table is managed with verbose mode

This test makes sure that view produces the correct outputs and tables when the program is in verbose mode.

##### view: no data loaded

This test checks to see that view doesn't produce a visble table when no data has been loaded beforehand.

##### search: table is managed with verbose mode

This test makes sure that search produces the correct outputs and tables when the program is in verbose mode.

##### input illegal commands brief

This test applies multiple commands to the input box that are not previously recognized, making sure repl-history is updated accordingly.

##### search: returns no matching elements

This test makes sure a table with no elements is produced when the search result contains no elements.

##### search: spaced term

This test checks that search terms still work, even when they contain spaces (i.e. "search 2 some words". "some words" is the search term)

##### search across multiple files

This test checks consistent state using search by loading and searching several files in a row, ensuring that they are being properly updated at each step.

##### view across multiple files

This test checks consistent state using view by loading and viewing several files in a row, ensuring that they are being properly updated at each step.

##### Main Tests

##### modeSwitch changes mode

Checks that modeSwitch changes the value of briefMode consistently.

##### csvLoader incorrect loads doesn't affect active state

Checks that a failed csv load doesn't remove the previously loaded data from being active. 

##### csvLoader correct loads affects active

This test checks that a properly found csv does remove the previously loaded csv from being active, replacing it with itself.

##### csvLoader incorrect loads doesn't unload previous

Similar to the "doesn't affect active state," except now using currently active data (i.e. not empty arrays). 

##### parseCommand correct commands

Checks that parseCommand is able to effectively handle known string commands, producing signature results of either printing or searching in the process.

##### parseCommand incorrect commands

Checks that incorrect commands given to parseCommand return false, and that search without proper arguments will throw.

** EVERYTHING BELOW THIS POINT IS RELATED TO CSVSEARCHER AND OUT OF SCOPE **

##### csvSearcher Out Of Bounds

This test checks that csvSearcher throws an error when the given targIndex is out of bounds.

##### csvSearcher Search by num index

This test ensures that csvSearch is able to parse out a int index and search within that column.

##### csvSearcher Search by text header

This test checks that csvSearch can parse out a string header and search within that column.

##### csvSearcher no data

This test checks that csvSearcher throws when given empty arrays.

##### csvSearcher empty string

This test makes sure that csvSearcher can operate on an empty string, but not an empty array.
