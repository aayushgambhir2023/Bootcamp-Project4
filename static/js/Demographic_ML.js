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
    graphicArea.append("div")
    .attr("id", "ElbowGraph")
    .style("width", "60%");

    
    // console.log("Working")

    fetch('/api/v1.0/Demo_Elbow_data')
        .then(response => response.json())
        .then(data => {
            let numClusters = data.num_clusters;
            let wcss = data.wcss;

            console.log(numClusters)
            console.log(wcss)

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
                xaxis: {title: "Number of Clusters"},
                yaxis: {title: "WCSS"},
                showlegend: true,
                legend: {x: 1, xanchor: "right", y: 1}
            };

            // Plot the graph
            Plotly.newPlot("ElbowGraph", [elbowTrace], layout);
        });

})
