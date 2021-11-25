const taskContainer = document.getElementById("task-container");

updateTaskList();

function addTask() {

    let name = document.getElementById("task-name-choice").value;
    let date = document.getElementById("task-date-choice").value;
    let status = document.getElementById("task-status-choice").value;
    let length = document.getElementById("task-length-choice").value;

    if (isTaskInfoValid(name, date, status, length)) {
        uploadTask(name, date, status, length);
    } else { 
        console.log("That is not a valid task!");
    }
}

function wipeTaskInputFields() {
    document.querySelector("#task-name-choice").value = "";
    document.querySelector("#task-date-choice").value = "";
    document.querySelector("#task-length-choice").value = "";
    document.querySelector("#task-status-choice").value = "";
}

function uploadTask(name, date, status, length) {
    addTaskDataToFirebase(name, date, status, length);
    clearTaskListFromScreen();
    updateTaskList();
}

function addTaskToScreen(name, date, status, length, id) {

    fetch("task.xml").then(response => response.text()).then(data => {
        let currentTasks = Array.from(taskContainer.children);

        // append the xml string to the innerHTML of taskContainer to turn it into an element
        taskContainer.innerHTML = data;

        // get the xml data from task container
        let currentTask = taskContainer.firstElementChild;

        // remove the xml data from the task container
        taskContainer.removeChild(currentTask);

        // set the title of the task 
        currentTask.children[0].children[0].children[0].textContent = name;

        // add the information
        currentTask.children[0].children[1].children[0].textContent += date;
        currentTask.children[0].children[1].children[1].textContent += status;
        currentTask.children[0].children[1].children[2].textContent += length;
        currentTask.setAttribute("id", id);

        TODO: // cannot figure out how to get the time stamp in a form of a number, ask for help
        console.log("current time stamp: " + firebase.firestore.FieldValue.serverTimestamp());
        currentTask.setAttribute("timeCreated", firebase.firestore.FieldValue.serverTimestamp());

        // add the current task to the list of tasks
        currentTasks.push(currentTask);

        // add all the previous tasks back and add their button listeners
        console.log("Before sort:");
        currentTasks.forEach(task => {
            console.log(task.getAttribute("timeCreated"));
        });
        currentTasks = sortByServerTime(currentTasks);
        // currentTasks.forEach(task => {
        //     console.log(task.getAttribute("timeCreated"));
        // });
        
        currentTasks.forEach(task => {
            task.setAttribute("id", task.id);
            editButtonListener(task);
            deleteButtonListener(task);
            taskContainer.appendChild(task);
        });

    });

}

function sortByServerTime(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        for (let j = 1; j < tasks.length; j++) {
            if (tasks[i].getAttribute("timeCreated") < tasks[j].getAttribute("timeCreated")) {
                let temp = task[j];
                tasks[j] = tasks[i];
                tasks[i] = temp;
            }
        }
    }
    return tasks;
}

function addTaskDataToFirebase(name, date, status, length) {
    //put the task data into firestore database
    db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").add({
        name: name,
        dueDate: date,
        taskStatus: status,
        taskLength: length
    });

}

function isTaskInfoValid(name, date, status, length) {
    return name != "" && date != "" && status != "" && length != "";
}

function clearTaskListFromScreen() {
    const tasks = Array.from(taskContainer.children);
    if (tasks.length != 0) {
        tasks.forEach(task => taskContainer.remove(task));
        console.log("Updated home page list");
    }
}

function removeAllTasks() {
    db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").get().then(snapshot => {
        snapshot.forEach(doc => {
            doc.ref.delete();
        });
    });
    clearTaskListFromScreen();
}

function updateTaskList() {
  let currentUser = db.collection("users").doc(localStorage.getItem("userId"));
  currentUser.collection("tasks").get().then(snapshot => {
    if (snapshot.docs.length == 0) {
        taskContainer.innerHTML = "You currently have no tasks!";
    } else {
        snapshot.docs.forEach(task => {
          let name = task.data()["name"];
          let date = task.data()["dueDate"];
          let status = task.data()["taskStatus"];
          let length = task.data()["taskLength"];
          let id = task.id;
          addTaskToScreen(name, date, status, length, id);
      });
    }
  });
}

function editButtonListener(task) {
    const buttonDiv = task.children[0].children[0].children[1];
    let editButtonElement = buttonDiv.children[0];
    editButtonElement.addEventListener("click", () => {
        console.log("Clicked edit button");
        const buttonDiv = task.children[0].children[0].children[1];
        let editButtonElement = buttonDiv.children[0];
        editButtonElement.dataset.bsToggle = "modal";
        editButtonElement.dataset.bsTarget = "#task-info-modal";
        document.querySelector("#task-info-modal-title").innerText = "Edit the task by changing its features";
        const taskTitle = task.children[0].children[0].children[0].innerText;
        const taskDueDate = task.children[0].children[1].children[0].innerText.split(":")[1].trim();
        const taskStatus = task.children[0].children[1].children[1].innerText.split(":")[1].trim();
        const taskLength = task.children[0].children[1].children[2].innerText.split(":")[1].trim();
        document.querySelector("#task-name-choice").value = taskTitle;
        document.querySelector("#task-date-choice").value = taskDueDate;
        document.querySelector("#task-length-choice").value = taskLength;
        document.querySelector("#task-status-choice").value = taskStatus; 
    });
}

function deleteButtonListener(task) {
    const buttonDiv = task.children[0].children[0].children[1];
    let deleteButtonElement = buttonDiv.children[1];
    deleteButtonElement.addEventListener("click", () => {
        let taskNameFields = Array.from(document.querySelectorAll(".task-name"));
        taskNameFields.forEach(taskNameField => {
            const titleHeader = task.children[0].children[0].children[0];
            taskNameField.innerHTML = "<b>" + titleHeader.textContent + "</b>";
        });
        document.querySelectorAll(".task-name").textContent = "TEST"
        deleteButtonElement.dataset.bsToggle = "modal";
        deleteButtonElement.dataset.bsTarget = "#delete-task-modal";

        // this will be called if the user clicks on the delete task button in the modal to finish the job
        removeTask = function() {
            taskContainer.remove(task);
            db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").doc(task.getAttribute("id")).get().then(doc => {
                doc.ref.delete();
            });
        }
    });
}

// TODO (for final sprint):
// 1) v alidate the task information by using html field validation.
// 2) Sort all the tasks by recent using server time (figure out how to manage firebase timestamp, sorting is already done).
// 3) Get the task list to refresh properly when adding a new task or deleting all / one task.
// 4) Add a quote from firebase to the home page upon refresh
// 5) move the quote location to the bottom of the screen and put the delete all tasks button on the tasks list itself.