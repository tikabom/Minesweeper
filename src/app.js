import React from 'react';

import Field from './components/field';

import './app.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimension: 9,
      numMines: 20,
      board: []
    }
  }

  componentWillMount() {
    this.initBoard();
  }

  shuffle = (mines, dim) => {
    let currIdx = dim*dim;
    let randomIdx, tmpVal;
    while(currIdx >= 0) {
      randomIdx = Math.floor(Math.random() * currIdx);
      currIdx -= 1;
      tmpVal = mines[currIdx];
      mines[currIdx] = mines[randomIdx];
      mines[randomIdx] = tmpVal;
    }
  }

  setFieldValue = (val, i, j) => {
    let dim = this.state.dimension;
    let board = this.state.board;
    if (i > 0 && j > 0) {
      if (board[i-1][j-1].value == -1) val++;
    }
    if (i > 0 && j < dim-1) {
      if (board[i-1][j+1].value == -1) val++;
    }
    if (i < dim-1 && j < dim-1) {
      if (board[i+1][j+1].value == -1) val++;
    }
    if (i < dim-1 && j > 0) {
      if (board[i+1][j-1].value == -1) val++;
    }
    if (i > 0) {
      if (board[i-1][j].value == -1) val++;
    }
    if (j > 0) {
      if (board[i][j-1].value == -1) val++;
    }
    if (i < dim-1) {
      if (board[i+1][j].value == -1) val++;
    }
    if (j < dim-1) {
      if (board[i][j+1].value == -1) val++;
    }

    board[i][j].value = val;

    this.setState({ board });
  }

  initBoard = () => {
    let dim = this.state.dimension;
    let mines = new Array(dim*dim);

    for (let i = 0; i < this.state.numMines; i ++) mines[i] = -1;
    for (let i = this.state.numMines; i < dim*dim; i ++) mines[i] = 0;

    this.shuffle(mines, dim);

    let idx = 0;
    for (let i = 0; i < dim; i ++) {
      this.state.board.push([]);
      for (let j = 0; j < dim; j ++) {
        this.state.board[i].push({
          opened: false,
          flagged: false,
          value: mines[idx++]
        });
      }
    }

    for (let i = 0; i < dim; i ++) {
      for (let j = 0; j < dim; j ++) {
        if (this.state.board[i][j].value !== -1)
          this.setFieldValue(0, i, j)
      }
    }
  }

  endGame = () => {
    console.log('game over');
  }

  openNeighbors = (i, j) => {
    let board = this.state.board;
    let dim = this.state.dimension;

    if (i > 0 && j > 0) {
      if (board[i-1][j-1].value !== -1) this.onOpen(i-1, j-1);
    }
    if (i > 0 && j < dim-1) {
      if (board[i-1][j+1].value !== -1) this.onOpen(i-1, j+1);
    }
    if (i < dim-1 && j < dim-1) {
      if (board[i+1][j+1].value !== -1) this.onOpen(i+1, j+1);
    }
    if (i < dim-1 && j > 0) {
      if (board[i+1][j-1].value !== -1) this.onOpen(i+1, j-1);
    }
    if (i > 0) {
      if (board[i-1][j].value !== -1) this.onOpen(i-1, j);
    }
    if (j > 0) {
      if (board[i][j-1].value !== -1) this.onOpen(i, j-1);
    }
    if (i < dim-1) {
      if (board[i+1][j].value !== -1) this.onOpen(i+1, j);
    }
    if (j < dim-1) {
      if (board[i][j+1].value !== -1) this.onOpen(i, j+1);
    }
  }

  onOpen = (i, j) => {
    let dim = this.state.dimension;
    let field = this.state.board[i][j];
    if (!field.opened && !field.flagged) {
      let board = this.state.board;
      board[i][j].opened = true;
      this.setState({ board });

      if (field.value === -1) this.endGame();
      else if (field.value === 0) this.openNeighbors(i, j);
    }
  }

  onFlag = (i,j) => {
    let dim = this.state.dimension;
    let field = this.state.board[i][j];
    if (!field.opened && !field.flagged) {
      let board = this.state.board;
      board[i][j].flagged = true;
      this.setState({ board });
    }
  }

  render() {
    let board = this.state.board.map((fields, i) => {
      return (
        <div className="fieldrow">
          {fields.map((field, j) =>
            <Field
              row={i}
              col={j}
              opened={field.opened}
              flagged={field.flagged}
              value={field.value}
              mine={field.value === -1}
              onOpen={this.onOpen}
              onFlag={this.onFlag} />)}
        </div>
      );
    });
    return (
      <div>
        {board}
      </div>
    );
  }
}

export default App;
