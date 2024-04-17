//Select your menu ID
let selectedMenu13 = "submenu13";

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu13 = document.getElementById(selectedMenu13); //Change Menu Here..

    submenu13.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
       
        let graphicArea = d3.select("#graphics-output");
        graphicArea.html("");

        graphicArea.append("div")
        .attr("id", "ExpenseBellCurve")
        .style("width", "60%");

        graphicArea.append("div")
        .attr("id", "RevenueBellCurve")
        .style("width", "60%");

        //Call Function
        let ExpenseUrl = '/api/v1.0/statsexp'
        let RevenueUrl = '/api/v1.0/statsrev'
        showBellCurve(ExpenseUrl, "ExpenseBellCurve")
        showBellCurve(RevenueUrl, "RevenueBellCurve")

    });
});


function showBellCurve(GivenUrl, targetElementId) {
  // Fetch data from the API
  fetch(GivenUrl)
      .then(response => response.json())
      .then(data => {
          // Extract years, means, and standard deviations
          const years = Object.keys(data);
          const means = years.map(year => Math.abs(Math.round(data[year].mean))); // Round mean values and get absolute values
          const stdDeviations = years.map(year => data[year].std_dev);

          // Generate x values for the curves
          const x = [];
          for (let i = -100000000; i <= 100000000; i += 100000) {
              x.push(i);
          }

          // Generate y values for each bell curve
          const yData = [];
          for (let i = 0; i < years.length; i++) {
              const y = [];
              for (let j = 0; j < x.length; j++) {
                  const mean = means[i];
                  const stdDev = stdDeviations[i];
                  const exponent = -0.5 * Math.pow((x[j] - mean) / stdDev, 2);
                  const gaussian = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
                  y.push(gaussian);
              }
              yData.push(y);
          }

          // Create traces for each bell curve
          const traces = [];
          for (let i = 0; i < years.length; i++) {
              const trace = {
                  x: x,
                  y: yData[i],
                  mode: 'lines',
                  name: years[i],
                  hoverinfo: 'y+name',
                  hovertemplate: 'Mean: ' + means[i] + '<br>Density: %{y:.2p}<extra></extra>' // Display density as percentage
              };
              traces.push(trace);
          }

          // Define layout
          const title = targetElementId.charAt(0).toUpperCase() + targetElementId.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2'); // Convert camelCase to Title Case
          const layout = {
              title: title,
              xaxis: {
                  title: 'Value'
              },
              yaxis: {
                  title: 'Density'
              }
          };

          // Plot the graph on the specified target element ID
          Plotly.newPlot(targetElementId, traces, layout);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}
