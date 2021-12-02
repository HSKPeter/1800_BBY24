// fetching the data from the firebase about the time spent on each task.
function chartMyData() {
    var labels = []; //insert task names here
    var values = []; //insert timespent values here

    //read data from Firestore
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            db.collection("users").doc(user.uid).collection("timerSessions")
                .get()
                .then(function(snap) {
                    console.log(snap);
                    snap.forEach(function(doc) {
                        //console.log(doc.data()); //just to check
                        const yMilis = doc.data().actualTimeSpentForCompletion;
                        //y-axis
                        console.log(yMilis);
                        let x = doc.data().taskName; //x-axis
                        let yHours = (yMilis / 60000);
                        values.push(yHours); //timespent display on y
                        labels.push(x); //nickname display on x
                        //console.log(labels);
                        //console.log(values);
                    });
                    console.log(labels, values);
                    displayGraph(labels, values);

                });
        } else {
            // No user signed in. 
        }
    })
}

// drawing the chart from fetched data 
chartMyData();

function displayGraph(xlabels, yvalues) {
    var grapharea = document.getElementById('myChart');
    //assemble data and launch chart
    const data = {
        labels: xlabels,
        datasets: [{
            label: 'Time Taken to Complete Task In Minutes',
            backgroundColor: 'rgb(199,21,133)',
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


// a function that will display the list of items that are completed by the user
function addItemsToList(name) {
    var ul = document.getElementsByClassName("list-group");
    var _row = document.createElement("li");
    // console.log("element created");

    _row.innerHTML = name
        //console.log(row); //+ 'status:  ' + status

    console.log(ul[0]);
    // ul[0].appendChild(_row);
    console.log(ul[0].innerHTML)
    console.log(_row);
    ul[0].innerHTML += `<li><span style = "color: green; font-size: 20px;"><i class = "bi bi-check-circle-fill" ></i> </span>${name}</li>`

}
// a function to fetch the data about number of tasks completed.
function fetchalldata() {

    firebase.auth().onAuthStateChanged(function(user) {
        //var user = onAuthStateChanged.user;
        //console.log(user);
        //let user1 = user.uid;;
        if (user) {
            db.collection("users").doc(user.uid).collection("tasks").where("taskStatus", "==", "Done").get().then(function(snap) {
                snap.forEach(function(doc) {
                    let name = doc.data().name;
                    console.log("element created");
                    //let status = doc.data().taskStatus;
                    addItemsToList(name);
                });
            });
        }

    })

}
fetchalldata();
// a function to fetch the data from the firebase to make the pie chart of number of tasks completed, uncompleted or partially completed.
function chartMyData1() {
    var labels = []; //insert task names here
    var values = [];
    var values2 = []; //insert timespent values here

    //read data from Firestore
    firebase.auth().onAuthStateChanged(function(user) {
        //var user = authResult.user;
        if (user) {
            // User is signed in.
            db.collection("pieChart")
                .get()
                .then(function(snap) {
                    snap.forEach(function(doc) {
                        //console.log(doc.data()); //just to check
                        const y = doc.data().partially;
                        let x = doc.data().undone;
                        let z = doc.data().taskdone

                        values.push(y);
                        labels.push(x);
                        values2.push(z);
                        //console.log(labels);
                        //console.log(values);
                    })
                    displayGraph1(values, labels, values2);
                });
        } else {
            // No user signed in. 
        }
        // })
    })
}
// a function to display the pie chart.
chartMyData1();

function displayGraph1(xlabels, ylabels, zlabels) {
    var grapharea = document.getElementById('myChart1');
    //assemble data and launch chart
    const data1 = {
        labels: ['completed', 'partiallycompleted', 'notcompleted'],
        datasets: [{
            label: 'Task Status',
            data: [xlabels, ylabels, zlabels],
            backgroundColor: [
                'rgb(154,205,50)',
                'rgb(218,165,32)',
                'rgb(255,69,0)'
            ],
            hoverOffset: 4
        }]
    };
    const config1 = {
        type: 'pie',
        data: data1,
        option: {},
    };
    const myChart1 = new Chart(grapharea, config1);
}