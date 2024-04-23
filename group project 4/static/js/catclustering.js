//Select your menu ID
let selectedMenu = "submenu43";

document.addEventListener('DOMContentLoaded', function () {
    const maxK = 10;  // Adjust the maximum number of clusters as needed
    let kValues = Array.from({length: maxK}, (_, i) => i + 1);
    let inertiaValues = [];

    const fetchDataForK = (k) => fetch(`/api/v1.0/category_rev_clustering?clusters=${k}`)
        .then(response => response.json())
        .then(data => {
            inertiaValues.push(data.inertia);  // Assuming the API returns an object with an 'inertia' property
            if (inertiaValues.length < maxK) {
                fetchDataForK(kValues[inertiaValues.length]);
            } else {
                plotElbowChart();
            }
        })
        .catch(error => console.error('Error fetching data for k =', k, error));

    const plotElbowChart = () => {
        const ctx = document.getElementById('elbowChart').getContext('2d');
        const elbowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: kValues,
                datasets: [{
                    label: 'Inertia',
                    data: inertiaValues,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    // Start fetching data for k=1 initially
    fetchDataForK(1);
});

// Add this at the end of your existing JavaScript code
document.getElementById('submenu43').addEventListener('click', function() {
    // Retrieve the stored graph data
    const storedData = JSON.parse(localStorage.getItem('submenu 43'));

    if (storedData) {
        const ctx = document.getElementById('elbowChart').getContext('2d');
        const elbowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: storedData.k_values,
                datasets: [{
                    label: 'Inertia',
                    data: storedData.inertia,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    } else {
        console.error('No data found in local storage for submenu 43.');
    }
});

