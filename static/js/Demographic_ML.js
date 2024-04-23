
// console.log("yes")
// // Select your menu ID
// let selectedMenu45 = "subMenu45";
// const submenu45 = document.getElementById(selectedMenu45);

// submenu3.addEventListener('click', function(event) {
//     event.preventDefault();
//     // Hide the Menu
//     document.querySelector('.side-menu').style.display = 'none';

//     let graphicArea = d3.select("#graphics-output");
//     graphicArea.html("");

//     console.log("Working")

//     fetch('/api/v1.0/elbow_method_data')
//         .then(response => response.json())
//         .then(data => {
//             let numClusters = data.num_clusters;
//             let wcss = data.wcss;

//             console.log(numClusters)
//             console.log(wcss)

//             // Create trace for the elbow method graph
//             let elbowTrace = {
//                 x: numClusters,
//                 y: wcss,
//                 mode: "lines+markers",
//                 marker: {color: "red", opacity: 0.7},
//                 name: "WCSS"
//             };

//             // Layout for the elbow method graph
//             let layout = {
//                 title: {
//                     text: "Elbow Method",
//                     font: {
//                         size: 14 
//                     }
//                 },
//                 xaxis: {title: "Number of Clusters"},
//                 yaxis: {title: "WCSS"},
//                 showlegend: true,
//                 legend: {x: 1, xanchor: "right", y: 1}
//             };

//             // Plot the graph
//             Plotly.newPlot("elbowGraph", [elbowTrace], layout);
//         })
//         .catch(error => {
//             console.error('Error fetching elbow method data:', error);
//         });
// });






























// // //graphing kmeans.
// // document.addEventListener('DOMContentLoaded', function() {
// //     document.getElementById('submenu44').addEventListener('click', function(event) {
// //         event.preventDefault(); // Prevent default link behavior
        
// //         // Fetch data from Flask API
// //         fetch('/api/v1.0/Demo_K_Means')
// //             .then(response => response.json())
// //             .then(data => {
// //                 // Extract data
// //                 const demographicData = JSON.parse(data.demographic_data);
// //                 const kmeansModel = data.kmeans_model;
// //                 const wardClusterMapping = data.ward_cluster_mapping;

// //                 // Extract relevant features for plotting
// //                 const incomes = demographicData.map(d => d['Average total income in 2020 among recipients ($)']);
// //                 const budgets = demographicData.map(d => d['2022 Budget']);
// //                 const clusters = Object.values(wardClusterMapping);
// //                 const wardNames = demographicData.map(d => d['Ward']); // Extract ward names

// //                 // Plot the data
// //                 const ctx = document.getElementById('myChart').getContext('2d');
// //                 new Chart(ctx, {
// //                     type: 'scatter',
// //                     data: {
// //                         datasets: [{
// //                             label: 'Cluster',
// //                             data: incomes.map((_, i) => ({ x: incomes[i], y: budgets[i], cluster: clusters[i], ward: wardNames[i] })),
// //                             backgroundColor: 'rgba(255, 99, 132, 0.5)',
// //                         }]
// //                     },
// //                     options: {
// //                         title: {
// //                             display: true,
// //                             text: 'K-means Clustering of Wards'
// //                         },
// //                         scales: {
// //                             xAxes: [{
// //                                 scaleLabel: {
// //                                     display: true,
// //                                     labelString: 'Average total income in 2020 among recipients ($)'
// //                                 }
// //                             }],
// //                             yAxes: [{
// //                                 scaleLabel: {
// //                                     display: true,
// //                                     labelString: '2022 Budget (in thousands)'
// //                                 }
// //                             }]
// //                         },
// //                         tooltips: {
// //                             callbacks: {
// //                                 label: function(tooltipItem, data) {
// //                                     const wardName = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].ward;
// //                                     return wardName;
// //                                 }
// //                             }
// //                         }
// //                     }
// //                 });
// //             })
// //             .catch(error => console.error('Error fetching data:', error));
// //     });
// // });
// // //graphing elbow for k-means
// // document.addEventListener("DOMContentLoaded", function() {
// //     // Make GET request to the API endpoint
// //     axios.get('http://localhost:5000/api/v1.0/elbow_method_data')
// //         .then(function(response) {
// //             const elbowData = response.data;

// //             // Extract data from the response
// //             const numClusters = elbowData.num_clusters;
// //             const wcss = elbowData.wcss;

// //             // Create a new Chart.js instance
// //             const ctx = document.getElementById('elbowGraph').getContext('2d');
// //             const elbowChart = new Chart(ctx, {
// //                 type: 'line',
// //                 data: {
// //                     labels: numClusters,
// //                     datasets: [{
// //                         label: 'WCSS',
// //                         data: wcss,
// //                         backgroundColor: 'rgba(54, 162, 235, 0.2)',
// //                         borderColor: 'rgba(54, 162, 235, 1)',
// //                         borderWidth: 1
// //                     }]
// //                 },
// //                 options: {
// //                     responsive: true,
// //                     maintainAspectRatio: false,
// //                     scales: {
// //                         x: {
// //                             title: {
// //                                 display: true,
// //                                 text: 'Number of Clusters'
// //                             }
// //                         },
// //                         y: {
// //                             title: {
// //                                 display: true,
// //                                 text: 'WCSS'
// //                             }
// //                         }
// //                     }
// //                 }
// //             });
// //         })
// //         .catch(function(error) {
// //             console.error('Error fetching elbow method data:', error);
// //         });
// // });
