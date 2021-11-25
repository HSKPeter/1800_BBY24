function writeSomeData() {
    firebase.auth().onAuthStateChanged(function(user) {
        //if (user) {
        // User is signed in.
        var dbref = db.collection("users") //.collection("thisWeeksTasks"); //.doc(user.uid)

        dbref.add({
            details: "Do comp1800 quiz",
            size: "M",
            end_date: firebase.firestore.Timestamp.fromDate(new Date("November 5 ,2021")),
            timespent: 20,
        });
        dbref.add({
            details: "Do comp1510 lab",
            size: "M",
            end_date: firebase.firestore.Timestamp.fromDate(new Date("November 10 ,2021")),
            timespent: 30
        });
        dbref.add({
            details: "Do comp1800 sprint planning",
            size: "L",
            end_date: firebase.firestore.Timestamp.fromDate(new Date("November 3 ,2021")),
            timespent: 20
        });
        dbref.add({
            details: "Do comp1100 journal",
            size: "L",
            end_date: firebase.firestore.Timestamp.fromDate(new Date("November 5 ,2021")),
            timespent: 60
        });

        //} //else {
        // No user is signed in.
        //}
        //});
    })
}
//writeSomeData();






// Display the chart inside the <div> element with id="piechart"


function chartMyData() {
    var labels = []; //insert task names here
    var values = []; //insert timespent values here

    //read data from Firestore
    firebase.auth().onAuthStateChanged(function(user) {
        //if (user) {
        // User is signed in.
        db.collection("timerSessions") //.where("size", "==", "L") //search by "L"arge size
            //.orderBy("end_date") //sort by completion date
            .get()
            .then(function(snap) {
                snap.forEach(function(doc) {
                    //console.log(doc.data()); //just to check
                    const yMilis = doc.data().actualTimeSpentForCompletion; //y-axis
                    let x = doc.data().taskName; //x-axis
                    let yHours = yMilis * 2.778E-07 * 100;
                    values.push(yHours); //timespent display on y
                    labels.push(x); //nickname display on x
                    //console.log(labels);
                    //console.log(values);
                })
                displayGraph(labels, values);
            });
        //} //else {
        // No user signed in. 
        //  }
        // })
    })
}
chartMyData();

function displayGraph(xlabels, yvalues) {
    var grapharea = document.getElementById('myChart');
    //assemble data and launch chart
    const data = {
        labels: xlabels,
        datasets: [{
            label: 'Time Taken to Complete Task',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: yvalues
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        option: {},
    };
    const myChart = new Chart(grapharea, config);
}

//function displaylist() {
//db.collection("tasks").get()
//.then(function(snap) {
//snap.forEach(function(doc) {

//var taskName = doc.data().name; //gets the name field
//var taskStatus = doc.data().status; //gets the unique ID field
//console.log(hikeID);
//document.getElementById('list').innerText = taskName + taskStatus;
//})
//})

//}
//displaylist();

function addItemsToList(name, status) {
    var table = document.getElementById('list');
    // var header = document.createElement("h2");
    // var header = document.createElement('th')

    var row = document.createElement('tr');
    var _name = document.createElement("td");
    var _status = document.createElement("td");

    _name.innerHTML = name //+ 'status:  ' + status
    _status.innerHTML = status
        //ul.appendChild(header);
    table.appendChild(row);

    row.appendChild(_name);
    row.appendChild(_status);


    //ul.appendChild(_status);
}

function fetchalldata() {
    firebase.auth().onAuthStateChanged(function(user) {
        db.collection("tasks").where("taskStatus", "==", "done").get().then(function(snap) {
            snap.forEach(function(doc) {
                let name = doc.data().name;
                let status = doc.data().taskStatus;
                addItemsToList(name, status);
            });
        });


    })
}
fetchalldata();
const data1 = {
    labels: [
        'Completed',
        'Uncompleted',
        'Partially-Completed'
    ],
    datasets: [{
        label: 'Task Status',
        data: [7, 8, 9],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
};
// </block:setup>

// <block:config:0>
const config1 = {
    type: 'pie',
    data: data1,
};
const myChart1 = new Chart(
    document.getElementById('myChart1'),
    config1
);
// </block:config>