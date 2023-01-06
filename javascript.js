// accept values
// stop when operator is clicked and store current value
// store operator - allow user to switch operator if missclick occurs

// accept new values 
// compute sum when equals or new operator is clicked
// set sum == to initial value
// accept new values//or skip
// repeat

var displayValue = {
    temp: "0",
    stored: "",
    current: "",
    operator: "",
    result: "",
    equals: "",
    recent: "temp",
};

const screen = document.querySelector('.display');
screen.textContent = displayValue.temp;

const btn = document.querySelectorAll('.btn')
btn.forEach((button) => {
    button.addEventListener ('click', display);
})

const operator = {
    add: function add(a, b) {
        return a + b
    },
    subtract: function subtract(a, b) {
        return a - b;
    },
    multiply: function multiply(a, b) {
        return a * b;
    },
    divide: function divide(a, b) {
        if (b === 0) {
            return "i'll pretend this didn't happen"
        } else {
            return a / b;
        } 
    },
    percent: function percent(a) {
        return a / 100;
    }
}

function operate(callback, a, b) {
    return operator[`${callback}`](Number(a), Number(b));
}

const special = {
    allClear: function allClear(num) {
        for (let key in displayValue) {
            displayValue[key] = "";
        }
        displayValue.recent = "temp"
        num = "0";
        return num;
    },
    negator: function negator(num) {
        if (num.startsWith("-")) {
            return num = num.slice(1)
        } else {
            return num = "-" + num;
        }
    },
    percent: function percent(num) {
        return num =  `${num / 100}`;
    },
    clear: function clear(num) {
        if (displayValue.recent === "current" && displayValue.current === "0") {
            special.allClear();
        } else if (displayValue.recent === "current" || displayValue.recent === "temp") {
            num = "0";
        } else {
            special.allClear();
        }
        return num;
    },
    decimal: function decimal(num) {
        if (displayValue.temp === "0") {
            displayValue.recent = "temp"
            num = "0."
        } else if (num === "" || num === "0") {
            num = "0."
        } else if (!num.includes(".")) {
            num += "."
        } else {
            num
        }
        num = maxNine(num);
        return num;
    },
}

function display(e) {
    const value = e.currentTarget.innerHTML;
    const lastUsed = displayValue[`${displayValue.recent}`];

    if (e.currentTarget.classList.contains("special")) {
        let specialty = e.currentTarget.id;    
        result = special[`${specialty}`](lastUsed);
        
        displayValue[`${displayValue.recent}`] = screen.textContent = result;

    }  else if (isOperator(e)) { //stop accepting values and store operator
        // compute sum if second operator is clicked
        if ((displayValue.stored && displayValue.equals === "off") 
        && (displayValue.current != "")) {
            operation();
        }
        displayValue.operator = e.currentTarget.id;
        displayValue.stored = displayValue.temp;
        displayValue.current = "0";
        displayValue.equals = "off";
        mostRecent("current");
    } else if (e.currentTarget.id === "equals") {
        operation();
    } else if (displayValue.stored) { // accepts new values after operator
        //if new number was pressed after equals, clear and start back at temp
        if (displayValue.equals === "on") {  
            special.allClear();
            tempValue(value);
        } else {
            clearZero("current");
            displayValue.current += value;
            mostRecent("current");
            if (displayValue.current.length > 3) {
                addComma(displayValue.current);
            }
            maxNine(displayValue.current);
            screen.textContent = displayValue.current;
        }
    }  else { //accepts values (initial)
        tempValue(value);
    }

    console.table(displayValue);
}

function isOperator(e) {
    return (e.currentTarget.classList.contains("operator") ? true : false);
}

function operation () {
    if (displayValue.current === "") {
        displayValue.current = displayValue.stored;
    };
    
    displayValue.stored = removeCommas(displayValue.stored);
    displayValue.current = removeCommas(displayValue.current);

    displayValue.result = `${operate (displayValue.operator, displayValue.stored, displayValue.current)}`;

    displayValue.equals = "on";

    //when equals is pressed multiple times it still works
    displayValue.stored = displayValue.result; 
    displayValue.temp = displayValue.result;

    screen.textContent = displayValue.stored;
    mostRecent("stored");
}

function mostRecent(lastUsed) {
    displayValue.recent = lastUsed;
}

function clearZero (lastUsed) {
    if (displayValue[lastUsed] === "0") {
        displayValue[lastUsed] = "";
    }
}

function tempValue (value) {
    clearZero("temp");
    displayValue.temp += value;
    mostRecent("temp");
    if (displayValue.temp.length > 3) {
        addComma(displayValue.temp);
    }
    maxNine(displayValue.temp);
    screen.textContent = displayValue.temp;
}

function maxNine (num) {
    const regex = /[0-9]/g;
    const max = num.match(regex).join("")
    
    //each max is +2 to account for commas
    if (max.length >= 9 ) {
        if (num.endsWith(".")) {
            num = num.substring(0,11)
        } else if (num.includes(".") && num.includes("-")) {
            num = num.substring(0, 13)
        }  else if (num.includes(".") || num.includes("-")) {
            num = num.substring(0, 12)
        }  else {
            num = num.substring(0,11)
        }
        displayValue[`${displayValue.recent}`] = num;
    }
    return num;
};

function addComma (num) {
   
    if (num.length === 8) {
        const firstTwoSets = num.substr(0,7);
        const thirdSet = num.substr(7);
        num = firstTwoSets + "," + thirdSet;
    } else if (!num.includes(",")) {
        const firstSet = num.substr(0,3);
        const secondSet = num.substr(3);
        num = firstSet + "," + secondSet;
    } else {
        num;
    }
    
    displayValue[`${displayValue.recent}`] = num;
    return num;
}

function removeCommas(num) {
    if (num.includes(",")) {
        num = num.replaceAll(",", ""); 
        console.log(num)
    }
    return num;
}

//roundnum

//commas

//floating num

//show equation

//keyboard support

//backspace

//make pretty