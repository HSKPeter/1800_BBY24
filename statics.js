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
        // if (user) {
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
        // }
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

function fetchalldata() {
    //let user1 = firebase.auth().currentUser.uid;
    firebase.auth().onAuthStateChanged(function(user) {
        //var user = onAuthStateChanged.user;
        //console.log(user);
        //let user1 = user.uid;;
        //if (user) {
        db.collection("users").doc(user.uid).collection("tasks").where("taskStatus", "==", "Done").get().then(function(snap) {
            snap.forEach(function(doc) {
                let name = doc.data().name;
                console.log("element created");
                //let status = doc.data().taskStatus;
                addItemsToList(name);
            });
        });


    })

}
fetchalldata();
//const data1 = {
//labels: [
//'Completed',
//'Uncompleted',
// 'Partially-Completed'
//],
//datasets: [{
//label: 'Task Status',
//data: [7, 8, 9],
//backgroundColor: [
// 'rgb(255, 99, 132)',
// 'rgb(54, 162, 235)',
//  'rgb(255, 205, 86)'
//],
//hoverOffset: 4
//}]
//};
// </block:setup>

// <block:config:0>
//const config1 = {
//type: 'pie',
//data: data1,
//};
//const myChart1 = new Chart(
//document.getElementById('myChart1'),
//config1
//);
// </block:config>
function chartMyData1() {
    var labels = []; //insert task names here
    var values = [];
    var values2 = []; //insert timespent values here

    //read data from Firestore
    firebase.auth().onAuthStateChanged(function(user) {
        //var user = authResult.user;
        if (user) {
            // User is signed in.
            db.collection("pieChart") //.where("size", "==", "L") //search by "L"arge size
                //.orderBy("end_date") //sort by completion date
                .get()
                .then(function(snap) {
                    snap.forEach(function(doc) {
                        //console.log(doc.data()); //just to check
                        const y = doc.data().partially; //y-axis
                        let x = doc.data().undone; //x-axis
                        let z = doc.data().taskdone
                            //let yHours = yMilis * 2.778E-07 * 100;
                        values.push(y); //timespent display on y
                        labels.push(x); //nickname display on x
                        values2.push(z);
                        //console.log(labels);
                        //console.log(values);
                    })
                    displayGraph1(values, labels, values2);
                });
            //} //else {
            // No user signed in. 
        }
        // })
    })
}
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