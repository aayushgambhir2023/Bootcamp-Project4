//Select your menu ID
let selectedMenu15 = "submenu15";

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu15 = document.getElementById(selectedMenu15); //Change Menu Here..

    submenu15.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
       
        let graphicArea = d3.select("#graphics-output");
        graphicArea.html("");

        graphicArea.append("div")
        .attr("id", "OutlierExpenseGraph")
        .style("width", "60%");

        //Call Function
        showOutlierExpensesGraph()

    });
});


function showOutlierExpensesGraph() {
  const jsonUrl = 'http://127.0.0.1:5000/api/v1.0/expense_data_mm';

  fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
          // Assuming the JSON structure fits the required data mapping
          let categories = data.map(item => item["Category Name"]);
          let budget = data.map(item => item["Budgeted amount"]);
          let trace = {
              x: categories,
              y: budget,
              type: "bar"
          };

          Plotly.newPlot('OutlierExpenseGraph', [trace], {
              title: 'Outlier Expenses by Category (2019-2023)'
          });
      })
      .catch(error => console.error('Error fetching or processing data:', error));
}
