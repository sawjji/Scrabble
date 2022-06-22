import { Game } from "./game.js";
import { replaceWildcard, canConstructWord, baseScore, possibleWords, bestPossibleWords, isValid } from "./scrabbleUtils.js";
import { Rack } from "./rack.js";

const storage = window.localStorage;
const game = new Game();
const rack = new Rack();
const rackp2 = new Rack();
game.render(document.getElementById("board"));
const hintTxt = document.createElement("div");

if (rack.getTiles().length === 0) rack.takeFromBag(7, game);
if (rackp2.getTiles().length === 0) rackp2.takeFromBag(7, game);
rack.renderRack(document.getElementById("gridRack"));
rackp2.renderRack(document.getElementById("gridRack2"));


let turnTracker = true;
document.getElementById("turnTracker").innerText = document.getElementById("txt1").value + "'s Turn"

console.log(rack.getTiles())

console.log(turnTracker)
let button = document.createElement("button");
button.innerHTML = "Play!";
button.addEventListener("click", function () {
    //console.log(turnTracker);
    let word = document.getElementById("word").value;
    let xAxis = document.getElementById("xAxis").value;
    let yAxis = document.getElementById("yAxis").value;
    var dir = document.getElementById("direction");
    var strUser = dir.options[dir.selectedIndex].text;
    let direction = true;
    if ("Vertical" === strUser) direction = false;
    //rack.render(document.getElementById("gridRack"));

    //console.log(rack.getTiles())
    //create a list of possible words from this rack
    let r = turnTracker ? rack : rackp2;
    let emptyObj = {};
    for (let i = 0; i < r.getTiles().length; ++i) {
        if (emptyObj.hasOwnProperty(r.getTiles()[i])) {
        emptyObj[r.getTiles()[i]]++;
        }
        else {
        emptyObj[r.getTiles()[i]] = 1;
        }
    }

    //need to see if the word I entered is possible with rack
    //call canConstructWord
    if (!isValid(word.toLowerCase())) {
        alert("Not A Word!");
    }  
    else if (!canConstructWord(emptyObj, word) ) {
        alert("This Word Is Not Possible With The Current Rack Elements!");
    }
    else if(game.playAt(word, {x: parseInt(xAxis), y: parseInt(yAxis)}, direction) === -1) {
        alert("Word Cannot Be Placed There!")
    }
    else {
        //else { turnTracker = !turnTracker;
        //remove letters in word from rack
        //first turn word into an array
        let wordAsArr = word.split('');
        //removes items from rack ONLY if there is nothing else in that position and playat is valid!!
        if (isValid(word.toLowerCase()) && game.playAt(word, {x: parseInt(xAxis), y: parseInt(yAxis)}, direction) !== -1 && canConstructWord(emptyObj, word)) {
            for (let i = 0; i < wordAsArr.length; ++i) {
                let indexOfFirstLetter = r.getTiles().indexOf(wordAsArr[i]);
                if (indexOfFirstLetter > -1) {
                    r.availablePieces.splice(indexOfFirstLetter, 1); // 2nd parameter means remove one item only
                }
            }
        }
        turnTracker = !turnTracker;
        document.getElementById("turnTracker").innerText = turnTracker ? document.getElementById("txt1").value + "'s Turn" : document.getElementById("txt2").value + "'s Turn";
        console.log(turnTracker);

        if (r.getTiles().length < 7 && game.playAt(word, {x: parseInt(xAxis), y: parseInt(yAxis)}, direction) !== -1 && isValid(word.toLowerCase()) && canConstructWord(emptyObj, word)) {
            r.takeFromBag(7 - r.getTiles().length, game);
        }

        //make sure it has less than or equal to 7
    r.renderRack(document.getElementById(turnTracker ? "gridRack2" : "gridRack"));
    game.getGrid();
    }

    saveState();
    document.getElementById("word").value = "";
    document.getElementById("xAxis").value = "";
    document.getElementById("yAxis").value = "";
    hintTxt.innerHTML = "";
    game.render(document.getElementById("board"));

});
document.body.appendChild(button);

let button2 = document.createElement("button");
button2.innerHTML = "Reset";
button2.addEventListener("click", function () {
    clearState();    
    const game = new Game();
    game.render(document.getElementById("board"));
});
document.body.appendChild(button2);

let button3 = document.createElement("button");
button3.innerHTML = "Help!";
button3.addEventListener("click", function () {
    console.log(turnTracker);
    let rackPieces = (turnTracker ? rack : rackp2).getTiles()
    //rack.renderRack(document.getElementById("gridRack"))

    let emptyObj = {};
    for (let i = 0; i < rackPieces.length; ++i) {
        if (emptyObj.hasOwnProperty(rackPieces[i])) {
        emptyObj[rackPieces[i]]++;
        }
        else {
        emptyObj[rackPieces[i]] = 1;
        }
    }
    console.log(emptyObj)
    let arrBestWords = bestPossibleWords(emptyObj);
    //if arrBestWords is undefined, what do i do?????
    let highestScoringWord = arrBestWords.reduce((acc, curr) => {
        if (baseScore(acc) < baseScore(curr)) { acc = curr; }
        return acc;
    }, arrBestWords[0]);

    //NEED TO DISPLAY THIS!!!!!! BUT HOW THOUGH!>!?!!?!?!?!
    hintTxt.innerHTML = "";
    const text = document.createTextNode("hint: " + (replaceWildcard(emptyObj, highestScoringWord)));
    hintTxt.appendChild(text);
    hintTxt.classList.add("txt");
    document.body.appendChild(hintTxt);
});
document.body.appendChild(button3);

function saveState() {
    storage.setItem(
        'state',
        JSON.stringify(
            game.getGrid()
        )
    );
    storage.setItem(
        'stateRack',
        JSON.stringify(
            rack.getTiles()
        )
    );
}
function restoreState() {
    const theStateStr = storage.getItem('state');
    const theRackStr =storage.getItem('stateRack');
    if (!(theStateStr === null)) {
        game.grid = JSON.parse(theStateStr);
        rack.availablePieces = JSON.parse(theRackStr);
    }
    game.render(document.getElementById("board"));
    rack.renderRack(document.getElementById("gridRack"))
}

function clearState() {
    storage.removeItem('state');
    //storage.removeItem('state')
    game.grid = createGrid();
}

function createGrid() {
    let grid = [];
    for (let i = 0; i < 15; ++i) {
        grid[i] = [];
        for (let j = 0; j < 15; ++j) {
            grid[i][j] = '';
        }
    }
    return grid;
}

document.getElementById("txt1").addEventListener("change", function() {
    if (turnTracker) {
        document.getElementById("turnTracker").innerText = document.getElementById("txt1").value + "'s Turn"
    }
});

document.getElementById("txt2").addEventListener("change", function() {
    if (!turnTracker) {
        document.getElementById("turnTracker").innerText = document.getElementById("txt2").value + "'s Turn"
    }
}) 

restoreState();