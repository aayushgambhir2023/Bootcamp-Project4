// Select your menu ID
let selectedMenu21 = "submenu21";

// Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu21 = document.getElementById(selectedMenu21); 

    submenu21.addEventListener('click', function(event) {
        event.preventDefault();
        // Hide the Menu
        document.querySelector('.side-menu').style.display = 'none';

        let graphicArea = d3.select("#graphics-output");
        graphicArea.html("");

        graphicArea.append("label").text("Select year: ");
        
        graphicArea.append("select")
            .attr("id", "yearSelect")
            .selectAll("option")
            .data(["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"])
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d)
            .property("selected", d => d === "2019");

        // Append div elements for plots
        const plotContainers = ["revenuePlot", "expensePlot", "profitPlot", "positiveProfitPlot", "negativeProfitPlot"];

        plotContainers.forEach(container => {
            graphicArea.append("div")
                .attr("id", container)
                .style("width", "100%");
        });
        // Define the base URL for the Flask API
        const baseURL = 'http://127.0.0.1:5000/api/v1.0/';

        // Function to fetch summarized revenue data from Flask API endpoint and plot revenue
        function fetchAndPlotRevenue(year) {
            fetch(`${baseURL}summarized_revenue_data/${year}`)
                .then(response => response.json())
                .then(data => {
                    // Convert object data into an array of objects for sorting
                    const dataArray = Object.entries(data).map(([program, revenue]) => ({ program, revenue }));

                    // Sort the data array by revenue values in descending order
                    dataArray.sort((a, b) => b.revenue - a.revenue);

                    // Extract sorted programs and revenues from the sorted data array
                    const programs = dataArray.map(item => item.program);
                    const revenues = dataArray.map(item => item.revenue);

                    // Define trace for the revenue bar graph
                    const trace = {
                        x: programs,
                        y: revenues,
                        type: 'bar',
                        marker: {
                            color: 'rgb(0, 102, 204)' // Specify the color of the bars
                        }
                    };

                    // Define layout for the revenue bar graph
                    const layout = {
                        title: `Total Revenue for the Year: ${year}`,
                        xaxis: {
                            title: 'Programs',
                            tickangle: -45, // Rotate the x-axis tick labels by 45 degrees
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        yaxis: {
                            title: 'Revenue',
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        margin: { // Adjust the left margin to provide more space for the labels
                            l: 150 // Increase left margin as needed
                        }
                    };

                    // Create the revenue bar graph using Plotly
                    Plotly.newPlot('revenuePlot', [trace], layout);
                })
                .catch(error => console.error('Error fetching summarized revenue data:', error));
        }

        // Function to fetch summarized expense data from Flask API endpoint and plot expenses
        function fetchAndPlotExpense(year) {
            fetch(`${baseURL}summarized_expense_data/${year}`)
                .then(response => response.json())
                .then(data => {
                    // Convert object data into an array of objects for sorting
                    const dataArray = Object.entries(data).map(([program, expense]) => ({ program, expense }));

                    // Sort the data array by expense values in descending order
                    dataArray.sort((a, b) => b.expense - a.expense);

                    // Extract sorted programs and expenses from the sorted data array
                    const programs = dataArray.map(item => item.program);
                    const expenses = dataArray.map(item => item.expense);

                    // Define trace for the expense bar graph
                    const trace = {
                        x: programs,
                        y: expenses,
                        type: 'bar',
                        marker: {
                            color: 'rgb(0, 102, 204)' // Specify the color of the bars
                        }
                    };

                    // Define layout for the expense bar graph
                    const layout = {
                        title: `Total Expenditure for the Year: ${year}`,
                        xaxis: {
                            title: 'Programs',
                            tickangle: -45, // Rotate the x-axis tick labels by 45 degrees
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        yaxis: {
                            title: 'Expense',
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        margin: { // Adjust the left margin to provide more space for the labels
                            l: 150 // Increase left margin as needed
                        }
                    };

                    // Create the expense bar graph using Plotly
                    Plotly.newPlot('expensePlot', [trace], layout);
                })
                .catch(error => console.error('Error fetching summarized expense data:', error));
        }

        // Function to fetch summarized profit data from Flask API endpoint and plot profit
        function fetchAndPlotProfit(year) {
            fetch(`${baseURL}summarized_profit_data/${year}`)
                .then(response => response.json())
                .then(data => {
                    // Convert object data into an array of objects for sorting
                    const dataArray = Object.entries(data).map(([program, profit]) => ({ program, profit }));

                    // Sort the data array by profit values in descending order
                    dataArray.sort((a, b) => b.profit - a.profit);

                    // Split the profit data into positive and negative arrays
                    const positiveProfits = dataArray.filter(item => item.profit >= 0);
                    const negativeProfits = dataArray.filter(item => item.profit < 0);

                    // Extract programs and profits from the positive and negative arrays
                    const positivePrograms = positiveProfits.map(item => item.program);
                    const negativePrograms = negativeProfits.map(item => item.program);
                    const positiveProfitsValues = positiveProfits.map(item => item.profit);
                    const negativeProfitsValues = negativeProfits.map(item => item.profit);

                    // Define traces for the positive and negative profit bar graphs
                    const positiveTrace = {
                        x: positivePrograms,
                        y: positiveProfitsValues,
                        type: 'bar',
                        name: 'Positive Profits',
                        marker: {
                            color: 'rgb(0, 102, 204)' // Specify the color of the bars for positive profits
                        }
                    };

                    const negativeTrace = {
                        x: negativePrograms,
                        y: negativeProfitsValues,
                        type: 'bar',
                        name: 'Negative Profits',
                        marker: {
                            color: 'rgb(0, 102, 204)' // Specify the color of the bars for negative profits
                        }
                    };

                    // Define layout for the positive profit bar graph
                    const positiveLayout = {
                        title: `Most Profitable Program for: ${year}`,
                        xaxis: {
                            title: 'Programs',
                            tickangle: -45, // Rotate the x-axis tick labels by 45 degrees
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        yaxis: {
                            title: 'Profit',
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        margin: {
                            l: 150 // Adjust the left margin to provide more space for the labels
                        }
                    };

                    // Define layout for the negative profit bar graph
                    const negativeLayout = {
                        title: `Least Profitable Program for: ${year}`,
                        xaxis: {
                            title: 'Programs',
                            tickangle: -45, // Rotate the x-axis tick labels by 45 degrees
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        yaxis: {
                            title: 'Profit',
                            automargin: true // Automatically adjust margin to prevent cutoff
                        },
                        margin: {
                            l: 150 // Adjust the left margin to provide more space for the labels
                        }
                    };

                    // Create the positive profit bar graph using Plotly
                    Plotly.newPlot('positiveProfitPlot', [positiveTrace], positiveLayout);

                    // Create the negative profit bar graph using Plotly
                    Plotly.newPlot('negativeProfitPlot', [negativeTrace], negativeLayout);
                })
                .catch(error => console.error('Error fetching summarized profit data:', error));
        }

        // Load and plot revenue and expense data for the year 2019 when link is clicked on. INITIAL
        
        const selectedYear = document.getElementById('yearSelect').value; 
        fetchAndPlotRevenue(selectedYear);
        fetchAndPlotExpense(selectedYear);
        fetchAndPlotProfit(selectedYear);

        // Attach event listener to year dropdown for revenue data
        document.getElementById('yearSelect').addEventListener('change', function() {
            const selectedYear = this.value; // Get the selected year from the dropdown
            fetchAndPlotRevenue(selectedYear); // Fetch and plot revenue data for the selected year
            fetchAndPlotExpense(selectedYear); // Fetch and plot expense data for the selected year
            fetchAndPlotProfit(selectedYear);
        })
    });
});