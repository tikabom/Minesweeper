# Minesweeper
Javascript implementation of minesweeper

src/app.js contains the bulk of the minesweeper logic. Below is a description of the api:
* initBoard - Initializes a new minesweeper board of size 9x9 with 10 mines. It is called when the page is loaded for the first time and when the user clicks New Game.
* shuffle - Shuffles the mines randomly on the board using the Fisher-Yates shuffle algorithm. (Ref: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
* setFieldValue - Calculates the number of mines surrounding a position in the board and sets its value to it.
* isGameWon - Checks if the player has flagged all the mines and has identified all the fields without mines.
* endGame - Called when a user clicks a mine. It reveals all the mines and ends the game.
* onOpen - Called when a user clicks a field. Does nothing if the field is already open or is flagged. If the field has a mine, endGame is called. If the field is empty, all its neighbors without mines are opened recursively. Triggered on left clicking a field.
* openNeighbors - Calls onOpen on all valid neighbors of a field.
* onFlag - Flags a field if it is not flagged and unflags it if it is. Triggered on right clicking a field.

src/components/field.js renders the fields based on the value. All styles are defined in src/components/field.css
Note: All images are obtained from Wikimedia.
