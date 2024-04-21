//Select your menu ID
let selectedMenu1 = "submenu22";

// create getJson function to retrieve response
function getJson(url){
    return d3.json(url);
}

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu1 = document.getElementById(selectedMenu1); //Change Menu Here..

    submenu1.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
        //Call Function
        //console.log("clicked") test
        startGraph();
    });
});

//Initial Graph Function
function startGraph(){

    //Select D3 Area, clear Content and adjust side-by side view
    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");
    graphicArea.style("display", "flex");

    //Create Divs for grph and Dropr menus + summary:
    graphicArea.append("div").attr("id", "leftColumn").style("width", "20%");
    graphicArea.append("div").attr("id", "rightColumn").style("width", "80%");

    //Select Divs
    let leftColumn = d3.select("#leftColumn");
    let rightColumn = d3.select("#rightColumn");

    //Add DropDown for what (Rev-Exp)
    let menuRevExp = leftColumn.append("select").attr("id", "ddRevExp")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");

    menuRevExp.append("option").attr("value", "Revenue").text("Revenue");
    menuRevExp.append("option").attr("value", "Expense").text("Expenses");

    //Add DropDown for Program Selection
    let menuProgram = leftColumn.append("select").attr("id", "ddProg")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");
    
    menuProgram.append("option").attr("value", "").text("Select a Program");

    //create Div for summary graph
    leftColumn.append("div")
    .attr("id", "leftColumn2")
    .style("height", "80%")
    .style("z-index", "0");

    //URL
    url_api_base = "/api/program_analysis/2023";

    //Get API info to Populate DropDown
    getJson(url_api_base).then(function(data){
        
        for (let looper1 = 0; looper1 < data.length; looper1++){
            menuProgram.append("option").attr("value", data[looper1].Program).text(data[looper1].Program);
        }
        //Call Listeners 
        handleRevExpSelection();
        handleProgramSelection();
    });

    //start bar graph info with Default options
    let revList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let yearList = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
    let traceBar = [{
        x : yearList,
        y : revList,
        text : yearList,
        type : "bar",
        //orientation : "h",
        hoverinfo : "text"
        }];
        //start bargraph layout
        let layoutBar = {
        yaxis: {
            tickvals: revList, 
            ticktext: revList
            }
        };
        //plot bargraph into bar id.
        Plotly.newPlot("rightColumn", traceBar, layoutBar);
      
}

// Function to handle the dropdown menu selection for RevExp
function handleRevExpSelection() {
    const ddRevExp = document.getElementById("ddRevExp");
    ddRevExp.addEventListener('change', function() {
        const selectedOption = ddRevExp.value;
        generateGraphics();
    });
}

// Function to handle the dropdown menu selection for Program
function handleProgramSelection() {
    const ddProg = document.getElementById("ddProg");
    ddProg.addEventListener('change', function() {
        const selectedOption = ddProg.value;
        generateGraphics();
    });
}

//Function to update graphics
function generateGraphics(){
    //Select page elements
    let menuRevExp = d3.select("#ddRevExp");
    let menuProg = d3.select("#ddProg");

    //Get current values at the moment selected
    let revexp = menuRevExp.property("value");
    let prog = menuProg.property("value");

    //console.log(revexp);
    //console.log(prog);

    // Start Lists
    let revList = [];
    let expList = [];
    let yearList = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];

    //URL for All years API
    url = "/api/program_analysis/all";

    //Loop through all items(years) of the json
    getJson(url).then(function(data){
        for (let yearloop = 0; yearloop < yearList.length; yearloop++){
            datayear = data[yearloop];
            //Search the slected program for the values
            for (let progloop = 0; progloop < datayear.length; progloop++){
                if(datayear[progloop].Program == prog){
                    revList[yearloop] = datayear[progloop].rev
                    expList[yearloop] = datayear[progloop].exp
                }
            }
        }

        //Start Line Graph Values
        let yValues = []
        let mcolor = "rgba(50, 171, 96, 0.6)";
        let lcolor = "rgba(50, 171, 96, 1.0)";
    
        //Set type (rev or Expenses) determ. list and color
        if(revexp == "Revenue"){
            yValues = revList;
        }else{
            yValues = expList;
            mcolor = "rgba(255, 99, 71, 0.6)";
            lcolor = "rgba(255, 99, 71, 1.0)";
        }

        // Line graph infos
        let traceLine = [{
            x: yearList,
            y: yValues,
            text: yValues.map(value => '$' + value.toLocaleString()),
            type: "scatter",
            mode: "lines",
            hoverinfo: "text",
            line: {
                color: mcolor,
                width: 5, 
                shape: "spline", // ChatGPT part for curvy line
            },
            fill: "tozeroy" // ChatGPT part for filling area underneath the line
        }];

        // Line graph layout
        let layoutLine = {
            title: "Yearly " + revexp + ": " + prog,
            xaxis: {
                title: "Year",
                tickmode: "array", 
                tickvals: yearList 
            },
            yaxis: {
                title: "Revenue (CAD)",
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
        let totalRev = 0;
        let totalExp = 0;

        for (let totloop = 0; totloop < revList.length; totloop++){
            if (revList[totloop]) {
                totalRev += revList[totloop];
            }
            if (expList[totloop]) {
                totalExp += expList[totloop];
            }
        }

        //Summary Bar Graph
        let xValues2 = ["Revenue", "Expenses"];
        let yValues2 = [totalRev, totalExp];
        let colors2 = ["rgba(50, 171, 96, 0.6)", "rgba(255, 99, 71, 0.6)"];

        let traceBar2 = [{
            x : xValues2,
            y : yValues2,
            text : yValues2.map(value2 => '$' + value2.toLocaleString()),
            type : "bar",
            hoverinfo : "text",
            marker: {
                color: colors2 
            }
            }];
            //start bargraph layout
            let layoutBar2 = {
            title: "Results - Last 10 Years",
            yaxis: { 
                ticktext: yValues2
                }
            };
            //plot bargraph into lC2.
            Plotly.newPlot("leftColumn2", traceBar2, layoutBar2);
    
    });

}





    
