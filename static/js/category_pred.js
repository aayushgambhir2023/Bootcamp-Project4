document.addEventListener('DOMContentLoaded', function() {
    const submenu41 = document.getElementById("submenu41");
    const dropdownContainer = document.getElementById("dropdown-container");

    submenu41.addEventListener('click', function(event) {
        event.preventDefault();
        console.log("Submenu 41 clicked");
        // Toggle the "selected" class for submenu41
        submenu41.classList.toggle('selected');
        handleMenuClick89("submenu41");
    });

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const isClickedInsideSubmenu = clickedElement.closest('#submenu41');
        const isClickedInsideDropdown = clickedElement.closest('#dropdown-container');
        const isClickedInsideMenu = isClickedInsideSubmenu || isClickedInsideDropdown;
        const isClickedInsideGraph = clickedElement.closest('#graphics-output');
        
        if (!isClickedInsideMenu && !isClickedInsideGraph) {
            const dropdownContainer = document.getElementById("dropdown-container");
            if (submenu41.classList.contains('selected')) {
                dropdownContainer.style.display = 'none';
                submenu41.classList.remove('selected');
            }
        }
    });
    
    

    handleMenuClick89(); // Ensure DOM content is loaded before calling the function
});

// Function to handle menu clicks and create dropdown menu
function handleMenuClick89(menuId) {
    const dropdownContainer = document.getElementById("dropdown-container");

    if (!dropdownContainer) {
        console.error("Dropdown container not found");
        return;
    }

    // Hide the Menu
    document.getElementById('side-menu').style.display = 'none';

    // Clear any existing content in the dropdown-container div
    dropdownContainer.innerHTML = "";

    // Hide dropdown by default
    dropdownContainer.style.display = 'none';

    // Check if the submenu41 item is selected
    const submenu41 = document.getElementById("submenu41");
    if (menuId !== "submenu41" || !submenu41.classList.contains('selected')) {
        console.log("Forecasting by Category not selected or another menu item is selected");
        return; // Exit the function if submenu41 is not selected or another menu item is selected
    }

    dropdownContainer.style.display = 'block';

    // Create dropdown container
    dropdownContainer.style.position = 'absolute';
    dropdownContainer.style.top = '60%';
    dropdownContainer.style.left = '25%';
    dropdownContainer.style.transform = 'translate(-50%, -50%)';
    dropdownContainer.style.zIndex = '9999'; // Ensure dropdown is on top of other elements

    // Create dropdown menu for selecting expense or revenue
    const selectCategory = document.createElement('select');
    selectCategory.setAttribute('id', 'selectCategory');
    const optionExp = document.createElement('option');
    optionExp.value = 'exp';
    optionExp.textContent = 'Expense';
    const optionRev = document.createElement('option');
    optionRev.value = 'rev';
    optionRev.textContent = 'Revenue';
    selectCategory.appendChild(optionExp);
    selectCategory.appendChild(optionRev);
    dropdownContainer.appendChild(selectCategory);

    // Create dropdown menu for selecting linear or polynomial
    const selectModel = document.createElement('select');
    selectModel.setAttribute('id', 'selectModel');
    const optionLinear = document.createElement('option');
    optionLinear.value = 'linear';
    optionLinear.textContent = 'Linear';
    const optionPoly = document.createElement('option');
    optionPoly.value = 'poly';
    optionPoly.textContent = 'Polynomial';
    selectModel.appendChild(optionLinear);
    selectModel.appendChild(optionPoly);
    dropdownContainer.appendChild(selectModel);


    // Fetch data from the API
    fetchChartData89(); // Initial fetch with default model and category

    

    // Event listener for model change
    document.getElementById("selectModel").addEventListener("change", function() {
        fetchChartData89();
    });

    // Event listener for category change
    document.getElementById("selectCategory").addEventListener("change", function() {
        fetchChartData89();
    });
}

// Function to fetch data from API and plot the chart
function fetchChartData89() {
    // Function to capitalize the first letter of each word with specific replacements
    function capitalizeFirstLetter(string) {
        switch (string.toLowerCase()) {
            case 'exp':
                return 'Expense';
            case 'rev':
                return 'Revenue';
            default:
                return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    const model = document.getElementById("selectModel").value;
    const category = document.getElementById("selectCategory").value;
    console.log("Category:", category);
    console.log("Model:", model);

    let apiUrl;
    if (model === "linear") {
        apiUrl = `http://127.0.0.1:5000/api/v1.0/${model}_regress_${category}/actual_vs_predicted/static`;
    } else if (model === "poly") {
        apiUrl = `http://127.0.0.1:5000/api/v1.0/${model}_regress_${category}/actual_vs_predicted/static`;
    }
    console.log("API URL:", apiUrl); // Print the API URL to debug

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and plot the graph
            // Example: Plot using Plotly
            const years = Object.keys(data);
            const actualValues = years.map(year => data[year].Actual);
            const predictedValues = years.map(year => data[year].Prediction);

            const traceActual = {
                x: years,
                y: actualValues,
                mode: 'lines+markers',
                name: 'Actual'
            };

            const tracePredicted = {
                x: years,
                y: predictedValues,
                mode: 'lines+markers',
                name: 'Predicted'
            };

            const layout = {
                title: `${capitalizeFirstLetter(category)}: ${capitalizeFirstLetter(model)} Regression`,
                xaxis: {
                    title: 'Year'
                },
                yaxis: {
                    title: '$$ Amount in Billions'
                }
            };

            const plotData = [traceActual, tracePredicted];
            Plotly.newPlot('graphics-output', plotData, layout);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


