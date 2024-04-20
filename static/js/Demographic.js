//Template for Event Listener Buttons

//Select your menu ID
let selectedMenu3 = "subMenu3";
const submenu3 = document.getElementById(selectedMenu3)

submenu3.addEventListener('click', function(event) {
    event.preventDefault();
    //hide the Menu
    document.querySelector('.side-menu').style.display = 'none';
 

    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");

    // Append the flex container
    graphicArea.append("div")
        .attr("id", "DemographicMapBox")
        .style("display", "flex")
        .style("flex-wrap", "wrap")
        .style("width", "600px")
        .style("height", "500px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("z-index", "500")
        .style("margin", "20px auto");

    // Select the flex container and append the Leaflet map to it
    graphicArea.select("#DemographicMapBox")
        .append("div")
        .attr("id", "DemographicMap")
        .style("flex", "1 1 100%") // Ensures the Leaflet map takes full width
        .style("height", "100%") // Set the height to 100% for the Leaflet map
        .style("z-index", "1");



    //LEGEND CSS---------------------------------------------------------------------------------------------
    // Define CSS rules
    var cssRules = `
    .info.legend {
        background: white;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    .circle {
        width: 12px;
        height: 12px;
        border: 1px solid black;
        border-radius: 50%;
        margin-right: 5px;
    }
    `;


    // Create a <style> element
    var styleElement = document.createElement('style');

    // Append CSS rules to the <style> element
    styleElement.appendChild(document.createTextNode(cssRules));

    // Append the <style> element to the graphics-output area
    graphicArea.node().appendChild(styleElement);

    //LEGEND CSS---------------------------------------------------------------------------------------------

    graphicArea.append("div")
        .classed("card card-body bg-light", true)
        .html("<h6>Parameter:</h6><select id='selDatasetDemo'></select>");

    graphicArea.append("div")
        .attr("id", "graph-container")
        .style("display", "flex")
        .style("justify-content", "space-between");

    graphicArea.select("#graph-container")
        .append("div")
        .attr("id", "DemographicGraph")
        .style("width", "70%")
        .style("height", "60vh");

    graphicArea.select("#graph-container")
        .append("div")
        .attr("id", "DemographicadditionalText")
        .style("width", "30%");
    
    // notes: tried to have 1 layer that updates instead of making 3 layers, but the errors took up too much time and still couldnt find a solution. made 3 layers instaed to switch between.
    // maybe add ward# inside choropleth map and popup?

    //url for ward and demographic data
    const wardsUrl = "/api/v1.0/city_wards_geo";
    const demographicUrl = "/api/v1.0/demographic_data_2022_budget";

    //variables to hold fetched data
    let wardsData;
    let demographicData;

    //options for dropdown and data.
    let options = [
        "Population density per square kilometre",
        "Median total income in 2020 among recipients ($)",
        "Average total income in 2020 among recipients ($)"
    ];

    //initial map and layer
    let map = L.map("DemographicMap").setView([43.69, -79.347015], 10);
    let populationLayer, medianIncomeLayer, averageIncomeLayer;

    //fetch ward and demographic data
    d3.json(wardsUrl).then(function(wardgeoData) {
        wardsData = wardgeoData;
        
        return d3.json(demographicUrl);
    }).then(function(demoData) {
        demographicData = demoData;
        //initialize map
        initMap(options[0]);
        //add dropdown options
        populateDropdown();
        //initial update for graph text
        updateAdditionalText(options[0]);

        // console.log("Wards Data:", wardsData);
        // console.log("Demographic Data:", demographicData);
    });

    //populate dropdown with options
    function populateDropdown() {
        let selectDropdown = document.getElementById("selDatasetDemo");

        options.forEach(option => {
            let optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            selectDropdown.appendChild(optionElement);
        });
    }

    //initialize map and layers
    function initMap(selectedValue) {
        // Add OpenStreetMap tiles to the map
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        //add layers
        populationLayer = L.layerGroup().addTo(map);
        medianIncomeLayer = L.layerGroup().addTo(map);
        averageIncomeLayer = L.layerGroup().addTo(map);

        renderLayers(selectedValue);
    }

    document.getElementById("selDatasetDemo").addEventListener("change", function() {
        optionChanged(this.value);
    });

    //dropdown option update
    function optionChanged(selectedValue) {
        renderLayers(selectedValue);
        updateAdditionalText(selectedValue)
    }

    //render all layers based on the dropdown option
    function renderLayers(selectedValue) {
        populationLayer.clearLayers();
        medianIncomeLayer.clearLayers();
        averageIncomeLayer.clearLayers();

        switch (selectedValue) {
            case options[0]:
                renderPopulationMap(selectedValue);
                break;
            case options[1]:
                renderMedianIncomeMap(selectedValue);
                break;
            case options[2]:
                renderAverageIncomeMap(selectedValue);
                break;
            default:
                console.error("Invalid option");
        }
    }

    //population graph
    function renderPopulationMap(selectedValue) {

        d3.json(demographicUrl).then(function(demographicData) {
            //color scale
            var colorScale = d3.scaleLinear()
                .domain([d3.min(demographicData, d => d[selectedValue]), d3.max(demographicData, d => d[selectedValue])])
                .range(["#ffffcc", "#800026"]);

            updateLegend(selectedValue);

            //add GeoJSON layer with ward boundaries and change color
            L.geoJSON(wardsData, {
                style: function (feature) {
                    let wardName = feature.properties.AREA_NAME;
                    //find the corresponding demographic data for the ward by searching for the same ward name
                    let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                    //get population density for the ward
                    let populationDensity = wardDemographicData ? wardDemographicData[selectedValue] : 0;
                    return {
                        color: "black",
                        fillColor: colorScale(populationDensity),
                        weight: 1.5,
                        fillOpacity: 0.7
                    };
                }
            }).addTo(populationLayer)
            .eachLayer(function(layer) {
                let wardName = layer.feature.properties.AREA_NAME;
                let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                let populationDensity = wardDemographicData ? wardDemographicData["Population density per square kilometre"] : 0;
                
                //click to popup text
                let popupContent = `<b>Ward Name:</b> ${wardName}<br><b>Population Density:</b> ${populationDensity} per sq. km`;
                
                //Bind popup to each layer
                layer.bindPopup(popupContent);
            });
        });
        //make population graph
        fetchGraphData(selectedValue);
    }

    //median income graph, nearly the same as population
    function renderMedianIncomeMap(selectedValue) {
        d3.json(demographicUrl).then(function(demographicData) {

            var colorScale = d3.scaleLinear()
                .domain([d3.min(demographicData, d => d[selectedValue]), d3.max(demographicData, d => d[selectedValue])])
                .range(["#ffffcc", "#800026"]);

            updateLegend(selectedValue);

    
            L.geoJSON(wardsData, {
                style: function (feature) {
                    let wardName = feature.properties.AREA_NAME;
                    
                    let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                    
                    let medianIncome = wardDemographicData ? wardDemographicData[selectedValue] : 0;
                    return {
                        color: "black",
                        fillColor: colorScale(medianIncome),
                        weight: 1.5,
                        fillOpacity: 0.7
                    };
                }
            }).addTo(medianIncomeLayer)
            .eachLayer(function(layer) {
                let wardName = layer.feature.properties.AREA_NAME;
                let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                let medianIncome = wardDemographicData ? wardDemographicData["Median total income in 2020 among recipients ($)"] : 0;
                
                
                let popupContent = `<b>Ward Name:</b> ${wardName}<br><b>Median Total Income:</b> ${medianIncome.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })}`;
                
            
                layer.bindPopup(popupContent);
            });
        });
        fetchGraphData(selectedValue);
    }

    //average income graph
    function renderAverageIncomeMap(selectedValue) {

        d3.json(demographicUrl).then(function(demographicData) {

            var colorScale = d3.scaleLinear()
                .domain([d3.min(demographicData, d => d[selectedValue]), d3.max(demographicData, d => d[selectedValue])])
                .range(["#ffffcc", "#800026"]);
            
            updateLegend(selectedValue);

            L.geoJSON(wardsData, {
                style: function (feature) {
                    let wardName = feature.properties.AREA_NAME;
    
                    let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
    
                    let averageIncome = wardDemographicData ? wardDemographicData[selectedValue] : 0;
                    return {
                        color: "black",
                        fillColor: colorScale(averageIncome),
                        weight: 1.5,
                        fillOpacity: 0.7
                    };
                }
            }).addTo(averageIncomeLayer)
            .eachLayer(function(layer) {
                let wardName = layer.feature.properties.AREA_NAME;
                let wardDemographicData = demographicData.find(entry => entry.Ward === wardName);
                let averageIncome = wardDemographicData ? wardDemographicData["Average total income in 2020 among recipients ($)"] : 0;
                
                let popupContent = `<b>Ward Name:</b> ${wardName}<br><b>Average Total Income:</b> ${averageIncome.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })}`;
                

                layer.bindPopup(popupContent);
            });
        });
        fetchGraphData(selectedValue);
    }

    //add legend and update
    function updateLegend(selectedValue) {
        //clear existing legend
        if (map.legend) {
            map.legend.remove();
        }

        map.legend = L.control({ position: "bottomright" });

        map.legend.onAdd = function () {
            let div = L.DomUtil.create("div", "info legend");
            let legendTitle;
            let colorLow, colorHigh;

            //legend title and colors based on dropdown option
            switch (selectedValue) {
                case options[0]:
                    legendTitle = "Population Density";
                    colorLow = "#ffffcc";
                    colorHigh = "#800026";
                    break;
                case options[1]:
                    legendTitle = "Median Total Income";
                    colorLow = "#ffffcc";
                    colorHigh = "#800026";
                    break;
                case options[2]:
                    legendTitle = "Average Total Income";
                    colorLow = "#ffffcc";
                    colorHigh = "#800026";
                    break;
                default:
                    console.error("Invalid option");
                    break;
            }

            //add legend title
            div.innerHTML += "<h4>" + legendTitle + "</h4>";

            //add legend colors and labels
            div.innerHTML +=
                '<div class="legend-item"><i class="circle" style="background:' + colorLow + '"></i> Lowest</div>';
            div.innerHTML +=
                '<div class="legend-item"><i class="circle" style="background:' + colorHigh + '"></i> Highest</div>';

            return div;
        };

        map.legend.addTo(map);
    }
    //==============================
    //
    //graph portion

    //this is because the url is different from option name.
    var graphName = {
        "Population density per square kilometre": "population_density",
        "Median total income in 2020 among recipients ($)": "median_income",
        "Average total income in 2020 among recipients ($)": "average_income"
    };

    const graphUrl = "/api/v1.0/demographic_graph_data"

    //function to make graph
    function fetchGraphData(selectedValue) {
        fetch(`${graphUrl}?graph_type=${graphName[selectedValue]}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                // console.log(selectedValue)
                let xValues = data.x_values;
                let yValues = data.y_values;
                let regressValues = data.regress_values;
                let rValue = data.r_value;
                let regressionEquation = data.regression_equation;

                //trace for scatter plot
                let scatterTrace = {
                    x: xValues,
                    y: yValues,
                    mode: "markers",
                    marker: {color: "red", opacity: 0.7},
                    name: `${selectedValue} of Each Ward`
                };

                //trace for regression line
                let regressionTrace = {
                    x: xValues,
                    y: regressValues,
                    mode: "lines",
                    line: {color: "blue"},
                    name: `${selectedValue} Regression Line`
                };

                //graph layout
                let layout = {
                    title: {
                        text: `Relationship between ${selectedValue} and Budget Allocation`,
                        font: {
                            size: 14 // Adjust the font size as needed
                        }
                    },
                    xaxis: {title: `${selectedValue}`},
                    yaxis: {title: "Budget Allocation in 2022 ($)"},
                    showlegend: true,
                    legend: {x: 1, xanchor: "right", y: 1},
                    annotations: [
                        {
                            x: 0.0,
                            y: -0.1,
                            xref: "paper",
                            yref: "paper",
                            text: `The ${selectedValue} r-value is: ${rValue}`,
                            showarrow: false,
                            font: {size: 12},
                        },
                        {
                            x: 0.5, // Adjust x position as needed
                            y: 0.45, // Adjust y position as needed
                            xref: 'paper',
                            yref: 'paper',
                            text: `Regression Equation: ${regressionEquation}`,
                            showarrow: false,
                            font: {size: 12},
                        }
                    ]
                };

                //plot graph
                Plotly.newPlot("DemographicGraph", [scatterTrace, regressionTrace], layout);
            })
    }


    //Additional text for graph explanation:

    // Function to update additional text based on the selected option
    function updateAdditionalText(selectedValue) {
        let additionalText = document.getElementById("DemographicadditionalText");

        // Clear previous text
        additionalText.innerHTML = "";
        
        if (selectedValue === options[0]) {
            additionalText.innerHTML = "This is an analysis of how the population density per square kilometers of wards in Toronto impacts how much budget Toronto allocates to to the wards.<br><br> The correlation coefficient suggests a positive correlation, so as population density increases, the budget allocation tends to increase as well, but the relationship is weak to moderate.";
        } else if (selectedValue === options[1]) {
            additionalText.innerHTML = "This graph is made to understand how income levels influence budget allocation. <br><br>We used the income in 2020 because this would be the data they receive in 2021 to determine the 2022 budget if there was an impact, and used both median income and average income. <br><br>The median income regression, much like the average income regression suggests a positive relationship. <br>However, when looking at the correlation coefficient, both are relatively weak, so we can’t claim that income levels play a significant part in deciding budget choices. There could be many other factors that could influence the budget.";
        } else {
            additionalText.innerHTML = "This graph is made to understand how income levels influence budget allocation. <br><br>We used the income in 2020 because this would be the data they receive in 2021 to determine the 2022 budget if there was an impact, and used both median income and average income. <br><br>The average income regression, much like the median income regression suggests a positive relationship. <br>However, when looking at the correlation coefficient, both are relatively weak, so we can’t claim that income levels play a significant part in deciding budget choices. There could be many other factors that could influence the budget.";
        }
    }



    
});
