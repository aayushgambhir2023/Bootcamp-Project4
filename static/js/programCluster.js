//Select your menu ID
let selectedMenu44 = "submenu44";

// create getJsonML function to retrieve response
function getJsonML(url){
     return d3.json(url);
}

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu1 = document.getElementById(selectedMenu44);

    submenu1.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
        //Call Function
        startGraphML();
    });
});

//Initial Graph Function
function startGraphML(){

    //Select D3 Area, clear Content and adjust side-by side view
    let outputArea = d3.select("#graphics-output");
    outputArea.html("");
    outputArea.style("display", "block");

    //Create Divs for Intro:
    outputArea.append("div").attr("id", "introArea").style("width", "100%");
    let introArea = d3.select("#introArea");

    //Add intro Text
    introArea.append("H1").text("Clustering of City Programs Using K-means algorithm")
    .style("font-family", "Arial, sans-serif")
    .style("text-align", "center");

    let h3Text = introArea.append("H3")
    .html("The module is trained based on each program's revenue, expenses, and results amount for each year separately. Select the number of Clusters and year to apply into the trained module.<br>The options of cluster numbers have been defined by analyzing the inertia curves of 11 clusters for all years (each line = a year 2014 - 2023).")
    .style("font-family", "Arial, sans-serif")
    .style("text-align", "center");

    //Link for complete elbow graph image
    h3Text.append("a")
    .text("See graph")
    .attr("target", "_blank")
    .style("color", "#007BFF")
    .style("margin-left", "10px")
    .on("mouseover", function() {
        d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function() {
        d3.select(this).style("cursor", "pointer");
    })
    .on("click", function() {
        let imageURL = "https://github.com/aayushgambhir2023/Bootcamp-Project4/blob/main/ML_modules/programs_cluster/inertias/elbow_ALL_plot.png?raw=true";
        window.open(imageURL, "ImageWindow", "width=800,height=600,scrollbars=no,toolbar=no,status=no,resizable=no");
    });
    
    //Create Divs for grph and Dropr menus + summary:
    outputArea.append("div").attr("id", "graphArea").style("display", "flex").style("width", "100%");;
    let graphArea = d3.select("#graphArea");

    graphArea.append("div").attr("id", "leftColumn").style("width", "20%").style("flex", "1");
    graphArea.append("div").attr("id", "rightColumn").style("width", "80%").style("flex", "4");

    //Select Divs
    let leftColumn = d3.select("#leftColumn");

    //Add DropDown for number of clusters
    let menuNoClusters = leftColumn.append("select").attr("id", "ddClusters")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");

    menuNoClusters.append("option").attr("value", "2").text("2 Clusters");
    menuNoClusters.append("option").attr("value", "3").text("3 Clusters");
    menuNoClusters.append("option").attr("value", "4").text("4 Clusters");

    //Add DropDown for Year Selection
    let menuYear = leftColumn.append("select").attr("id", "ddYear")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");
    
    let yearList = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
    
    for (let yearlooper = 0; yearlooper < yearList.length; yearlooper++){
        menuYear.append("option").attr("value", yearList[yearlooper]).text(yearList[yearlooper]);
    }

    //Add calc button
    let getResultsButton = leftColumn.append("button")
    .text("Cluster it!")
    .style("margin-top", "10px")
    .style("padding", "10px 20px")
    .style("width", "90%")
    .style("background-color", "#007BFF")
    .style("color", "white")
    .style("border", "none")
    .style("border-radius", "5px")
    .style("cursor", "pointer")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "16px")
    .style("transition", "background-color 0.3s ease")
    .on("mouseover", function() {
        d3.select(this).style("background-color", "#0056b3");
    })
    .on("mouseout", function() {
        d3.select(this).style("background-color", "#007BFF");
    })
    .on("click", generateGraphicML);

    //create Div for inertia graph
    leftColumn.append("div")
    .attr("id", "leftColumn2")
    .style("height", "80%")
    .style("z-index", "0");
          
}

//Function to update graphics
function generateGraphicML(){

    //Select page elements
    let menuNoClusters = d3.select("#ddClusters");
    let menuYear = d3.select("#ddYear");

    //Get current values at the moment selected
    let noClusters = menuNoClusters.property("value");
    let year = menuYear.property("value");

    api_url = "/api/v1.0/program_cluster/" + noClusters + "/" + year;

    //Loop through all items(years) of the json
    getJsonML(api_url).then(function(data){

        // Load inertia graph
        let inertiaImageArea = d3.select("#leftColumn2");
        inertiaImageArea.html('');
        inertiaImageArea.append("img").attr("src", `https://github.com/aayushgambhir2023/Bootcamp-Project4/blob/Lucas/ML_modules/programs_cluster/inertias/elbow_${year}_plot.png?raw=true`)
        .style("width", "100%");

        let progNames = data.map(item => item.Program);
        let progRevs = data.map(item => item.rev);
        let progExps = data.map(item => item.exp);
        let progClusters = data.map(item => item.cluster);

        //Start Line Graph Values
        // Graph info
        let traceLine = [{
            x: progExps,
            y: progRevs,
            xaxis: {
                title: "Expenses",
                tickmode: "array", 
            },
            yaxis: {
                title: "Revenue",
                zeroline: false 
            },
            mode: 'markers',
            marker: {
              size: 13,
              color: progClusters
            },
            text: progNames,
            hovertemplate: '%{text}<br>Revenue: %{y}<br>Expenses: %{x}<br>Cluster: %{marker.color}',
            name: ''
          }];

        // Graph Layout
        let layoutLine = {
            title: "Clusters of Programs in " + year,

            plot_bgcolor: "#f7f7f7",
            paper_bgcolor: "#f7f7f7",
            margin: {
                t: 50,
                l: 50,
                r: 50,
                b: 50
            },
            //width: 1555,
            height: 500,
            xaxis: {
                showticklabels: false,
                title: "Expenses"
            },
            yaxis: {
                showticklabels: false,
                title: "Revenue"
            }
        };

        // Plot line graph
        Plotly.newPlot("rightColumn", traceLine, layoutLine);
    
    });

}





    
