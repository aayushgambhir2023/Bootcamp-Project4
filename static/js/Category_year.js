// Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu11 = document.getElementById("submenu11");

    submenu11.addEventListener('click', function(event) {
        event.preventDefault();
        handleMenuClick51();
    });
});

// Function to handle menu clicks
function handleMenuClick51() {
    // Hide the Menu
    document.querySelector('.side-menu').style.display = 'none';

    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");

    // Create dropdown menu for selecting expense or revenue
    const selectMenu = document.createElement('select');
    selectMenu.setAttribute('id', 'selectType');
    const optionExpense = document.createElement('option');
    optionExpense.value = 'Expense';
    optionExpense.textContent = 'Expense';
    const optionRevenue = document.createElement('option');
    optionRevenue.value = 'Revenue';
    optionRevenue.textContent = 'Revenue';
    selectMenu.appendChild(optionExpense);
    selectMenu.appendChild(optionRevenue);
    graphicArea.node().appendChild(selectMenu);

    // Create dropdown menu for selecting year
    const selectYear = document.createElement('select');
    selectYear.setAttribute('id', 'yearSelect');
    ["2019", "2020", "2021", "2022", "2023"].forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectYear.appendChild(option);
    });
    graphicArea.node().appendChild(selectYear);

    // Fetch data from the API
    fetchChartData51(); // Initial fetch with default year and type

    // Event listener for type change
    document.getElementById("selectType").addEventListener("change", function() {
        //console.log("selectType change event triggered");
        fetchChartData51();
    });

    // Event listener for year change
    document.getElementById("yearSelect").addEventListener("change", function() {
        //console.log("yearSelect change event triggered");
        fetchChartData51();
    });
}

// Function to fetch data from API and plot the chart
function fetchChartData51() {
    const menuType = document.getElementById("selectType").value;
    const year = document.getElementById("yearSelect").value;
    let apiUrl;
    if (menuType === "Expense") {
        apiUrl = `http://127.0.0.1:5000/api/v1.0/categories_exp/${year}`;
    } else if (menuType === "Revenue") {
        apiUrl = `http://127.0.0.1:5000/api/v1.0/categories_rev/${year}`;
    }

    //console.log("API URL:", apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Extracting data for plotting
            const categories = data.map(item => item['Category Name']);
            const values = menuType === "Expense" ? data.map(item => item['Expense']) : data.map(item => item['Revenue']);

            // Plot the bar chart for expenses or revenue by category
            const barData = [{
                x: categories,
                y: values,
                type: 'bar'
            }];
            const barLayout = {
                title: `${menuType} by Category in ${year}`,
                // xaxis: { title: 'Category' },
                yaxis: { title: `${menuType} in Millions` },
                width: 800,
                titlepad: 50,
                
             
            };
            //console.log("Bar Data:", barData);
            //console.log("Bar Layout:", barLayout);

            Plotly.newPlot('graphics-output', barData, barLayout);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle error here
        });
}
