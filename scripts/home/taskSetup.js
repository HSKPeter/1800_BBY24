// the div containing all the tasks
const taskContainer = document.getElementById("task-container");
const overlay = document.getElementById('overlay');

// upon loading of the page, update the tasks list
clearTaskListFromScreen();
updateTaskList();

// toggles the dropdown menu buttons
function toggleClickedButton(e) {
    let buttonClicked = e.firstElementChild;
    let dropDownButtons = e.parentElement;
    let buttons = Array.from(dropDownButtons.children);

    // remove the current active button
    buttons.forEach(element => {
        if (element.firstElementChild.classList.contains("active")) {
            element.firstElementChild.classList.remove("active");
            return;
        }
    });

    // add the activeness to the button clicked.
    buttons.forEach(element => {
        if (element.firstElementChild === buttonClicked) {
            element.firstElementChild.classList.add("active");
            console.log("found the button it should be set to!");
            return;
        }
    });
}

function logNewTaskData() {
    clearTaskListFromScreen();
    
    // gather the task data from the user
    taskData = getTaskData();

    //put the task data into firestore database
    db.collection("tasks").add({
        name: taskData[0],
        dueDate: taskData[1],
        taskStatus: taskData[2],
        taskLength: taskData[3]
    });

    updateTaskList();
    window.location.reload(true);
}

function getTaskData() {
    const taskName = document.getElementById("task-name").value;
    const taskDueDate = document.getElementById("task-due-date").value;

    const taskStatus = document.querySelector("#status-dropdown-buttons");
    const taskStatusChildren = Array.from(taskStatus.children);
    let taskStatusChoice = "dummytext";

    taskStatusChildren.forEach(element => {
        if (element.children[0].classList.contains("active")) {
            taskStatusChoice = element.children[0];  
            return;
        }
    });

    const taskLength = document.querySelector("#length-dropdown-buttons");
    const taskLengthChildren = Array.from(taskLength.children);
    let taskLengthChoice = "dummytext";

    taskLengthChildren.forEach(element => {
        if (element.children[0].classList.contains("active")) {
            taskLengthChoice = element.children[0];
            return;
        }
    });

    taskData = [];
    taskData.push(taskName);
    taskData.push(taskDueDate);
    taskData.push(taskStatusChoice.textContent);
    taskData.push(taskLengthChoice.textContent);
    return taskData;
}

function updateTaskList() {
    let amountOfTasks = 0;
    
    db.collection("tasks").get().then(snapshot => {
        snapshot.docs.forEach(task => {
            if (task.data().taskLength != null) {
                amountOfTasks++;

                // create a sub div for the current task
                taskDiv = document.createElement("div");
                taskDiv.classList.add("task");

                // add the title to the sub div
                const taskTitle = document.createElement("h1");
                taskTitle.innerText = task.data().name;
                taskDiv.appendChild(taskTitle);

                // add the due date to the div next
                const taskDueDate = document.createElement("p");
                taskDueDate.innerText = "Task Due Date:\t" + task.data().dueDate;
                taskDiv.appendChild(taskDueDate);

                // add the task length to the div next
                const taskLength = document.createElement("p");
                taskLength.innerText = "Task Length:\t" + task.data().taskLength;
                taskDiv.appendChild(taskLength);

                // add the task status last
                const taskStatus = document.createElement("p");
                taskStatus.innerText = "Task Status:\t" + task.data().taskStatus;
                taskDiv.appendChild(taskStatus);

                // add the edit onclickevent to the task and then add as a sub div to the task container
                taskContainer.appendChild(taskDiv);
            }
        });
        if (amountOfTasks == 0) {
          const noTasksDisplay = document.createElement("p");
          noTasksDisplay.innerText = "You currently have no tasks!";
          noTasksDisplay.style.fontSize = "200%";
          noTasksDisplay.style.textAlign = "center";
          noTasksDisplay.style.fontWeight = "bolder";
          taskContainer.appendChild(noTasksDisplay);
        }

        // add the edit event listener to all the tasks after they are done loading
        initTasksForEditing();
    });
}

function initTasksForEditing() { // assign the task data to blank when the user cancels as well
    tasks = Array.from(taskContainer.children);
    if (tasks != null) {
        tasks.forEach(task => {
            console.log(task);
            task.dataset.bsToggle = "modal";
            task.dataset.bsTarget = "#task-modal";
            task.addEventListener("click", () => {
                // fill in the original title for upon editing of a task
                document.getElementById("task-name").value = task.children[0].innerText; 

                // fill in the current date of the task upon editing
                const dateInfo = task.children[1].innerText.split(":");
                document.getElementById("task-due-date").defaultValue = dateInfo[1].trim();

                // toggle the clicked button for the current tasks status upon editing
                statusButtonsList = Array.from(document.getElementById("status-dropdown-buttons").children);
                statusButtonsList.forEach(element => {
                    element.firstElementChild.classList.remove("active");
                });
                const statusInfo = task.children[3].innerText.split(":");
                console.log(statusInfo[1].trim());
                console.log(statusButtonsList[2].firstElementChild.innerText);
                statusButtonsList.forEach(element => {
                    if (element.firstElementChild.innerText === statusInfo[1].trim()) {
                        // add the active class to this element
                        element.firstElementChild.classList.add("active");
                    }
                });

                //toggleClickedButton(task.children[2]);
                statusButtonsList = Array.from(document.getElementById("length-dropdown-buttons").children);
                statusButtonsList.forEach(element => {
                    element.firstElementChild.classList.remove("active");
                });
                const lengthInfo = task.children[2].innerText.split(":");
                console.log(lengthInfo[1].trim());
                console.log(statusButtonsList[3].firstElementChild.innerText);
                statusButtonsList.forEach(element => {
                    if (element.firstElementChild.innerText === lengthInfo[1].trim()) {
                        // add the active class to this element
                        element.firstElementChild.classList.add("active");
                    }
                });

                // change title to fill the theme for editing
                let title = document.querySelector(".modal-title");
                title.innerText = "Change the value(s) for your task";
            });
        });
    }
}

function removeEditPlaceholderData() {
    document.getElementById("task-name").value = "";
    document.getElementById("task-due-date").defaultValue = "";
    
    statusDropDownButton = document.getElementById("status-drop-down-button-1");
    toggleClickedButton(statusDropDownButton);

    lengthDropDownButton = document.getElementById("length-drop-down-b1");
    toggleClickedButton(lengthDropDownButton);

    let title = document.querySelector(".modal-title");
    title.innerText = "Please fill all the information";
}

function clearTaskListFromScreen() {
    const tasks = Array.from(taskContainer.children);
    if (tasks.length != 0) {
        tasks.forEach(task => taskContainer.remove(task));
        console.log("Updated home page list");
    }
}

function removeAllTasksFromDB() {
    db.collection("tasks").get().then(snapshot => {
            snapshot.docs.forEach(task => {
            console.log("removed a task.");
            batch.delete(task.ref);
        });
        clearTaskListFromScreen();
        return batch.commit();
    });
}

// TODO: 
// 1: get the tasks to be displayed in order recent-oldest
// 2: implement the daily quotes
// 3: style better