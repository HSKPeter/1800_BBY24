// define the task information indecies for easier readability
const NAME_INDEX = 0;
const DATE_INDEX = 1;
const STATUS_INDEX = 2;
const LENGTH_INDEX = 3;

// the div containing all the tasks
const taskContainer = document.getElementById("task-container");

// upon loading of the page, update the tasks list
clearTaskListFromScreen();
updateTaskList();

// toggles the dropdown menu buttons
function toggleClickedButton(e) {
    let buttonClicked = e.firstElementChild;
    let dropDownButtons = e.parentElement;
    let buttons = Array.from(dropDownButtons.children);

    // remove the current active button
    unToggleActiveButtons(buttons);

    // add the activeness to the button clicked.
    buttons.forEach(element => {
        if (element.firstElementChild === buttonClicked) {
            element.firstElementChild.classList.add("active");
            console.log("found the button it should be set to!");
            return;
        }
    });
}

function unToggleActiveButtons(buttons) {
    buttons.forEach(element => {
        if (element.firstElementChild.classList.contains("active")) {
            element.firstElementChild.classList.remove("active");
        }
    });
}

function logNewTaskData() {
    // gather the task data from the user
    taskData = getTaskData();

    //check if the task info is valid and add the task or direct the user to reenter 
    if (isValid(taskData)) {
        //put the task data into firestore database
        db.collection("tasks").add({
            name: taskData[NAME_INDEX].value,
            dueDate: taskData[DATE_INDEX].value,
            taskStatus: taskData[STATUS_INDEX].textContent,
            taskLength: taskData[LENGTH_INDEX].textContent
        }).then(docRef => {
            console.log(docRef.id);
        });
        // clear the list and refresh
        clearTaskListFromScreen();
        updateTaskList();
    } else {
        // inform the users of non filled in fields
        let invalidInputs = getInvalidInputs(taskData);
        console.log("failed to create a task!");
        setInputValidation(invalidInputs);
        return false;
    }

}

function setInputValidation(invalidInputs) {
    invalidInputs.forEach(input => {
        input.classList.add("invalid-input");
    });
    let title = document.querySelector(".modal-title");
    title.innerText = "Please fill in all the inputs";
}

function getTaskData() {
    const taskName = document.getElementById("task-name");
    const taskDueDate = document.getElementById("task-due-date");

    const taskStatus = document.querySelector("#status-dropdown-buttons");
    const taskStatusChildren = Array.from(taskStatus.children);
    let taskStatusChoice = null;

    taskStatusChildren.forEach(element => {
        if (element.children[0].classList.contains("active")) {
            taskStatusChoice = element.children[0];  
            return;
        }
    });

    const taskLength = document.querySelector("#length-dropdown-buttons");
    const taskLengthChildren = Array.from(taskLength.children);
    let taskLengthChoice = null;

    taskLengthChildren.forEach(element => {
        if (element.children[0].classList.contains("active")) {
            taskLengthChoice = element.children[0];
            return;
        }
    });

    taskData = [];
    taskData.push(taskName);
    taskData.push(taskDueDate);
    taskData.push(taskStatusChoice);
    taskData.push(taskLengthChoice);
    return taskData;
}

function hasActiveButton(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].children[0].classList.contains("active")) {
            return true;
        }
    }
    return false;
}

function updateTaskList() {
    let amountOfTasks = 0;
    let updatedTasks = [];
    
    db.collection("tasks").get().then(snapshot => {
        snapshot.docs.forEach(task => {
            let id = task.id;
            if (id != null) {
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

                // add the id to the task for editing later
                taskDiv.setAttribute("taskid", id);
                // add the current date for the task to sort by recent later
                let currentDate = new Date();
                let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
                taskDiv.setAttribute("time", time);

                updatedTasks.push(taskDiv);
            }
        });
        sortTasksByDate(updatedTasks);

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

function sortTasksByDate(list) {
    // TODO: change this function to sort the tasks by date
    for(task of list) {
        taskContainer.appendChild(task);
    }
}

function isValid(inputs) {
    return inputs[NAME_INDEX].value != null && inputs[DATE_INDEX] != null && inputs[STATUS_INDEX] != null && inputs[LENGTH_INDEX] != null;
}

function getInvalidInputs(inputs) {
    let invalidInputs = [];
    if (inputs[NAME_INDEX].value == "") {
        invalidInputs.push(document.getElementById("task-name"));
    }
    if (inputs[DATE_INDEX].value == "") {
        invalidInputs.push(document.getElementById("task-due-date"));
    }
    if (inputs[STATUS_INDEX] == null) {
        invalidInputs.push(document.getElementById("status-drop-down-button"));
    }
    if (inputs[LENGTH_INDEX] == null) {
        invalidInputs.push(document.getElementById("drop-down-length"));
    }
    return invalidInputs;
}

function initTasksForEditing() { // assign the task data to blank when the user cancels as well
    tasks = Array.from(taskContainer.children);
    firstTaskElement = tasks[0];
    if (tasks != null && firstTaskElement.textContent !== "You currently have no tasks!") {
        tasks.forEach(task => {
            console.log(task);
            task.dataset.bsToggle = "modal";
            task.dataset.bsTarget = "#task-modal";
            task.addEventListener("click", () => {
                fillInputsWithTaskData();

                // change title to fill the theme for editing
                let title = document.querySelector(".modal-title");
                title.innerText = "Change the value(s) for your task";
            });

            // add the input validation visuals
            document.getElementById("task-name").addEventListener("click", () => {
                if (document.getElementById("task-name").value != "") {
                    document.getElementById("task-name").classList.remove("invalid-input"); 
                } else {
                    document.getElementById("task-name").classList.add("invalid-input");
                }
            });
            document.getElementById("task-due-date").addEventListener("click", () => {
                if (document.getElementById("task-due-date").value != "") {
                    document.getElementById("task-due-date").classList.remove("invalid-input");
                } else {
                    document.getElementById("task-due-date").classList.add("invalid-input");
                }
            });
            document.getElementById("status-drop-down-button").addEventListener("click", () => {
                if (hasActiveButton(Array.from(document.getElementById                    ("status-drop-down-button").children))) {
                    document.getElementById("status-drop-down-button").classList.remove("invalid-input");
                } else {
                    document.getElementById("status-drop-down-button").classList.add("invalid-input");
                }
            });
            document.getElementById("drop-down-length").addEventListener("click", () => {
                if (hasActiveButton(Array.from(document.getElementById                    ("status-drop-down-button").children))) {
                    document.getElementById("drop-down-length").classList.remove("invalid-input");
                } else {
                    document.getElementById("drop-down-length").classList.add("invalid-input");
                }
            });
            
        });
    }
}

function fillInputsWithTaskData() {
    // fill in the original title for upon editing of a task
    document.getElementById("task-name").value = task.children[0].innerText; 

    // fill in the current date of the task upon editing
    const dateInfo = task.children[DATE_INDEX].innerText.split(":");
    document.getElementById("task-due-date").defaultValue = dateInfo[DATE_INDEX].trim();

    // toggle the clicked button for the current tasks status upon editing
    const statusButtonsList = Array.from(document.getElementById("status-dropdown-buttons").children);
    statusButtonsList.forEach(element => {
        element.firstElementChild.classList.remove("active");
    });
    const statusInfo = task.children[LENGTH_INDEX].innerText.split(":");
    console.log(statusInfo[1].trim());
    console.log(statusButtonsList[2].firstElementChild.innerText);
    statusButtonsList.forEach(element => {
        if (element.firstElementChild.innerText === statusInfo[1].trim()) {
            // add the active class to this element
            element.firstElementChild.classList.add("active");
        }
    });

    const lengthButtonsList = Array.from(document.getElementById("length-dropdown-buttons").children);
    lengthButtonsList.forEach(element => {
        element.firstElementChild.classList.remove("active");
    });
    const lengthInfo = task.children[STATUS_INDEX].innerText.split(":");
    console.log(lengthInfo[1].trim());
    console.log(lengthButtonsList[3].firstElementChild.innerText);
    lengthButtonsList.forEach(element => {
        if (element.firstElementChild.innerText === lengthInfo[1].trim()) {
            // add the active class to this element
            element.firstElementChild.classList.add("active");
        }
    });
}

function removeEditPlaceholderData() {
    // remove button auto fill from editing tasks
    document.getElementById("task-name").value = "";
    document.getElementById("task-due-date").defaultValue = "";
    unToggleActiveButtons(Array.from(document.getElementById("length-dropdown-buttons").children));
    unToggleActiveButtons(Array.from(document.getElementById("status-dropdown-buttons").children));

    // customize the title to suit creating a new task
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

// I CAN DO
// 1: get the tasks to be displayed in order recent-oldest
// 2: implement daily quotes
// 3: style better

// NEED HELP
// 3: implement input validation
// 4: fixing bugs (input validation, showing the updated list)