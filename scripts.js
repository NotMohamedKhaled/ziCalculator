const buttons = [
    'Clear','⌫','÷',
    '7','8','9','X',
    '4','5','6','-',
    '1','2','3','+',
    '.','0','ANS','='
];

const finalResult = document.querySelector('.final-result');
const currentResult = document.querySelector('.current-result');
const inputButtons = document.querySelector('.input-buttons');

let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;
let lastAnswer = 0;




updateDisplay();


buttons.forEach((btnText) => {
    const button = document.createElement('button');
    button.classList.add('button');
    button.innerText = btnText;
    
    if (['+', '-', 'X', '÷'].includes(btnText)) {
        button.classList.add('operator');
    }
    
    button.addEventListener('click', () => handleButtonClick(btnText));
    inputButtons.appendChild(button);
});

function handleButtonClick(btnText) {
    if(currentInput==="Error"){
        currentInput='0';
    }
    if (btnText >= '0' && btnText <= '9') {
        handleNumber(btnText);
    } else if (btnText === '.') {
        handleDecimal();
    } else if (['+', '-', 'X', '÷'].includes(btnText)) {
        handleOperator(btnText);
    } else if (btnText === '=') {
        handleEquals();
    } else if (btnText === 'Clear') {
        handleClear();
    } else if (btnText === '⌫') {
        handleBackspace();
    } else if (btnText === 'ANS') {
        handleAnswer();
    }
    
    updateDisplay();
}

function handleNumber(num) {
    if (shouldResetDisplay || currentInput === '0') {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handleOperator(op) {
    if (operator && !shouldResetDisplay) {
        handleEquals();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    
    finalResult.textContent = `${previousInput} ${op}`;
}

function handleEquals() {
    if (!operator || shouldResetDisplay) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case 'X':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                currentInput = 'Error';
                operator = '';
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
//ans
    lastAnswer = result;
    
    
    if (result % 1 !== 0) {
        result = parseFloat(result.toFixed(10));
    }
    
    currentInput = result.toString();
    operator = '';
    shouldResetDisplay = true;
    finalResult.textContent = '';
}

function handleClear() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    finalResult.textContent = '';
}

function handleBackspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
}

function handleAnswer() {
    currentInput = lastAnswer.toString();
    shouldResetDisplay = false;
}

function updateDisplay() {
    // Limit display length to prevent overflow
    const displayText = currentInput.length > 12 ? 
        parseFloat(currentInput).toExponential(6) : 
        currentInput;
    currentResult.textContent = displayText;


}



//keys

document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        handleButtonClick(key);
    } else if (key === '.') {
        handleButtonClick('.');
    } else if (key === '+') {
        handleButtonClick('+');
    } else if (key === '-') {
        handleButtonClick('-');
    } else if (key === '*') {
        handleButtonClick('X');
    } else if (key === '/') {
        e.preventDefault();
        handleButtonClick('÷');
    } else if (key === 'Enter' || key === '=') {
        handleButtonClick('=');
    } else if (key === 'Escape') {
        handleButtonClick('Clear');
    } else if (key === 'Backspace') {
        handleButtonClick('⌫');
    }
});
