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
    allClear: function allClear() {
        for (let key in displayValue) {
            displayValue[key] = "";
        }
        displayValue.temp = "0";
        screen.textContent = displayValue.temp;
    },
    negator: function negator(last) {
        if (last.startsWith("-")) {
            last = last.slice(1)
        } else {
            last = "-" + last;
        }
        screen.textContent = last;
    },
    percent: function percent(last) {
        last =  `${last / 100}`;
        screen.textContent = last;
        displayValue[`${displayValue.recent}`] = last
    },
    clear: function clear(last) {
        if (displayValue.recent === "current"  || displayValue.recent === "temp") {
            last = "0";
        } else {
            special.allClear();
            last = displayValue.temp;
        }
        screen.textContent = last;
        displayValue[`${displayValue.recent}`] = last;
    },
    decimal: function decimal(last) {
        if (displayValue.temp === "0") {
            displayValue.temp = "0."
            last = displayValue.temp;
        } else if (last === "" || last === "0") {
            last = "0."
        } else if (!last.includes(".")) {
            last += "."
        }
        
        screen.textContent = last;
        displayValue[`${displayValue.recent}`] = last;
    },
}

function display(e) {
    const value = e.currentTarget.innerHTML;

    if (e.currentTarget.classList.contains("special")) {
        let specialty = e.currentTarget.id;
        var lastUsed = displayValue[`${displayValue.recent}`];
        special[`${specialty}`](lastUsed);
    }  else if (isOperator(e)) { //stop accepting values and store operator
        // compute sum if second operator is clicked
        if ((displayValue.stored && displayValue.equals === "off") 
        && (displayValue.current != "")) {
            operation();
        }
        displayValue.operator = e.currentTarget.id;
        displayValue.stored = displayValue.temp;
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
            screen.textContent = displayValue.current;
            mostRecent("current");
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
    screen.textContent = displayValue.temp;
    mostRecent("temp");
}