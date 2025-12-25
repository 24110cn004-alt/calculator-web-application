const display = document.getElementById("display");

let currentInput = "";
let lastResult = null;


function updateDisplay(value) {
  display.textContent = value || "0";
}

document.querySelectorAll(".buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.textContent;

    if (!action) {
      handleNumberOrDot(value);
    } else if (action === "operator") {
      handleOperator(value);
    } else if (action === "clear") {
      currentInput = "";
      lastResult = null;
      updateDisplay(currentInput);
    } else if (action === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput);
    } else if (action === "equals") {
      calculateResult();
    }
  });
});


function handleNumberOrDot(value) {
  const lastChar = currentInput.slice(-1);

 
  if (value === ".") {
    const parts = currentInput.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return;
  }

  
  if (value === "0" && currentInput === "0") return;

  
  if (/^[\+\-\*\/]$/.test(lastChar) && value === "0" && currentInput.endsWith("0")) return;

  if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay(currentInput);
}

function handleOperator(op) {
  if (!currentInput && lastResult !== null) {
    currentInput = String(lastResult);
  }

  const lastChar = currentInput.slice(-1);

  
  if (/[\+\-\*\/]/.test(lastChar)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else if (currentInput !== "") {
    currentInput += op;
  }

  updateDisplay(currentInput);
}


function calculateResult() {
  if (!currentInput) return;

  try {
    
    if (/\/0(?!\d)/.test(currentInput)) {
      updateDisplay("Error");
      currentInput = "";
      lastResult = null;
      return;
    }

    const result = Function(`"use strict"; return (${currentInput})`)();
    if (result === Infinity || Number.isNaN(result)) {
      updateDisplay("Error");
      currentInput = "";
      lastResult = null;
    } else {
      lastResult = result;
      currentInput = String(result);
      updateDisplay(currentInput);
    }
  } catch {
    updateDisplay("Error");
    currentInput = "";
    lastResult = null;
  }
}


document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/[0-9]/.test(key) || key === ".") {
    handleNumberOrDot(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  } else if (key.toLowerCase() === "c") {
    currentInput = "";
    lastResult = null;
    updateDisplay(currentInput);
  }
});
