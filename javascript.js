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
    recent: "",
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
        return a / b;
    },
    percent: function percent(a) {
        return a / 100;
    }
}

function operate(callback, a, b) {
    return operator[`${callback}`](Number(a), Number(b));
}

const special = {
    allClear: function allClear() {
        for (let key in displayValue) {
            displayValue[key] = "";
        }
        displayValue.temp = "0";
        screen.textContent = displayValue.temp;
    },
    negator: function negator(last) {
        if (displayValue[`${last}`].startsWith("-")) {
            displayValue[`${last}`] = displayValue[`${last}`].slice(1)
        } else {
            displayValue[`${last}`] = "-" + displayValue[`${last}`];
        }
        screen.textContent = displayValue[`${last}`];
    },
    percent: function percent(last) {
        displayValue[`${last}`] /= 100;

        screen.textContent = displayValue[`${last}`];
    },
    clear: function clear(last) {
        if (displayValue[`${last}`]) {
            displayValue[`${last}`] = "0";
        }
        screen.textContent = displayValue[`${last}`];
    },
    decimal: function decimal(last) {
        if (displayValue[`${last}`] === "" 
        || displayValue[`${last}`] === "0") {
            displayValue[`${last}`] = "0."
        } else if (!displayValue[`${last}`].includes(".")) {
            displayValue[`${last}`] = displayValue[`${last}`] + "."
        } 
        screen.textContent = displayValue[`${last}`];
    },
}

function display(e) {
    const value = e.currentTarget.innerHTML;

    //stop accepting values when operator is clicked
    // store operator and allow user to switch operator if mis-click occurs
    
    if (e.currentTarget.classList.contains("special")) {
        let specialty = e.currentTarget.id;
        var last = displayValue.recent;
        special[`${specialty}`](last);

    } else if (isOperator(e)) { 
        if ((displayValue.stored && displayValue.equals === "off") 
        && (displayValue.current != "")) {
            operation();
        }
        displayValue.operator = e.currentTarget.id;
        displayValue.stored = displayValue.temp;
        displayValue.current = "";
        displayValue.equals = "off";

    } else if (e.currentTarget.id === "equals") {
        operation();
    } else if (displayValue.stored) { // accepts new values after operator
        clearZero("current");
        displayValue.current += value;
        screen.textContent = displayValue.current;
        mostRecent("current");
    }  else { //accepts values
        clearZero("temp");
        displayValue.temp += value;
        screen.textContent = displayValue.temp;
        mostRecent("temp");
    }

    console.table(displayValue);
}

function isOperator(e) {
    return (e.currentTarget.classList.contains("operator") ? true : false);
}

function operation () {
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
    if (displayValue[`${lastUsed}`] === "0") {
        displayValue[`${lastUsed}`] = "";
    }
}