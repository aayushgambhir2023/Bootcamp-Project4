//Select your menu ID
let selectedMenu = "submenu44";

// create getJson function to retrieve response
function getJson(url){
     return d3.json(url);
}

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu1 = document.getElementById(selectedMenu);

    submenu1.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
        //Call Function
        startGraph();
    });
});

//Initial Graph Function
function startGraph(){

    //Select D3 Area, clear Content and adjust side-by side view
    let outputArea = d3.select("#graphics-output");
    outputArea.html("");
    outputArea.style("display", "block");

    //Create Divs for Intro:
    outputArea.append("div").attr("id", "introArea").style("width", "100%");
    let introArea = d3.select("#introArea");

    introArea.append("H1").text("Clustering of City Programs Using K-means algorithm")
    .style("font-family", "Arial, sans-serif")
    .style("text-align", "center");

    let h3Text = introArea.append("H3").text("Select the number of Clusters and year to apply into the trained module. The options of cluster numbers have been defined analysing the inertia curves of 11 clusters for all years")
    .style("font-family", "Arial, sans-serif")
    .style("text-align", "center");

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
    outputArea.append("div").attr("id", "graphArea").style("width", "100%");;
    let graphArea = d3.select("#graphArea");

    graphArea.append("div").attr("id", "leftColumn").style("width", "20%");
    graphArea.append("div").attr("id", "rightColumn").style("width", "80%");

    //Select Divs
    let leftColumn = d3.select("#leftColumn");

    //Add DropDown for number of clusters
    let menuNoClusters = leftColumn.append("select").attr("id", "ddClusters")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");

    menuNoClusters.append("option").attr("value", "2").text("2 Clusters");
    menuNoClusters.append("option").attr("value", "3").text("3 Clusters");

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
    .on("click", generateGraphics);

    //create Div for summary graph
    leftColumn.append("div")
    .attr("id", "leftColumn2")
    .style("height", "80%")
    .style("z-index", "0");
          
}

//Function to update graphics
function generateGraphics(){

    //Select page elements
    let menuNoClusters = d3.select("#ddClusters");
    let menuYear = d3.select("#ddYear");

    //Get current values at the moment selected
    let noClusters = menuNoClusters.property("value");
    let year = menuYear.property("value");

    api_url = "/api/v1.0/program_cluster/" + noClusters + "/" + year;

    //Loop through all items(years) of the json
    getJson(api_url).then(function(data){

        console.log(data);

        // for (let yearloop = 0; yearloop < yearList.length; yearloop++){
        //     datayear = data[yearloop];
        //     //Search the slected program for the values
        //     for (let progloop = 0; progloop < datayear.length; progloop++){
        //         if(datayear[progloop].Program == prog){
        //             revList[yearloop] = datayear[progloop].rev
        //             expList[yearloop] = datayear[progloop].exp
        //         }
        //     }
        // }

        // //Start Line Graph Values
        // let yValues = []
        // let mcolor = "rgba(50, 171, 96, 0.6)";
        // let lcolor = "rgba(50, 171, 96, 1.0)";
    
        // //Set type (rev or Expenses) determ. list and color
        // if(revexp == "Revenue"){
        //     yValues = revList;
        // }else{
        //     yValues = expList;
        //     mcolor = "rgba(255, 99, 71, 0.6)";
        //     lcolor = "rgba(255, 99, 71, 1.0)";
        // }

        // // Line graph infos
        // let traceLine = [{
        //     x: yearList,
        //     y: yValues,
        //     text: yValues.map(value => '$' + value.toLocaleString()),
        //     type: "scatter",
        //     mode: "lines",
        //     hoverinfo: "text",
        //     line: {
        //         color: mcolor,
        //         width: 5, 
        //         shape: "spline", // ChatGPT part for curvy line
        //     },
        //     fill: "tozeroy" // ChatGPT part for filling area underneath the line
        // }];

        // // Line graph layout
        // let layoutLine = {
        //     title: "Yearly " + revexp + ": " + prog,
        //     xaxis: {
        //         title: "Year",
        //         tickmode: "array", 
        //         tickvals: yearList 
        //     },
        //     yaxis: {
        //         title: "Revenue (CAD)",
        //         zeroline: false 
        //     },
        //     plot_bgcolor: "#f7f7f7",
        //     paper_bgcolor: "#f7f7f7",
        //     margin: {
        //         t: 50,
        //         l: 50,
        //         r: 50,
        //         b: 50
        //     }
        // };

        // // Plot line graph
        // Plotly.newPlot("rightColumn", traceLine, layoutLine);

        // // Calculate total amounts for Summary Graph
        // let totalRev = 0;
        // let totalExp = 0;

        // for (let totloop = 0; totloop < revList.length; totloop++){
        //     totalRev = totalRev + revList[totloop];
        //     totalExp = totalExp + expList[totloop];
        // }

        // //Summary Bar Graph
        // let xValues2 = ["Revenue", "Expenses"];
        // let yValues2 = [totalRev, totalExp];
        // let colors2 = ["rgba(50, 171, 96, 0.6)", "rgba(255, 99, 71, 0.6)"];

        // let traceBar2 = [{
        //     x : xValues2,
        //     y : yValues2,
        //     text : yValues2.map(value2 => '$' + value2.toLocaleString()),
        //     type : "bar",
        //     hoverinfo : "text",
        //     marker: {
        //         color: colors2 
        //     }
        //     }];
        //     //start bargraph layout
        //     let layoutBar2 = {
        //     title: "Results - Last 10 Years",
        //     yaxis: { 
        //         ticktext: yValues2
        //         }
        //     };
        //     //plot bargraph into lC2.
        //     Plotly.newPlot("leftColumn2", traceBar2, layoutBar2);
    
    });

}





    
