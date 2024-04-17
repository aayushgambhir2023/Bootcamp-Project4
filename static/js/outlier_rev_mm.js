//Select your menu ID
let selectedMenu14 = "submenu14";

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu14 = document.getElementById(selectedMenu14); //Change Menu Here..

    submenu14.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
       
        let graphicArea = d3.select("#graphics-output");
        graphicArea.html("");

        graphicArea.append("div")
        .attr("id", "OutlierRevenueGraph")
        .style("width", "60%");

        //Call Function
        showOutlierRevenueGraph()

    });
});

function showOutlierRevenueGraph() {
  const jsonUrl = 'http://127.0.0.1:5000/api/v1.0/revenue_data_mm';

  fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
          // Process the JSON data
          let categories = data.map(item => item["Category Name"]);
          let budget = data.map(item => (item["Budgeted amount"] * -1));
          let trace = {
              x: categories,
              y: budget,
              type: "bar"
          };

          // Plotting the graph within the 'graphics-output' div
          Plotly.newPlot('graphics-output', [trace], {
              title: 'Revenue Data by Category (2019-2023)'
          });
      })
      .catch(error => console.error('Error fetching or processing data:', error));
 
    }