"use strict"; 

// Here, we import the dictionary of scrabble words.
//import { dictionary } from "./dictionary.js";

let dictionary = "";
implementDictionary();
async function implementDictionary() {
  let response = await fetch("https://raw.githubusercontent.com/umass-cs-326/326-homework-07-fetch-and-multiplayer/main/dictionary.json")
  if (response.ok) {
    dictionary = await response.json();
  }
  else {
    alert("HTTP-Error: " + response.status);
  }
}
/**
 * This helper function will make a copy of a set of available tiles.
 * As you can see, this function is NOT exported. It is just a helper 
 * function for other functions in this file.
 * @param {Object<string, number>} availableTiles A mapping of available tiles 
 *                                                to their amount.
 * @returns {Object<string, number>} A copy of the parameter. 
 */
function copyAvailableTiles(availableTiles) {
  // TODO
  return JSON.parse(JSON.stringify(availableTiles));
}

function canConstructWord(availableTiles, word) {
  let wordAsObj = {};

  //turn word into an obj that keeps track of the number of times each letter appears
  word.split('').forEach(item => item in wordAsObj ? ++wordAsObj[item] : wordAsObj[item] = 1); 

  //if asterick in available tiles, set difference to negative times the number of wildcards in availableTiles
  let difference =  "*" in availableTiles ? (availableTiles["*"] * -1) : 0;

  //compare the .property of each element with the same property
  for (const property in wordAsObj) {
    let numberTimesAppearInWordObj = wordAsObj[property];
    let numberTimesAppearAvailableTiles = 0;
    if (property in availableTiles) numberTimesAppearAvailableTiles = availableTiles[property];

      //if value of property of availableTiles is smaller, get sum difference
    if (numberTimesAppearInWordObj > numberTimesAppearAvailableTiles) difference += numberTimesAppearInWordObj - numberTimesAppearAvailableTiles;
  }
  
  //at end, if sum difference is less than one, then return false
  return difference <= 0;
}

function baseScore(word) {
  // TODO
  let wordAsArr = word.split(''); 
  let value = 0;

  let zeroPoint = ['*'];
  let onePoint = ['e', 'a', 'i', 'o', 'n', 'r', 't', 'l', 's', 'u'];
  let twoPoints = ['d', 'g'];
  let threePoints = ['b', 'c', 'm', 'p'];
  let fourPoints = ['f', 'h', 'v', 'w', 'y'];
  let fivePoints = ['k'];
  let eightPoints = ['j', 'x'];
  let tenPoints = ['q', 'z'];

  for (let i = 0; i < wordAsArr.length; ++i) {
    if (zeroPoint.includes(wordAsArr[i])) value += 0;
    if (onePoint.includes(wordAsArr[i])) value += 1;
    if (twoPoints.includes(wordAsArr[i])) value += 2;
    if (threePoints.includes(wordAsArr[i])) value += 3;
    if (fourPoints.includes(wordAsArr[i])) value += 4;
    if (fivePoints.includes(wordAsArr[i])) value += 5;
    if (eightPoints.includes(wordAsArr[i])) value += 8;
    if (tenPoints.includes(wordAsArr[i])) value += 10;
  }
  return value;
}

function possibleWords(availableTiles) {
  // TODO
  //go thru each item in dictionary, if canConstruct word returns true push it in else don't do that
  let arr = [];
    for (let i = 0; i < dictionary.length; ++i) {
      if (canConstructWord(availableTiles, dictionary[i]) === true) arr.push(dictionary[i]);
    }
  return arr;
}

/**
 * This function will check if a word is valid, that is if it matches any of 
 * the words in the dictionary.
 * @param {string} word A string containing lowercase letters, with possible wildcards.
 * @returns {boolean} Returns whether the given word is a valid word.
 */
export function isValid(word) {
  // TODO
  let emptyObj = {};
  for (let i = 0; i < word.length; ++i) {
    if (emptyObj.hasOwnProperty(word[i])) {
      emptyObj[word[i]]++;
    }
    else {
      emptyObj[word[i]] = 1;
    }
  }
  let possibleWordArr = possibleWords(emptyObj);
  let sameWordArr = [];
  for (let i = 0; i < possibleWordArr.length; ++i) {
    let potentialWord = possibleWordArr[i];
    let counter = 0;
    for (let j = 0; j < potentialWord.length; ++j) {
      //if every single letter in this potential word is in word, then keep a counter
      if (word[j] === potentialWord[j] || word[j] === '*') {
        counter++;
      }
    }
    //if counter is equal to word.length, add this word to an array.
    if (counter === word.length) sameWordArr.push(potentialWord);
  }
  //at end, check if array length is greater than 0
  return sameWordArr.length > 0 ? true : false;
}

//availableTiles is an obj, word is a string
function replaceWildcard(availableTiles, word) {
  //make copy of availableTiles
  let newAvailableTiles = copyAvailableTiles(availableTiles);    //turn word into an array and make an empty array
  let wordAsArray = word.split('');
  let newWordArr = [];
  for (let i = 0; i < wordAsArray.length; ++i) {
    //if that letter is in array and the value of the property is greater 
    //than 0, push letter to array
    //subtract 1 from property
    let currLetter = wordAsArray[i];
    if (currLetter in newAvailableTiles && newAvailableTiles[currLetter] > 0) {
      newWordArr.push(currLetter);
      newAvailableTiles[currLetter] -= 1;
    }
    else {
      newWordArr.push('*');
    }
  }
  return newWordArr.join('')
}

function bestPossibleWords(availableTiles) {
  // TODO
  //call possible words on available tiles, then loop thru this array to get highest score using base score
  let arrayPossibleWords = possibleWords(availableTiles);
  let wildCardRaplcements = arrayPossibleWords.map(word => replaceWildcard(availableTiles, word));
  //make object so it's wildCardRaplcements:arrayPossibleWords
  let replacementToArrayPossibleWords = {};
  arrayPossibleWords.forEach((key, i) => replacementToArrayPossibleWords[key] = wildCardRaplcements[i]);
  
  let eachScore = wildCardRaplcements.map(x => baseScore(x));
//first get max value from this array
//then get the words with this value from the wildCardRaplcements using filter
//then match them to the original word
  let maxScore = eachScore.reduce(function(a, b) { return Math.max(a, b); }, 0);
  
  let highScoreWords = wildCardRaplcements.filter(x => baseScore(x) === maxScore);
  
  let legitWords = [];
  for (const property in replacementToArrayPossibleWords) {
    if (highScoreWords.includes(replacementToArrayPossibleWords[property])) legitWords.push(property);
  }
  return legitWords;
}

// This exports our public functions.
export { replaceWildcard, canConstructWord, baseScore, possibleWords, bestPossibleWords };
