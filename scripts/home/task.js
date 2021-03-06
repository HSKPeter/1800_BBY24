const taskContainer = document.getElementById("task-container");

updateTaskList();


/**
 * This function gets all the data from the fields once the user has clicked the button to add a task. It
 * then checks to see if the information is valid and then uploads the task. (the 'isValid' check may not be
 * nessesary once we add the input validation in html)
 */
function addTask() {
    const taskID = document.querySelector("#submitTaskToFirebase").dataset.taskid;
    let name = document.getElementById("task-name-choice").value;
    let date = document.getElementById("task-date-choice").value;
    let status = document.getElementById("task-status-choice").value;
    let length = document.getElementById("task-length-choice").value;

    if (isTaskInfoValid(name, date, status, length)) {
        uploadTask(name, date, status, length, taskID);
    } else {
        console.log("That is not a valid task!");
    }
}

/**
 * This function wipes all the task fields (used upon clicking the button to create a new task)
 */
function wipeTaskInputFields() {
    document.querySelector("#task-info-modal-title").innerText = "Create New Task";
    document.querySelector("#task-name-choice").value = "";
    document.querySelector("#task-date-choice").value = "";
    document.querySelector("#task-length-choice").value = "";
    document.querySelector("#task-status-choice").value = "Pending";
}

/**
 * This function uploads the data to firebase and the task container
 * 
 * @param name uploaded to firebase and task container
 * @param date uploaded to firebase and task container
 * @param status uploaded to firebase and task container
 * @param length uploaded to firebase and task container
 */
async function uploadTask(name, date, status, length, taskID) {
    await addTaskDataToFirebase(name, date, status, length, taskID);
    clearTaskListFromScreen();
    updateTaskList();
}

/**
 * This function creates a new task from the xml file 'task.xml'. It starts by obtaining all the tasks
 * currently in the task container and putting them temporarily in an array. All the tasks are then
 * deleted from the task container and the xml information gathered as a string is appended to. The xml information  * now functions as the only current child element inside of the task container which we can work with to add the
 * task information with the DOM. After adding all the information to the task, The current time is added as an   *attribute. The task (child element) is added to the list of the other temporary tasks list obtained from the task *container. The task (child element) is then removed from the task container making it completely empty again. The *list is then sorted using the time attributes added and then each task in the list is added back to the task *container which will be in order from newest to oldest.
 * 
 * @param name set as the task name on the xml snippet
 * @param date set as the task due date on the xml snippet
 * @param status set as the task status on the xml snippet 
 * @param length set as the task length on the xml snippet
 * @param id set as the task id set on the task snippet
 */
function addTaskToScreen(name, date, status, length, id) {
    taskContainer.innerHTML = "";
    fetch("utilities/task.xml").then(response => response.text()).then(data => {
        let currentTasks = Array.from(taskContainer.children);

        // append the xml string to the innerHTML of taskContainer to turn it into an element
        taskContainer.innerHTML = data;

        // get the xml data from task container
        let currentTask = taskContainer.firstElementChild;

        // set the title of the task 
        currentTask.children[0].children[0].children[0].textContent = name;

        // add the information
        currentTask.children[0].children[1].children[0].textContent += date;
        currentTask.children[0].children[1].children[1].textContent += status;
        currentTask.children[0].children[1].children[2].textContent += length;

        currentTask.setAttribute("timecreated", firebase.firestore.FieldValue.serverTimestamp());
        console.log(currentTask.getAttribute("timecreated").value);
        currentTask.setAttribute('data-taskId', id);

        // add the current task to the list of tasks
        currentTasks.push(currentTask);

        // remove the xml data from the task container
        taskContainer.removeChild(currentTask);

        // add all the previous tasks back and add their button listeners
        console.log("Before sort:");
        currentTasks.forEach(task => {
            console.log(task);
        });
        console.log("After sort:");
        //currentTasks = sortByServerTime(currentTasks);
        currentTasks.forEach(task => {
            console.log(task);
        });

        currentTasks.forEach(task => {
            editButtonListener(task);
            deleteButtonListener(task);
            taskContainer.appendChild(task);
        });

    });

}

/**
 * This function tasks in the tasks list and sorts it using a simple selection sort. (note that all functions pass by * value in js meaning that there will be no alias for objects, so we have to return the new sorted list)
 * 
 * @param tasks sorted 
 * @returns tasks sorted from most recent to oldest
 */
function sortByServerTime(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        let min = tasks[i];
        for (let j = 1; j < tasks.length; j++) {
            if (tasks[i].getAttribute("timecreated") > tasks[j].getAttribute("timecreated")) {
                min = j;
            }
        }
        // swap the current with the minimum item found
        let temp = tasks[min];
        tasks[min] = tasks[i];
        tasks[i] = temp;
    }
    return tasks;
}

async function addTaskDataToFirebase(name, date, status, length, taskID) {
    //put the task data into firestore database (needs to be changed so that duplicate data isn't always added when editing a task)
    if (taskID){
        await db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").doc(taskID).update({
            name: name,
            dueDate: date,
            taskStatus: status,
            taskLength: length,    
        });
    } else {
        await db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").add({
            name: name,
            dueDate: date,
            taskStatus: status,
            taskLength: length,
            timeSpent: 0
        });
    }
}

function isTaskInfoValid(name, date, status, length) {
    return name != "" && date != "" && status != "" && length != "";
}

function clearTaskListFromScreen() {
    taskContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center h-100">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `;
}

function removeAllTasks() {
    db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").get().then(async (snapshot) => {
        clearTaskListFromScreen();
        snapshot.forEach(async (doc) => {
            await doc.ref.delete();
        });        
        updateTaskList();
    });

}

/**
 * Updates the task container by grabbing each task data from firebase and adding them to the task list
 */
function updateTaskList() {
    let currentUser = db.collection("users").doc(localStorage.getItem("userId"));
    currentUser.collection("tasks").get().then(snapshot => {
        const uncompletedTasks = snapshot.docs.filter(isUncompletedTask)
        if (uncompletedTasks.length == 0) {
            taskContainer.innerHTML = "You currently have no tasks!";
        } else {
            console.log(uncompletedTasks)
            uncompletedTasks.sort(sortTasks).forEach(task => {
                console.log(task.data())
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

/** Identify if the task has been done or not. */
function isUncompletedTask(task){
    return task.data()["taskStatus"] !== "Done";
}

function editButtonListener(task) {
    console.log("task")
    console.log(task)
    const buttonDiv = task.children[0].children[0].children[1];
    let editButtonElement = buttonDiv.children[0];
    editButtonElement.addEventListener("click", () => {
        console.log("Clicked edit button");
        document.querySelector("#task-info-modal-title").innerText = "Edit the task by changing its features";
        const taskTitle = task.children[0].children[0].children[0].innerText;
        const taskDueDate = task.children[0].children[1].children[0].innerText.split(":")[1].trim();
        const taskStatus = task.children[0].children[1].children[1].innerText.split(":")[1].trim();
        const taskLength = task.children[0].children[1].children[2].innerText.split(":")[1].trim();
        document.querySelector("#task-name-choice").value = taskTitle;
        document.querySelector("#task-date-choice").value = taskDueDate;
        document.querySelector("#task-length-choice").value = taskLength;
        document.querySelector("#task-status-choice").value = taskStatus;

        document.querySelector("#submitTaskToFirebase").setAttribute("data-taskid", task.getAttribute("data-taskid"));
        document.querySelector("#submitTaskToFirebase").textContent = "Edit";
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
        document.querySelectorAll(".task-name").textContent = "TEST";

        // this will be called if the user clicks on the delete task button in the modal
        removeTask = async function () {
            clearTaskListFromScreen();
            await db.collection("users").doc(localStorage.getItem("userId")).collection("tasks").doc(task.getAttribute('data-taskId')).delete();
            updateTaskList();
        }
    });
}

// This function I am currently working on to upload quotes to firebase (leave this to Clayton)
async function loadQuotesToFirebase() {
    let fileContent = await fetch("../../utilities/quotes.txt");
    let fileText = await fileContent.text();
    let quotes = fileText.split("\n");
    for (let i = 0; i < quotes.length; i++) {
        console.log("Quote #" + i + quotes[i]);
    }
}