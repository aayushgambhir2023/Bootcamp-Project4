// Define submenu42 variable
let submenu42_1 = "submenu42";

// Define getForecastingData function to retrieve response
function getForecastingData1(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

// Define Event Listener to main function
document.addEventListener('DOMContentLoaded', function () {
    attachEventListener1(submenu42_1);
});

// Function to attach event listener to submenu
function attachEventListener1(menuId) {
    const submenu1 = document.getElementById(menuId);

    submenu1.addEventListener('click', function (event) {
        event.preventDefault();
        // Hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
        // Call Function
        startForecastingGraph1();
    });
}

// Main function to start graph
function startForecastingGraph1() {
    // Select D3 Area, clear Content and adjust side-by-side view
    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");
    graphicArea.style("display", "flex");

    // Create Divs for graph and Dropdown menus + summary:
    graphicArea.append("div").attr("id", "leftColumn").style("width", "20%");
    graphicArea.append("div").attr("id", "rightColumn").style("width", "80%");

    // Select Divs
    let leftColumn = d3.select("#leftColumn");
    let rightColumn = d3.select("#rightColumn");

    // Add DropDown for what (Rev-Exp)
    let menuRevExp1 = leftColumn.append("select").attr("id", "ddRevExp1")
        .style("width", "90%")
        .style("font-size", "16px")
        .style("margin-top", "15px");

    menuRevExp1.append("option").attr("value", "Revenue").text("Revenue");
    menuRevExp1.append("option").attr("value", "Expense").text("Expenses");

    // Add DropDown for Program Selection
    let menuProgram1 = leftColumn.append("select").attr("id", "ddProg1")
        .style("width", "90%")
        .style("font-size", "16px")
        .style("margin-top", "15px");

    // Set default value for program selection
    menuProgram1.append("option").attr("value", "").text("Select a Program");

    // Create Div for summary graph
    leftColumn.append("div")
        .attr("id", "leftColumn2_1")
        .style("height", "80%")
        .style("z-index", "0");

    // Define default bar graph info with zero values
    let revList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let yearList = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    let traceBar = [{
        x: yearList,
        y: revList,
        text: yearList,
        type: "bar",
        //orientation : "h",
        hoverinfo: "text"
    }];
    // Start bargraph layout
    let layoutBar = {
        yaxis: {
            tickvals: revList,
            ticktext: revList
        }
    };
    // Plot bargraph into bar id.
    Plotly.newPlot("rightColumn", traceBar, layoutBar);

    // URL for API info
    let url_api_base = "/api/complete_program_analysis/all/";

    // Get API info to Populate DropDown
    getForecastingData1(url_api_base).then(function (data) {
        let programs = Object.keys(data);
        programs.forEach(program => {
            menuProgram1.append("option").attr("value", program).text(program);
        });
        // Call Listeners
        handleRevExpSelection1();
        handleProgramSelection1();
    });
}

// Function to handle the dropdown menu selection for RevExp
function handleRevExpSelection1() {
    const ddRevExp1 = document.getElementById("ddRevExp1");
    ddRevExp1.addEventListener('change', function () {
        generateForecastingGraphics1();
    });
}

// Function to handle the dropdown menu selection for Program
function handleProgramSelection1() {
    const ddProg1 = document.getElementById("ddProg1");
    ddProg1.addEventListener('change', function () {
        generateForecastingGraphics1();
    });
}

function generateForecastingGraphics1() {
    // Select page elements
    let menuRevExp1 = d3.select("#ddRevExp1");
    let menuProg1 = d3.select("#ddProg1");

    // Get current values at the moment selected
    let revexp = menuRevExp1.property("value");
    let prog = menuProg1.property("value");

    // Start Lists
    let revList = [];
    let expList = [];
    let yearList = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

    // URL for API info
    let url = "/api/complete_program_analysis/all";

    // Fetch data from API
    getForecastingData1(url).then(function (response) {
        // Check if data for the selected program exists
        if (response[prog] && response[prog].data) {
            let data = response[prog].data;
            let yearsWithData = data.map(entry => entry.year); // Get all years with data

            // Line graph values
            let yValues = [];
            let mcolor;
            if (revexp === "Revenue") {
                yValues = data.map(entry => entry.revenues);
                mcolor = "rgba(50, 171, 96, 0.6)"; // Green color
            } else {
                yValues = data.map(entry => entry.expenses);
                mcolor = "rgba(255, 99, 71, 0.6)"; // Red color
            }

            // Line graph infos
            let traceLine = [{
                x: yearsWithData,
                y: yValues,
                text: yValues.map(value => '$' + value.toLocaleString()),
                type: "scatter",
                mode: "lines",
                hoverinfo: "text",
                line: {
                    color: mcolor,
                    width: 5,
                    shape: "spline"
                },
                fill: "tozeroy",
                fillcolor: mcolor // Use the same color for the filled area
            }];

            // Line graph layout
            let layoutLine = {
                title: `Yearly ${revexp}: ${prog}`,
                xaxis: {
                    title: "Year",
                    tickmode: "array",
                    tickvals: yearsWithData,
                    ticktext: yearsWithData
                },
                yaxis: {
                    title: `${revexp} (CAD)`,
                    zeroline: false
                },
                plot_bgcolor: "#f7f7f7",
                paper_bgcolor: "#f7f7f7",
                margin: {
                    t: 50,
                    l: 50,
                    r: 50,
                    b: 50
                }
            };

            // Plot line graph
            Plotly.newPlot("rightColumn", traceLine, layoutLine);

            // Calculate total amounts for Summary Graph
            let totalRev = data.reduce((acc, entry) => acc + entry.revenues, 0);
            let totalExp = data.reduce((acc, entry) => acc + entry.expenses, 0);

            // Summary Bar Graph
            let xValues2 = ["Revenue", "Expenses"];
            let yValues2 = [totalRev, totalExp];
            let colors2 = ["rgba(50, 171, 96, 0.6)", "rgba(255, 99, 71, 0.6)"];

            let traceBar2 = [{
                x: xValues2,
                y: yValues2,
                text: yValues2.map(value2 => '$' + value2.toLocaleString()),
                type: "bar",
                hoverinfo: "text",
                marker: {
                    color: colors2
                }
            }];

            // Summary bargraph layout
            let layoutBar2 = {
                title: "Results - Last 10 Years",
                yaxis: {
                    ticktext: yValues2
                }
            };

            // Plot bargraph into lC2.
            Plotly.newPlot("leftColumn2_1", traceBar2, layoutBar2);
        } else {
            console.error(`Data for program '${prog}' not found.`);
        }
    }).catch(error => console.error('Error:', error));
}

// Initial call to start graph
startForecastingGraph1();
