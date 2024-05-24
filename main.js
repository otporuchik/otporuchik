let baseNumberObj = {
    0: "nolla", 
    1: "yksi",
    2: "kaksi",
    3: "kolme", 
    4: "neljä", 
    5: "viisi", 
    6: "kuusi", 
    7: "seitsemän", 
    8: "kahdeksan", 
    9: "yhdeksän", 
    10: "kymmenen", 
}

//init
let baseLimitInput = document.querySelector('.inputBaseLimit');
let toistaLimitInput = document.querySelector('.inputToistaLimit');
let manualLimitInput = document.querySelector('.inputManualLimit');

let minLimit = 0;
let maxLimit = 99;
let firstLimitInput = document.querySelector('#inputFirstLImit');
let secondLimitInput = document.querySelector('#inputSecondLimit');

firstLimitInput.setAttribute('min', minLimit);
firstLimitInput.setAttribute('max', maxLimit);
firstLimitInput.setAttribute('value', minLimit);

secondLimitInput.setAttribute('min', minLimit);
secondLimitInput.setAttribute('max', maxLimit);
secondLimitInput.setAttribute('value', maxLimit);

firstLimitInput.setAttribute('disabled', '');
secondLimitInput.setAttribute('disabled', '');

baseLimitInput.addEventListener('change', () => {
    if(!firstLimitInput.hasAttribute('disabled')) {
        firstLimitInput.setAttribute('disabled', '');
    } 
    if(!secondLimitInput.hasAttribute('disabled')) {
        secondLimitInput.setAttribute('disabled', '');
    }
});

toistaLimitInput.addEventListener('change', () => {
    if(!firstLimitInput.hasAttribute('disabled')) {
        firstLimitInput.setAttribute('disabled', '');
    } 
    if(!secondLimitInput.hasAttribute('disabled')) {
        secondLimitInput.setAttribute('disabled', '');
    }
});

manualLimitInput.addEventListener('change', () => {
    if(firstLimitInput.hasAttribute('disabled')) {
        firstLimitInput.removeAttribute('disabled');
    } 
    if (secondLimitInput.hasAttribute('disabled')) {
        secondLimitInput.removeAttribute('disabled');
    }
});

let dataJSON = undefined;

//Определяет лимит границ для набора чисел и вызывает функцию создания объекта с набором чисел.
let getData = function() {
    let numberRangeLimits = document.querySelector('input[name="numberRangeSetting"]:checked');
    let rangeLimit = document.querySelector('#inputFirstLImit');
    let firstRangeLimit = rangeLimit.min;
    let secondRangeLimit = rangeLimit.max;

    //if manual mode selected
    if(numberRangeLimits.value == -1) {
        let thisFirstLimit = undefined;
        let thisSecondLimit = undefined;
        if(firstLimitInput.value < minLimit) {
            thisFirstLimit = minLimit;
            firstLimitInput.value = minLimit
        } else if(firstLimitInput.value > maxLimit) {
            thisFirstLimit = maxLimit;
            firstLimitInput.value = maxLimit
        } else {
            thisFirstLimit = firstLimitInput.value
        }
        if(secondLimitInput.value < minLimit) {
            thisSecondLimit = minLimit;
            secondLimitInput.value = minLimit
        } else if(secondLimitInput.value > maxLimit) {
            thisSecondLimit = maxLimit;
            secondLimitInput.value = maxLimit
        } else {
            thisSecondLimit = secondLimitInput.value
        }
        let limits = `${thisFirstLimit},${thisSecondLimit}`;
        dataJSON = numberDataGenerator(limits);

        console.log(limits);
        return limits;
    } else {
        dataJSON = numberDataGenerator(numberRangeLimits.value);
        return numberRangeLimits.value;
    }
    // dataJSON = numberDataGenerator(toistaCheckbox);
    // dataJSON = Object.assign(yksiJSON, toistaJSON);
}

let numberDataGenerator = function (numbersRangeArrayInString) {
    let numbersRangeArray = numbersRangeArrayInString.split(',');
    let firstLimit = numbersRangeArray[0];
    let lastLimit = numbersRangeArray[numbersRangeArray.length - 1];
    let minNumber = Math.min(firstLimit, lastLimit);
    let maxNumber = Math.max(firstLimit, lastLimit);
    let numberDataObj = {};
    
    for (let i=minNumber; i <= maxNumber; i++) {
        //let dataKey = Object.keys(baseNumberJSON)[i];
        let dataValue = undefined;
        if(i <= 10) {
            dataValue = baseNumberObj[i];
        } else if (i > 10 && i < 20) {
            dataValue = `${baseNumberObj[i%10]}toista`;
        } else if (i >= 20 && i < 100) {
            if(i%10 != 0) {
                dataValue = `${baseNumberObj[Math.floor(i/10)]}kymmentä${baseNumberObj[i%10]}`;
            } else {
                dataValue = `${baseNumberObj[Math.floor(i/10)]}kymmentä`;
            }
        }
            
        numberDataObj[i] = dataValue;
    }
    return numberDataObj;
}
numberDataGenerator(getData());

let gameIndicatorImg = document.querySelector('.game-settings__result-image img');
let imgSuccess = "./game-settings/result_success.svg";
let imgFailure = "./game-settings/result_failure.svg";
let imgAwait = "./game-settings/result_await.svg";

let firstSelected, secondSelected;

let setSelected = function (element) {
    if (firstSelected == undefined) {
        firstSelected = element;
        firstSelected.style.backgroundColor = 'pink';
    } else if (secondSelected == undefined && firstSelected == element) {
        firstSelected.style.backgroundColor = 'white';
        firstSelected = undefined;
        gameIndicatorImg.setAttribute("src", imgAwait);
    } else if (secondSelected == undefined) {
        secondSelected = element;
        secondSelected.style.backgroundColor = 'pink';
        compareSelected();
    } 
}

//functions to mark numbers as matched or unmatched after user selection

let matchedList = document.querySelector('.matched-list');

let callMatch = function (keyElement) {
    const matchedElement = document.createElement("li");
    const matchedText = document.createTextNode(`
    ${keyElement.innerText} = ${dataJSON[keyElement.innerText]}`);
    matchedElement.appendChild(matchedText);
    matchedList.appendChild(matchedElement);
    firstSelected.style.backgroundColor = 'green';
    secondSelected.style.backgroundColor = 'green';
    if(keyElement == firstSelected) {
        keyList.removeChild(firstSelected);
        valueList.removeChild(secondSelected);
    } else {
        keyList.removeChild(secondSelected);
        valueList.removeChild(firstSelected);
    }
    gameIndicatorImg.setAttribute("src", imgSuccess);
}

let callUnMatch = function () {
    firstSelected.style.backgroundColor = 'white';
    secondSelected.style.backgroundColor = 'white';
    gameIndicatorImg.setAttribute("src", imgFailure);
}

let keyList = document.querySelector('.key-list');
let valueList = document.querySelector('.value-list');

//remove children from given list
let cleanList = function(listName) {
    for (let i=listName.childElementCount-1; i>=0; i--) {
        listName.removeChild(listName.children.item(i));
    }
}

let compareSelected = function() {
    if(firstSelected.classList.contains('key-list__element')) {
        if(dataJSON[firstSelected.innerText] == secondSelected.innerText) {
            callMatch(firstSelected);
        } else {
            callUnMatch();
        }
    } else {
        if(firstSelected.innerText == dataJSON[secondSelected.innerText]) {
            callMatch(secondSelected);
        } else {
            callUnMatch();
        }
    }
    firstSelected = undefined;
    secondSelected = undefined;
}

let startGame = function () {
    getData();
    if(dataJSON != undefined && dataJSON != null) {
        //creating elements lists as html objects
        for (let key in dataJSON) {
            const keyElement = document.createElement("li");
            const keyContent = document.createTextNode(key);
            keyElement.classList.add('key-list__element');
            keyElement.classList.add('numbers-list__element');
            keyElement.appendChild(keyContent);
            keyList.appendChild(keyElement);

            const valueElement = document.createElement("li");
            const valueContent = document.createTextNode(dataJSON[key]);
            valueElement.classList.add('value-list__element');
            valueElement.classList.add('numbers-list__element');
            valueElement.appendChild(valueContent);
            valueList.appendChild(valueElement);
        }

        //shuffling numbers in lists
        let shuffleList = function(list) {
            for (let i = list.children.length; i >= 0; i--) {
                list.appendChild(list.children[Math.random() * i | 0]);
            }
        }

        shuffleList(keyList);
        shuffleList(valueList);
        
        //adding eventListeners to numbers to interact with user

        let keyElementsList = document.querySelectorAll('.numbers-list__element');

        for (let i = 0; i < keyElementsList.length; i++) {
            let thisElement = keyElementsList.item(i);
            thisElement.addEventListener('click', () => {
                setSelected(thisElement);
            })
        }
    }
}

let startGameButton = document.querySelector('.game-settings__start-game-button');

startGameButton.onclick = function(evt) {
    evt.preventDefault();

    firstSelected = undefined;
    secondSelected = undefined;

    cleanList(matchedList);
    cleanList(keyList);
    cleanList(valueList);

    startGame();
}

//first start of the game after opening the page
startGame();