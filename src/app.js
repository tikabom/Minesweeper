import React from 'react';

import Field from './components/field';

import './app.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimension: 9,
      numMines: 10,
      minesFlagged: 0,
      fieldsOpened: 0,
      board: [],
      gameOver: false,
      gameWon: false
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

  setFieldValue = (val, i, j, board) => {
    let dim = this.state.dimension;
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

    return val;
  }

  initBoard = () => {
    let dim = this.state.dimension;
    let mines = new Array(dim*dim);

    for (let i = 0; i < this.state.numMines; i ++) mines[i] = -1;
    for (let i = this.state.numMines; i < dim*dim; i ++) mines[i] = 0;

    this.shuffle(mines, dim);

    let idx = 0;
    let board = [];
    for (let i = 0; i < dim; i ++) {
      board.push([]);
      for (let j = 0; j < dim; j ++) {
        board[i].push({
          opened: false,
          flagged: false,
          value: mines[idx++]
        });
      }
    }

    for (let i = 0; i < dim; i ++) {
      for (let j = 0; j < dim; j ++) {
        if (board[i][j].value !== -1)
          board[i][j].value = this.setFieldValue(0, i, j, board)
      }
    }


    this.setState({
      minesFlagged: 0,
      fieldsOpened: 0,
      board,
      gameOver: false,
      gameWon: false
    });
  }

  isGameWon = (minesFlagged, fieldsOpened) => {
    let dim = this.state.dimension;

    if (minesFlagged == this.state.numMines &&
      (fieldsOpened + minesFlagged) == (dim * dim))
        return true;

    return false;
  }

  endGame = () => {
    let dim = this.state.dimension;
    let board = this.state.board;

    for (let i = 0; i < dim; i ++) {
      for (let j = 0; j < dim; j ++) {
        if (board[i][j].value === -1)
          board[i][j].opened = true;
      }
    }

    this.setState({ board, gameOver: true });
  }

  openNeighbors = (i, j, board, numOpened) => {
    let dim = this.state.dimension;

    if (board[i][j].opened || board[i][j].flagged) return numOpened;

    board[i][j].opened = true;
    numOpened += 1;

    if (i > 0 && j > 0) {
      if (board[i-1][j-1].value !== -1) numOpened = this.openNeighbors(i-1, j-1, board, numOpened);
    }
    if (i > 0 && j < dim-1) {
      if (board[i-1][j+1].value !== -1) numOpened = this.openNeighbors(i-1, j+1, board, numOpened);
    }
    if (i < dim-1 && j < dim-1) {
      if (board[i+1][j+1].value !== -1) numOpened = this.openNeighbors(i+1, j+1, board, numOpened);
    }
    if (i < dim-1 && j > 0) {
      if (board[i+1][j-1].value !== -1) numOpened = this.openNeighbors(i+1, j-1, board, numOpened);
    }
    if (i > 0) {
      if (board[i-1][j].value !== -1) numOpened = this.openNeighbors(i-1, j, board, numOpened);
    }
    if (j > 0) {
      if (board[i][j-1].value !== -1) numOpened = this.openNeighbors(i, j-1, board, numOpened);
    }
    if (i < dim-1) {
      if (board[i+1][j].value !== -1) numOpened = this.openNeighbors(i+1, j, board, numOpened);
    }
    if (j < dim-1) {
      if (board[i][j+1].value !== -1) numOpened = this.openNeighbors(i, j+1, board, numOpened);
    }

    return numOpened;
  }

  onOpen = (i, j) => {
    if (this.state.gameWon || this.state.gameOver) return;

    let dim = this.state.dimension;
    let field = this.state.board[i][j];
    if (!field.opened && !field.flagged) {
      let board = this.state.board;
      let fieldsOpened = this.state.fieldsOpened;
      if (field.value === -1) {
        this.endGame();
        return;
      }
      if (field.value === 0) fieldsOpened += this.openNeighbors(i, j, board, 0);
      else {
        board[i][j].opened = true;
        fieldsOpened += 1;
      }
      this.setState({
        board,
        fieldsOpened,
        gameWon: this.isGameWon(this.state.minesFlagged, fieldsOpened)
      });
    }
  }

  onFlag = (i,j) => {
    if (this.state.gameWon || this.state.gameOver) return;

    let dim = this.state.dimension;
    let field = this.state.board[i][j];
    if (!field.opened) {
      let minesFlagged = this.state.minesFlagged;
      let board = this.state.board;
      board[i][j].flagged = !board[i][j].flagged;
      if (board[i][j].flagged && field.value === -1)
        minesFlagged += 1;
      else if (!board[i][j].flagged && field.value === -1)
        minesFlagged -= 1;

      this.setState({
        board,
        minesFlagged,
        gameWon: this.isGameWon(minesFlagged, this.state.fieldsOpened)
      });
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
      <div className='game'>
        <div className='newgame'>
          <input type='button' onClick={this.initBoard} value='New Game' />
        </div>
        <div className='minesweeper'>
          {board}
        </div>
        {this.state.gameOver && (
          <div className='gameover'>Game Over!</div>
        )}
        {this.state.gameWon && (
          <div className='gamewon'>You Win!</div>
        )}
      </div>
    );
  }
}

export default App;
