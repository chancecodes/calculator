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
}

function operate(callback, a, b) {
    return operator[`${callback}`](Number(a), Number(b))
}

const screen = document.querySelector('.display');

var displayValue = {
    temp: "",
    stored: "",
    current: "",
    operator: "",
    result: "",
    equals: "",
};

const btn = document.querySelectorAll('.btn')
btn.forEach((button) => {
    button.addEventListener ('click', display) 
})


// accept values
// stop when operator is clicked and store current value
// store operator - allow user to switch operator if missclick occurs

// accept new values 
// compute sum when equals or new operator is clicked
// set sum == to initial value
// accept new values//or skip
// repeat



function display(e) {
    const value = e.currentTarget.innerHTML;

    //stop accepting values when operator is clicked
    // store operator and allow user to switch operator if mis-click occurs
    if (isOperator(e)) { 
        if (displayValue.stored && displayValue.equals === "off") {
            operation();
        }
        displayValue.operator = e.currentTarget.id;
        displayValue.stored = displayValue.temp;
        displayValue.current = "";
        displayValue.equals = "off";

    } else if (e.currentTarget.id === "equals") {
        operation();
    } else if (displayValue.stored) { // accepts new values after operator
        displayValue.current += value;
        screen.textContent = displayValue.current;
    }  else { //accepts values
        displayValue.temp += value;
        screen.textContent = displayValue.temp;
    }

    console.table(displayValue)
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

    screen.textContent = displayValue.result;
}