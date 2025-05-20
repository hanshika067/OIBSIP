document.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector(".display");
  const buttons = document.querySelectorAll(".btn");

  // Handle button clicks
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (value === "=") {
        calculate();
      } else if (value === "C") {
        clearDisplay();
      } else if (value === "←") {
        backspace();
      } else {
        appendToDisplay(value);
      }
    });
  });

  // Handle keyboard input
  document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!isNaN(key) || ["+", "-", "*", "/", "."].includes(key)) {
      appendToDisplay(key);
    } else if (key === "Enter" || key === "=") {
      e.preventDefault();
      calculate();
    } else if (key === "Backspace") {
      backspace();
    } else if (key === "Escape") {
      clearDisplay();
    }
  });

  // Add text to display
  function appendToDisplay(value) {
    display.textContent += value;
  }

  // Clear entire display
  function clearDisplay() {
    display.textContent = "";
  }

  // Backspace last character
  function backspace() {
    display.textContent = display.textContent.slice(0, -1);
  }

  // Calculate result
  function calculate() {
    try {
      const result = eval(display.textContent);
      display.textContent = result;
    } catch {
      display.textContent = "Error";
    }
  }
});
