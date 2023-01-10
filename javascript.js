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

var equation = {
    one: "",
    two: "",
}

const screen = document.querySelector('.display');
screen.textContent = displayValue.temp;

const eqn = document.querySelector('.eqn');
const fullEquation = `${displayValue.stored} ${displayValue.symbol} ${displayValue.current} =`

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
        eqn.textContent = "";
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

        return num
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
        displayValue.symbol = e.currentTarget.innerHTML;
        displayValue.stored = displayValue.temp;
        if (displayValue.current === "") {
            eqn.textContent = `${displayValue.stored} ${displayValue.symbol}`
        }
        displayValue.current = "";
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
            maxNine(displayValue.current);
            displayValue.current = addCommas(displayValue.current);
            screen.textContent = displayValue.current;
            eqn.textContent = `${displayValue.stored} ${displayValue.symbol}`
        }
    }  else { //accepts values (initial)
        tempValue(value);
    }
    // displayEquation();
    console.table(displayValue);
}

function isOperator(e) {
    return (e.currentTarget.classList.contains("operator") ? true : false);
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
    eqn.textContent = `${displayValue.stored} ${displayValue.symbol} ${displayValue.current} = `
    //when equals is pressed multiple times it still works
    displayValue.stored = displayValue.result; 
    displayValue.temp = displayValue.result;

    screen.textContent = displayValue.stored;
    
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
    // eqn.textContent = displayValue.temp;
}

function maxNine (num) {
    const max = num.match(/[0-9]/g).join("");
    const commas = (num.match(/,/g) || []).length

    if (max.length >= 9 ) {
        if (num.endsWith(".")) {
            num = num.substring(0,9 + commas)
        } else if (num.includes(".") && num.includes("-")) {
            num = num.substring(0, 11 + commas)
        }  else if (num.includes(".") || num.includes("-")) {
            num = num.substring(0, 10 + commas)
        }  else {
            num = num.substring(0,9 + commas)
        }
        displayValue[`${displayValue.recent}`] = num;
    }
    return num;
};

function addCommas(num) {
    if (num.endsWith(".0")) {
        return num
    } else {
       return num = Number(num.replaceAll(",",""))
    .toLocaleString("en-US", {maximumFractionDigits: 8}); 
    }
    

}

function floatNum (num) {
    const locationE = num.indexOf("e");
    const e = num.substring(locationE, locationE + 1)
    var float = num.substring(locationE + 2)

    if (num.length < 10) {
        num
    } else if (num.includes("e-")) {
        float = num.substring(locationE)
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


//keyboard support

//backspace

//make pretty