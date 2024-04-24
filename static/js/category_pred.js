document.addEventListener('DOMContentLoaded', function() {
    const submenu41 = document.getElementById("submenu41");

    submenu41.addEventListener('click', function(event) {
        event.preventDefault();
        handleMenuClick89();
    });
});

// Function to handle menu clicks and create dropdown menu
function handleMenuClick89() {
    // Hide the Menu
    document.querySelector('.side-menu').style.display = 'none';

    // Remove any existing content in the graphics-output div
    let graphicArea = document.getElementById("graphics-output");
    graphicArea.innerHTML = "";

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
    graphicArea.appendChild(selectModel);

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
    graphicArea.appendChild(selectCategory);

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
    const model = document.getElementById("selectModel").value;
    const category = document.getElementById("selectCategory").value;
    let apiUrl;
    if (model === "linear") {
        apiUrl = `http://127.0.0.1:5000/api/v1.0/${model}_regress_${category}/actual_vs_predicted/static`;
    } else if (model === "poly") {
        apiUrl = `http://127.0.0.1:5000/api/v1.0/${model}_regress_${category}/actual_vs_predicted/static`;
    }

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
                title: `${category} ${model} Regression`,
                xaxis: {
                    title: 'Year'
                },
                yaxis: {
                    title: '$$ Amount in Millions'
                }
            };

            const plotData = [traceActual, tracePredicted];
            Plotly.newPlot('graphics-output', plotData, layout);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
