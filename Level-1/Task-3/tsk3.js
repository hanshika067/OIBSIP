document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const temperatureInput = document.getElementById('temperature');
    const convertBtn = document.getElementById('convert-btn');
    const resultContainer = document.getElementById('result-container');
    const resultElement = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');
    const currentUnitIcon = document.getElementById('current-unit-icon');
    
    // Unit conversion mappings
    const unitSymbols = {
        celsius: '°C',
        fahrenheit: '°F',
        kelvin: 'K'
    };
    
    // Unit icons for the input field
    const unitIcons = {
        celsius: '°C',
        fahrenheit: '°F',
        kelvin: 'K'
    };
    
    // Initialize the app
    initApp();
    
    function initApp() {
        // Set up event listeners
        convertBtn.addEventListener('click', convertTemperature);
        temperatureInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') convertTemperature();
        });
        
        // Update unit icon when radio buttons change
        document.querySelectorAll('input[name="from-unit"]').forEach(radio => {
            radio.addEventListener('change', function() {
                updateCurrentUnitIcon(this.value);
            });
        });
        
        // Set initial unit icon
        updateCurrentUnitIcon(document.querySelector('input[name="from-unit"]:checked').value);
    }
    
    function updateCurrentUnitIcon(unit) {
        currentUnitIcon.textContent = unitIcons[unit];
    }
    
    function convertTemperature() {
        // Reset previous state
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
        resultContainer.classList.remove('show');
        
        // Validate input
        const tempValue = parseFloat(temperatureInput.value);
        if (isNaN(tempValue)) {
            showError('Please enter a valid number');
            return;
        }
        
        // Get selected units
        const fromUnit = document.querySelector('input[name="from-unit"]:checked').value;
        const toUnit = document.querySelector('input[name="to-unit"]:checked').value;
        
        // If converting to the same unit
        if (fromUnit === toUnit) {
            showResult(tempValue, toUnit);
            return;
        }
        
        // Convert the temperature
        const convertedTemp = convertTemp(tempValue, fromUnit, toUnit);
        showResult(convertedTemp, toUnit);
    }
    
    function convertTemp(value, fromUnit, toUnit) {
        // First convert to Celsius (common intermediate)
        let celsius;
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Then convert from Celsius to target unit
        let result;
        switch (toUnit) {
            case 'celsius':
                result = celsius;
                break;
            case 'fahrenheit':
                result = (celsius * 9/5) + 32;
                break;
            case 'kelvin':
                result = celsius + 273.15;
                break;
        }
        
        // Return rounded value
        return Math.round(result * 100) / 100;
    }
    
    function showResult(value, unit) {
        resultElement.textContent = `${value} ${unitSymbols[unit]}`;
        resultContainer.classList.add('show');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }
    
    // Utility function to get unit symbol
    function getUnitSymbol(unit) {
        return unitSymbols[unit] || '';
    }
});