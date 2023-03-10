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
    symbol: "",
    result: "",
    equals: "",
    recent: "temp",
};

const screen = document.querySelector('.display');
screen.textContent = displayValue.temp;

const eqn = document.querySelector('.eqn');

const clearBtn = document.querySelector('.switch');

var key;

window.addEventListener('keydown', function(e) {
    if (e.key === "Enter") {
        key = document.querySelector(`button[key="="]`);
    } else if (e.key === "Backspace") {
        key = document.querySelector(`div[key="${e.key}"]`);
    } else if (e.key === "Escape") {
        key = clearBtn;
    } else {
        key = document.querySelector(`button[key="${e.key}"]`);
    }
    
    return (!key) ? false : display();
});

const btn = document.querySelectorAll('.btn');

btn.forEach((button) => {
    button.addEventListener ('click', display);
})

const operator = {
    add: function add(a, b) {
        return a + b;
    },
    subtract: function subtract(a, b) {
        return a - b;
    },
    multiply: function multiply(a, b) {
        return a * b;
    },
    divide: function divide(a, b) {
        if (b === 0) {
            return "i'll pretend this didn't happen";
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
        eqn.textContent = "";
        for (let key in displayValue) {
            displayValue[key] = "";
        }
        displayValue.recent = "temp";
        num = "0";
        return num;
    },
    negator: function negator(num) {
        if (num==="0") {
            return num
        } else if (num.startsWith("-")) {
            return num = num.slice(1);
        } else {
            return num = "-" + num;
        }
    },
    percent: function percent(num) {
        num =  `${Number(num.replaceAll(",","")) / 100}`;
        
        if ((Number(num) < 0.00000001 && Number(num > 0)) ||
        (Number(num) > -0.00000001 && Number(num < 0))) {
            num = `${Number(num).toExponential()}`;
            num = floatNum(num);
        } else if(num.includes("e")) {
            num = floatNum(num);
        } else {
            num = maxNine(num);
            num = addCommas(num);
        }

        return num;
    },
    clear: function clear(num) {
        if (displayValue.recent === "current" && displayValue.current === "0") {
            special.allClear();
        } else if (displayValue.recent === "current" || displayValue.recent === "temp") {
            num = "0";
        } else {
            special.allClear();
        }
        clearBtn.id = "allClear";
        clearBtn.innerHTML = "AC";
        return num = "0";
    },
    decimal: function decimal(num) {
        if (displayValue.equals === "on") {  
            special.allClear();
            num = "0.";
        } else if (displayValue.temp === "0") {
            displayValue.recent = "temp";
            num = "0.";
        } else if (num === "" || num === "0") {
            num = "0.";
        } else if (!num.includes(".")) {
            num += ".";
        } else {
            num;
        }
        num = maxNine(num);
        return num;
    },
    backspace: function backspace(num) {
        if (displayValue.recent === "current" && displayValue.current === "0") {
            special.allClear();
        } else if (displayValue.recent === "current" || displayValue.recent === "temp") {
            const end = num.length - 1;

            num = num.substring(0, end);
            num = addCommas(num);
            
            if (num==="") num = "0";
        } else {
            special.allClear();
        }
        return num;
    }
}

function display(e) {
    const value = !key ? e.currentTarget : key;
    const lastUsed = displayValue[`${displayValue.recent}`];

    if (value.classList.contains("special")) {
        let specialty = value.id;    
        result = special[`${specialty}`](lastUsed);
        
        displayValue[`${displayValue.recent}`] = screen.textContent = result;
    }  else if (isOperator(value)) { //stop accepting values and store operator
        // compute sum if second operator is clicked
        if ((displayValue.stored && displayValue.equals === "off") 
        && (displayValue.current != "")) {
            operation();
        }
        displayValue.operator = value.id;
        displayValue.symbol = value.innerHTML;
        displayValue.stored = displayValue.temp;
        if (displayValue.current === "") {
            eqn.textContent = `${displayValue.stored} ${displayValue.symbol}`
        }
        displayValue.current = "";
        displayValue.equals = "off";
        mostRecent("current");
    } else if (value.id === "equals") {
        operation();
    } else if (displayValue.stored) { // accepts new values after operator
        //if new number was pressed after equals, clear and start back at temp
        if (displayValue.equals === "on") {  
            special.allClear();
            tempValue(value.innerHTML);
        } else {
            clearZero("current");
            displayValue.current += value.innerHTML;
            mostRecent("current");
            maxNine(displayValue.current);
            displayValue.current = addCommas(displayValue.current);
            screen.textContent = displayValue.current;
            eqn.textContent = `${displayValue.stored} ${displayValue.symbol}`;
            clearBtn.id = "clear";
            clearBtn.innerHTML = "C";
        }
    }  else { //accepts values (initial)
        tempValue(value.innerHTML);
    }
    key = "";
}

function isOperator(value) {
    return (value.classList.contains("operator") ? true : false);
}

function operation () {
    if (displayValue.current === "") {
        displayValue.current = displayValue.stored;
    };

    mostRecent("stored");

    displayValue.result = `${operate (displayValue.operator, 
        displayValue.stored.replaceAll("," , ""), 
        displayValue.current.replaceAll("," , ""))
        }`;

    displayValue.result = formatResult(displayValue.result);

    displayValue.equals = "on";
    eqn.textContent = `${addCommas(displayValue.stored)} ${displayValue.symbol} ${displayValue.current} = `
    //when equals is pressed multiple times it still works
    displayValue.stored = displayValue.result; 
    
   
    displayValue.temp = displayValue.result;

    screen.textContent = displayValue.stored;
    clearBtn.id = "allClear";
    clearBtn.innerHTML = "AC"
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
    maxNine(displayValue.temp);
    displayValue.temp = addCommas(displayValue.temp)
    screen.textContent = displayValue.temp;
    clearBtn.id = "clear";
    clearBtn.innerHTML = "C";
}

function maxNine (num) {
    const max = num.match(/[0-9]/g).join("");
    const commas = (num.match(/,/g) || []).length;

    if (max.length >= 9 ) {
        if (num.endsWith(".")) {
            num = num.substring(0,9 + commas);
        } else if (num.includes(".") && num.includes("-")) {
            num = num.substring(0, 11 + commas);
        }  else if (num.includes(".") || num.includes("-")) {
            num = num.substring(0, 10 + commas);
        }  else {
            num = num.substring(0,9 + commas);
        }
        displayValue[`${displayValue.recent}`] = num;
    }
    return num;
};

function addCommas(num) {
    if (num === "0") {
        return num;
    } else if (num.includes(".0")) {
        return num;
    } else {
       return num = Number(num.replaceAll(",",""))
    .toLocaleString("en-US", {maximumFractionDigits: 8}); 
    }
}

function floatNum (num) {
    const locationE = num.indexOf("e");
    const e = num.substring(locationE, locationE + 1);
    var float = num.substring(locationE + 2);

    if (num.length < 10) {
        num;
    } else if (num.includes("e-")) {
        float = num.substring(locationE);
        const leftover = 9-float.length
        num = num.substring(0,leftover) + float;
    } else if (num.length >= 9) {
        const leftover = 9-1-float.length;
        num = num.substring(0,leftover) + e + float;
    } else {
        num = num.substring(0,locationE) + e + float;
    }

    return num;
}

function formatResult(result) {
    if (Number(result) >= 999999999 || Number(result) <= -999999999) {
        result = `${Number(result).toExponential()}`;
        result = floatNum(result);
    } else if ((Number(result) <= 0.00000001 && Number(result) > 0) ||
    (Number(result) >= -0.00000001 && Number(result) < 0)) {
        result = `${Number(result).toExponential()}`;
        result = floatNum(result);
    } else if (result.includes("e-")) {
        result = floatNum(result);
    } else {
        result = maxNine(result)
        result = addCommas(result);
    }
    return result;
}