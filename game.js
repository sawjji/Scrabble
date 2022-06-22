import { replaceWildcard, canConstructWord, baseScore, possibleWords, bestPossibleWords, isValid } from "./scrabbleUtils.js";

// ES6 modules are [actually strict by default](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#Strict_mode_for_modules)
// Therefore, you can in fact comment this out or remove it.
'use strict';

export function shuffle(array) {
  let m = array.length;

  // While there remain elements to shuffle...
  while (m) {
    // Pick a remaining element...
    const i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    const t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export class Game {
  // Include your solution code from HW3 in this class.
  // You can use the solution when released
  constructor() {
    // TODO
    this.grid = [];
    this.allTiles = [];

    //CREATING GAME GRID
    for (let i = 0; i < 15; ++i) {
      this.grid[i] = [];
      for (let j = 0; j < 15; ++j) {
        this.grid[i][j] = '';
      }
    }
    let gridVal = this.grid
    //console.log(gridVal)

    //CREATING ARRAY OF ALL LETTERS PRE-SHUFFLE
    //add the letter "e"
    for (let i = 0; i < 12; ++i) {
      this.allTiles.push("e");
    }

    //add letters "a" and "i"
    for (let i = 0; i < 18; ++i) {
      if (i < 9) this.allTiles.push("a");
      else this.allTiles.push("i");
    }

    //add the letter "o"
    for (let i = 0; i < 8; ++i) {
      this.allTiles.push("o");
    }
  
    //add letters "n", "r", and "t"
    for (let i = 0; i < 18; ++i) {
      if (i < 6) this.allTiles.push("n");
      else if (i >= 6 && i < 12) this.allTiles.push("r");
      else this.allTiles.push("t");
    }

    //add letters "l", "s", "u", and "d"
    for (let i = 0; i < 16; ++i) {
      if (i < 4) this.allTiles.push("l");
      else if (i >= 4 && i < 8) this.allTiles.push("s");
      else if (i >= 8 && i < 12) this.allTiles.push("u");
      else this.allTiles.push("d");
    }

    //add the letter "g"
    for (let i = 0; i < 3; ++i) {
      this.allTiles.push("g");
    }

    //add letters "b", "c", "m", "p", "f", "h", "v", "w", "y", wildcard
    for (let i = 0; i < 20; ++i) {
      if (i < 2) this.allTiles.push("b");
      else if (i >= 2 && i < 4) this.allTiles.push("c");
      else if (i >= 4 && i < 6) this.allTiles.push("m");
      else if (i >= 6 && i < 8) this.allTiles.push("p");
      else if (i >= 8 && i < 10) this.allTiles.push("f");
      else if (i >= 10 && i < 12) this.allTiles.push("h");
      else if (i >= 12 && i < 14) this.allTiles.push("v");
      else if (i >= 14 && i < 16) this.allTiles.push("w");
      else if (i >= 16 && i < 18) this.allTiles.push("y");
      else this.allTiles.push("*");
    }

    //add letters "k", "j", "x", "q", "z"
    this.allTiles.push("k");
    this.allTiles.push("j");
    this.allTiles.push("x");
    this.allTiles.push("q");
    this.allTiles.push("z");

    //allTiles, but shuffled:
    this.allTiles = shuffle(this.allTiles);
    //console.log(this.allTiles)

    //triple word squares, 8 total
    this.tripleWordSquares = [[1, 1], [8, 1], [15, 1], [1, 8], [15, 8], [1, 15], [8, 15], [15, 15]];
    
    //double word squares: 17 total
    this.doubleWordSquares = [[2, 2], [14, 2], [3, 3], [13, 3], [4, 4], [12, 4], [5, 5], [11, 5], [8, 8], 
    [5, 11], [11, 11], [4, 12], [12, 12], [3, 13], [13, 13], [2, 14], [14, 14]];
    
    //triple letter squares: 12 total
    this.tripleLetterSquares = [[6, 2], [10, 2], [2, 6], [6, 6], [10, 6], [14, 6], [2, 10], [6, 10], [10, 10], 
    [14, 10], [6, 14], [10, 14]];

    //double letter squares: 24 total
    this.doubleLetterSquares = [[4, 1], [12, 1], [7, 3], [9, 3], [1, 4], [8, 4], [15, 4], [3, 7], [7, 7], [9, 7], [13, 7], [4, 8], 
    [12, 8], [3, 9], [7, 9], [9, 9], [13, 9], [1, 12], [8, 12], [15, 12], [7, 13], [9, 13], [4, 15], [12, 15]];
  }

  /**
   * This function removes the first n tiles from the bag and returns them. If n
   * is greater than the number of remaining tiles, this removes and returns all
   * the tiles from the bag. If the bag is empty, this returns an empty array.
   * @param {number} n The number of tiles to take from the bag.
   * @returns {Array<string>} The first n tiles removed from the bag.
   */
  takeFromBag(n) {
    // TODO
    let nElements = [];
    if (n <= this.allTiles.length) {
      for (let i = 0; i < n; ++i) {
        nElements.push(this.allTiles.shift());
      }
      return nElements;
    }
    else if (n > this.allTiles.length && this.allTiles.length !== 0) {
      nElements = this.allTiles;
      this.allTiles = [];
      return nElements;

    }
    else if (this.allTiles.length === 0) return [];
  }

  /**
   * This function returns the current state of the board. The positions where
   * there are no tiles can be anything (undefined, null, ...).
   * @returns {Array<Array<string>>} A 2-dimensional array representing the
   * current grid.
   */
  getGrid() {
    // TODO
    return this.grid;
  }



  /**
   * This function will be called when a player takes a turn and attempts to
   * place a word on the board. It will check whether the word is valid and can
   * be placed at the given position. If not, it'll return -1. It will then
   * compute the score that the word will receive and return it, taking into
   * account special positions.
   * @param {string} word The word to be placed.
   * @param {Object<x|y, number>} position The position, an object with
   * properties x and y. Example: { x: 2, y: 3 }.
   * @param {boolean} direction Set to true if horizontal, false if vertical.
   * @returns {number} The score the word will obtain (including special tiles),
   * or -1 if the word is invalid.
   */
  //playAt(word: string, position: object, direction: Boolean): score: number
  playAt(word, position, direction) {
    word = word.toLowerCase();
    if (!isValid(word)) { return false; }

    let letterPositionMapped = {};
    let positionAsArray = [];
    let score = 0;
    let doubleScoreCounter = 0;
    let tripleScoreCounter = 0;

    //turn position from object to array
    let property;
    for (property in position) positionAsArray.push(position[property]);

    //get horizontal direction
    if (direction === true) {
      let counterHoriz = 0;
      for (let i = 0; i < word.length; i++) {
        //y value doesn't change
        if (!(word[i] in letterPositionMapped)) {
          letterPositionMapped[word[i]] = [positionAsArray[0] + i, positionAsArray[1]];
        }
        else {
          letterPositionMapped[word[i] + (counterHoriz + 1)] = [positionAsArray[0] + i, positionAsArray[1]];
          counterHoriz++;
        }
      } 
    }

    //get vertical direction
    if (direction === false) {
      let counterVert = 0;
      for (let i = 0; i < word.length; i++) {
        //y value doesn't change
        if (!(word[i] in letterPositionMapped)) {
          letterPositionMapped[word[i]] = [positionAsArray[0], positionAsArray[1] + i];
        }
        else {
          letterPositionMapped[word[i] + (counterVert + 1)] = [positionAsArray[0], positionAsArray[1] + i];
          counterVert++;
        }
      }
    }

    //check if anything in letterPositionMapped is out of bounds
    for (property in letterPositionMapped) {
      //out of bounds x-axis
      if (letterPositionMapped[property][0] < 0 || letterPositionMapped[property][0] > 15) {
        return -1;
      }
      //out of bounds y-axis
      else if (letterPositionMapped[property][1] < 0 || letterPositionMapped[property][1] > 15) {
        return -1;
      }
    }


    //check if word could be placed on board given previous game
    for (property in letterPositionMapped) {
      //HOW DO I GRID'S 2D ARRAY VALUE BASED ON PROPERTY?!?!?!??!?!?!?!?!
      //if letter is not in not in grid yet
      let letter = this.grid[letterPositionMapped[property][1] - 1][letterPositionMapped[property][0] - 1];
      //if letter in grid is not the same as the current letter

      //QUESTION:::::: CAN I PLACE WILDCARD OVER LETTER PLEASE ERIN HELP
      if (letter !== '' && letter !== property[0] && property[0] !== "*" && letter !== '*') {
        return -1;
      }
    }
    for (property in letterPositionMapped) {
      //update board with the first index value of property

      this.grid[letterPositionMapped[property][1] - 1][letterPositionMapped[property][0] - 1] = property[0];
      //add "new" to array of [x, y] so it becomes [x, y, "new"]
      letterPositionMapped[property].push("new");
    }

    //loop through array to check scores
    for (property in letterPositionMapped) {
      let tempScore = 0;
      //first get the score of the value of the property(the letter)[0] using BASESCORE FUNCTION
      tempScore = baseScore([property][0]);

      //for just special letters
      if (this.tripleLetterSquares.filter(x => x[0] === letterPositionMapped[property][0] && x[1] === letterPositionMapped[property][1]).length > 0 && letterPositionMapped[property].includes("new")) {
        tempScore *= 3;
      }
      else if(this.doubleLetterSquares.filter(x => x[0] === letterPositionMapped[property][0] && x[1] === letterPositionMapped[property][1]).length > 0 && letterPositionMapped[property].includes("new")) {
        tempScore *= 2;
      }

      //for special words
      else if(this.tripleWordSquares.filter(x => x[0] === letterPositionMapped[property][0] && x[1] === letterPositionMapped[property][1]).length > 0 && letterPositionMapped[property].includes("new")) {
        tripleScoreCounter += 1;
      }
      else if(this.doubleWordSquares.filter(x => x[0] === letterPositionMapped[property][0] && x[1] === letterPositionMapped[property][1]).length > 0 && letterPositionMapped[property].includes("new")) {
        doubleScoreCounter += 1;
      }
    score += tempScore;
    }

    if (tripleScoreCounter > 0) {
      score = tripleScoreCounter * 3 * score;
    }

    if (doubleScoreCounter > 0) {
      score = doubleScoreCounter * 2 * score;
    }
    return score;
  }

  /**
   * This method will take an HTMLElement, which will either be empty or
   * contain the current grid, and render the board in that element. For
   * example, if we have a `<div id="board"></div>`, this should be called
   * `game.render(document.getElementById('board'))`.
   * @param {HTMLElement} element an HTMLElement to render the board into.
   */
  render(element) {
    element.innerHTML = "";
    document.body.style.backgroundColor = "#ffe9ec";
    for (let i = 0; i < 15; ++i) {
      for (let j = 0; j < 15; ++j) {
        var square = document.createElement("div");
        let temp = document.createTextNode('');
        if (this.grid[i][j] !== '') temp = document.createTextNode(this.grid[i][j]);
        if (this.tripleWordSquares.some(x => (x[0] - 1 === i && x[1] - 1 === j))) {
          square.classList.add("tripleWordScore_square");
        }
        if (this.doubleWordSquares.some(x => (x[0] - 1 === i && x[1] - 1 === j))) {
          square.classList.add("doubleWordScore_square");
        }        
        if (this.tripleLetterSquares.some(x => (x[0] - 1 === i && x[1] - 1 === j))) {
          square.classList.add("tripleLetterScore_square");
        }      
        if (this.doubleLetterSquares.some(x => (x[0] - 1 === i && x[1] - 1 === j))) {
          square.classList.add("doubleLetterScore_square");
        }    
        square.classList.add("mainColor");
        square.classList.add("grid-item");
        square.appendChild(temp);
        element.appendChild(square);
      }
    }      
  }
}

