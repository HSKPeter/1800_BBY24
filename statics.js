// Load google charts
google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Task', '%'],
        ['completed', 7],
        ['uncomplete', 1],
        ['partially-completed', 2],
    ]);

    // Optional; add a title and set the width and height of the chart
    var options = {
        'title': 'Average Work completed',
        'width': 700,
        'height': 700,

    };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}


window.onload = function() {
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Average time spent in hours"
        },
        data: [{
            // Change type to "doughnut", "line", "splineArea", etc.
            type: "column",
            dataPoints: [{
                label: "Task1",
                y: 2
            }, {
                label: "Task2",
                y: 4
            }, {
                label: "Task 3",
                y: 0.6
            }, {
                label: "Task 4",
                y: 2
            }, {
                label: "Task 5",
                y: 5
            }, {
                label: "Task 6",
                y: 10
            }]
        }]
    });
    chart.render();
}