"use strict";
import { Game } from "./game.js";

class Rack {
  constructor() {
    // TODO
    this.availablePieces = [];
  }

  /**
   * Returns an object of available tiles mapped to their amount.
   * @returns {Object<string, number>} An object describing the tiles available in this rack.
   */
  getAvailableTiles() {
    // TODO
    let availablePiecesObj = {};
    for (let i = 0; i < this.availablePieces.length; ++i) {
      if (!availablePiecesObj.hasOwnProperty(this.availablePieces[i])) {
          availablePiecesObj[this.availablePieces[i]] = 1;
      }
      else availablePiecesObj[this.availablePieces[i]] += 1;
    }
    return availablePiecesObj;
  }

  /**
   * This function will draw n tiles from the game's bag.
   * If there are not enough tiles in the bag, this should take all the remaining ones.
   * @param {number} n The number of tiles to take from the bag.
   * @param {Game} game The game whose bag to take the tiles from.
   */
  takeFromBag(n, game) {
    this.availablePieces = this.availablePieces.concat(game.takeFromBag(n));
  }

  getTiles() {
    return this.availablePieces;
  }

  //create rack data structure

  renderRack(element) {
    element.innerHTML = "";
    for (let i = 0; i < 7; ++i) {
      let temp = "";
      if (this.availablePieces[i] === undefined) { temp = document.createTextNode(""); }
      else{ temp = document.createTextNode(this.availablePieces[i]); }
      //else{ temp = document.createTextNode(""); }
      //let temp = document.createTextNode("");

      var square = document.createElement("div");
    
      //if (this.availablePieces[i] !== '') temp = document.createTextNode(this.availablePieces[i]);
      //square.classList.add(this.availablePieces[i])
      square.classList.add("mainColor");
      square.classList.add("rackItem");
      square.appendChild(temp);
      element.appendChild(square);
    }
  }

}

export { Rack };
