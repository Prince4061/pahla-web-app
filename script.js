// Calculator State
let display = document.getElementById('display');
let previousValue = '';
let currentValue = '';
let operation = null;
let shouldResetDisplay = false;

// Get all buttons
const numberButtons = document.querySelectorAll('.btn-number');
const operationButtons = document.querySelectorAll('.btn-operation');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const decimalButton = document.getElementById('decimal');

// Event Listeners for Number Buttons
numberButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const number = e.target.getAttribute('data-number');
        appendNumber(number);
    });
});

// Event Listeners for Operation Buttons
operationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const op = e.target.innerText;
        handleOperation(op);
    });
});

// Event Listeners for Special Buttons
equalsButton.addEventListener('click', calculate);
clearButton.addEventListener('click', clearDisplay);
decimalButton.addEventListener('click', addDecimal);

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operationMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        handleOperation(operationMap[e.key]);
    } else if (e.key === '.') {
        addDecimal();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearDisplay();
    }
});

// Append Number to Display
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
    } else {
        currentValue += number;
    }
    updateDisplay();
}

// Add Decimal Point
function addDecimal() {
    if (shouldResetDisplay) {
        currentValue = '0.';
        shouldResetDisplay = false;
    } else if (!currentValue.includes('.')) {
        if (currentValue === '') {
            currentValue = '0.';
        } else {
            currentValue += '.';
        }
    }
    updateDisplay();
}

// Handle Operation
function handleOperation(op) {
    if (currentValue === '' && op !== '−') {
        return;
    }

    if (previousValue !== '' && currentValue !== '' && operation !== null) {
        // If there's already an operation in progress, calculate first
        const result = performCalculation(parseFloat(previousValue), parseFloat(currentValue), operation);
        currentValue = result.toString();
        updateDisplay();
    }

    previousValue = currentValue || '0';
    operation = op;
    shouldResetDisplay = true;
}

// Perform Calculation
function performCalculation(prev, current, op) {
    let result = 0;

    switch (op) {
        case '+':
            result = prev + current;
            break;
        case '−':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                showError('Cannot divide by 0');
                return prev;
            }
            result = prev / current;
            break;
        default:
            result = current;
    }

    // Round to avoid floating point errors
    return Math.round(result * 100000000) / 100000000;
}

// Calculate Final Result
function calculate() {
    if (operation === null || currentValue === '' || previousValue === '') {
        return;
    }

    const result = performCalculation(parseFloat(previousValue), parseFloat(currentValue), operation);
    currentValue = result.toString();
    previousValue = '';
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear Display
function clearDisplay() {
    currentValue = '';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    display.value = '0';
}

// Backspace Function
function backspace() {
    if (shouldResetDisplay) {
        return;
    }
    currentValue = currentValue.toString().slice(0, -1);
    updateDisplay();
}

// Update Display
function updateDisplay() {
    if (currentValue === '') {
        display.value = '0';
    } else {
        display.value = currentValue;
    }
}

// Show Error Message
function showError(message) {
    display.value = message;
    currentValue = '';
    previousValue = '';
    operation = null;
    shouldResetDisplay = true;
    setTimeout(() => {
        display.value = '0';
    }, 2000);
}

// Initialize Display
updateDisplay();
