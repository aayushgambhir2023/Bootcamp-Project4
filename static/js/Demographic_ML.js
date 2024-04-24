// Select your menu ID
let selectedMenu45 = "submenu45";
const submenu45 = document.getElementById(selectedMenu45);

submenu45.addEventListener('click', function(event) {
    event.preventDefault();
    // Hide the Menu
    document.querySelector('.side-menu').style.display = 'none';

    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");
    
    //add graphic areas
    //K-means graphs

    graphicArea.append("div")
    .attr("id", "graphContainer")
    .style("width", "100%")
    .style("overflow", "hidden")
    .style("display", "flex");

    d3.select("#graphContainer").append("div")
        .attr("id", "DemoElbowGraph")
        .style("width", "35%");

    d3.select("#graphContainer").append("div")
        .attr("id", "DemoClusterGraph")
        .style("width", "65%");
    
    graphicArea.append("div")
    .attr("id","DemoAHCGraph")
    .style("width","100%");

    graphicArea.append("div")
    .attr("id", "DemoHLTree")
    .style("width", "100%")
    .html('<img src="https://raw.githubusercontent.com/aayushgambhir2023/Bootcamp-Project4/464ba620a67ed65ee360063f5a7405524d403fb9/ML_modules/demographic_cluster/Graphs/Demographic_HC_Dendrogram.png" style="display: block; margin: 0 auto; width: 60%;">');

    showElbowGraph()
    showClusterGraph()
    showAHCGraph()

})

function showElbowGraph(){
    const elbowurl = '/api/v1.0/Demo_Elbow_data';
    
    fetch(elbowurl)
        .then(response => response.json())
        .then(Edata => {
            let numClusters = Edata.num_clusters;
            let wcss = Edata.wcss;

            // Create trace for the elbow method graph
            let elbowTrace = {
                x: numClusters,
                y: wcss,
                mode: "lines+markers",
                marker: {color: "red", opacity: 0.7},
                name: "WCSS"
            };

            // Layout for the elbow method graph
            let layout = {
                title: {
                    text: "Elbow Method",
                    font: {
                        size: 14 
                    }
                },
                xaxis: {
                    title: "Number of Clusters",
                    tickmode: 'array',
                    tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Set tick values explicitly
                    ticktext: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] // Set corresponding tick labels
                },
                yaxis: {title: "WCSS"},
                showlegend: true,
                legend: {x: 1, xanchor: "right", y: 1}
            };

            // Plot the graph
            Plotly.newPlot("DemoElbowGraph", [elbowTrace], layout);
        });
}

function showClusterGraph(){
    const clusterUrl = '/api/v1.0/Demo_K_Means';
    
    fetch(clusterUrl)
        .then(response => response.json())
        .then(Cdata => {
            let demographic = JSON.parse(Cdata.demographic);
            
            // Extract data for plotting
            let wardLabels = demographic.map(entry => entry.Ward);
            let incomeData = demographic.map(entry => entry["Average total income in 2020 among recipients ($)"]);
            let budgetData = demographic.map(entry => entry["2022 Budget"]);
            let clusterData = demographic.map(entry => entry.Cluster);
            

            // Define colors for each cluster
            let colors = ['#1f77b4', '#ff7f0e', '#2ca02c'];

            // Initialize an array to hold traces for each cluster
            let traces = [];

            // Create trace for each cluster
            for (let i = 1; i <= 3; i++) { // <-- Start from cluster 1
                let filteredIndices = clusterData.reduce((acc, cluster, index) => {
                    if (cluster === i - 1) {
                        acc.push(index);
                    }
                    return acc;
                }, []);

                let trace = {
                    x: filteredIndices.map(index => incomeData[index]),
                    y: filteredIndices.map(index => budgetData[index]),
                    mode: 'markers',
                    marker: {
                        color: colors[i - 1],
                        size: 10
                    },
                    text: filteredIndices.map(index => `Ward: ${wardLabels[index]}`),
                    type: 'scatter',
                    name: `Cluster ${i}` // <-- Legend entry for each cluster
                };

                traces.push(trace);
            }

            // Layout for the scatter plot
            let layout = {
                title: 'K-Means Clustering of Wards - K = 3',
                xaxis: {title: 'Average total income in 2020 among recipients ($)'},
                yaxis: {title: '2022 Budget (in thousands $)'},
                showlegend: true,
                legend: {
                    x: 1,
                    xanchor: 'right',
                    y: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    bordercolor: '#000000',
                    borderwidth: 1
                }
            };

            // Plot the graph
            Plotly.newPlot('DemoClusterGraph', traces, layout);
        })
        .catch(error => console.error('Error:', error));
}


function showAHCGraph() {
    const ahcUrl = '/api/v1.0/Demo_AHC_Data';

    fetch(ahcUrl)
        .then(response => response.json())
        .then(data => {
            let demographic = JSON.parse(data.clusters);

            // Extract data for plotting
            let wardLabels = demographic.map(entry => entry.Ward);
            let budgetData = demographic.map(entry => entry["2022 Budget"]);
            let populationDensityData = demographic.map(entry => entry["Population density per square kilometre"]);
            let clusterData = demographic.map(entry => entry.Cluster);

            // Define colors for each cluster
            let colors = ['#1f77b4', '#ff7f0e', '#2ca02c'];

            // Initialize an array to hold traces for each cluster
            let traces = [];

            // Create trace for each cluster
            for (let i = 0; i < Math.max(...clusterData) + 1; i++) {
                let filteredIndices = clusterData.reduce((acc, cluster, index) => {
                    if (cluster === i) {
                        acc.push(index);
                    }
                    return acc;
                }, []);

                let trace = {
                    x: filteredIndices.map(index => populationDensityData[index]),
                    y: filteredIndices.map(index => budgetData[index]),
                    mode: 'markers',
                    marker: {
                        color: colors[i],
                        size: 10
                    },
                    text: filteredIndices.map(index => `Ward: ${wardLabels[index]}`),
                    type: 'scatter',
                    name: `Cluster ${i + 1}` // Adjust legend names to start from Cluster 1
                };

                traces.push(trace);
            }

            // Layout for the scatter plot
            let layout = {
                title: 'Agglomerative Hierarchical Clustering of Wards',
                xaxis: { title: 'Population density per square kilometre' },
                yaxis: { title: '2022 Budget (in thousands $)' },
                showlegend: true,
                legend: {
                    x: 1,
                    xanchor: 'right',
                    y: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    bordercolor: '#000000',
                    borderwidth: 1
                }
            };

            // Plot the graph
            Plotly.newPlot('DemoAHCGraph', traces, layout);
        })
        .catch(error => console.error('Error:', error));
}
