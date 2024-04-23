// Select your menu ID
let selectedMenu43 = "submenu43";
const submenu43 = document.getElementById(selectedMenu43);

submenu43.addEventListener('click', function(event) {
    event.preventDefault();
    // Hide the Menu
    document.querySelector('.side-menu').style.display = 'none';

    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");
    
    //add graphic areas

    graphicArea.append("div")
    .attr("id", "elbowContainer")
    .style("width", "100%")
    .style("overflow", "hidden")
    .style("display", "flex");

    d3.select("#elbowContainer").append("div")
        .attr("id", "ElbowGraphRev")
        .style("width", "50%");

    d3.select("#elbowContainer").append("div")
        .attr("id", "ElbowGraphExp")
        .style("width", "50%");

    showElbowGraphRev()
    showElbowGraphExp()


})

function showElbowGraphRev(){
    const elbowurl = '/api/v1.0/category_rev_clustering';
    
    fetch(elbowurl)
        .then(response => response.json())
        .then(data => {
            let categories = data.map(entry => entry['Category Name']);
            let clusters = data.map(entry => entry['Predicted Clusters']);

            // Create trace for the elbow method graph
            let elbowTrace = {
                x: categories,
                y: clusters,
                mode: "lines+markers",
                marker: {color: "red", opacity: 0.7},
                name: "Predicted Clusters"
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
                    title: "Category Name",
                    tickmode: 'array',
                    tickvals: categories,
                    ticktext: categories
                },
                yaxis: {title: "Predicted Clusters"},
                showlegend: true,
                legend: {x: 1, xanchor: "right", y: 1}
            };

            // Plot the graph
            Plotly.newPlot("ElbowGraphRev", [elbowTrace], layout);
        });
}


function showElbowGraphExp(){
    const elbowurl = '/api/v1.0/category_exp_clustering';
    
    fetch(elbowurl)
        .then(response => response.json())
        .then(data => {
            let categories = data.map(entry => entry['Category Name']);
            let clusters = data.map(entry => entry['Predicted Clusters']);

            // Create trace for the elbow method graph
            let elbowTrace = {
                x: categories,
                y: clusters,
                mode: "lines+markers",
                marker: {color: "blue", opacity: 0.7}, // Changed color to blue for distinction
                name: "Predicted Clusters"
            };

            // Layout for the elbow method graph
            let layout = {
                title: {
                    text: "Elbow Method (Exp)",
                    font: {
                        size: 14 
                    }
                },
                xaxis: {
                    title: "Category Name",
                    tickmode: 'array',
                    tickvals: categories,
                    ticktext: categories
                },
                yaxis: {title: "Predicted Clusters"},
                showlegend: true,
                legend: {x: 1, xanchor: "right", y: 1}
            };

            // Plot the graph
            Plotly.newPlot("ElbowGraphExp", [elbowTrace], layout);
        });
}

