// upon loading of the page, set the tasks from firebase
updateHomePageTasks();

// toggles the dropdown menu buttons
toggleClickedButton = function(e) {
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
          return;
      }
  });
}

logNewTaskData = function() {
    // gather the task data from the user
    taskData = getTaskData();

    // put the task data into firestore database
    db.collection("tasks").add({
        name: taskData[0],
        dueDate: taskData[1],
        taskStatus: taskData[2],
        taskLength: taskData[3]
    });
    
    // write the task Data on the home page
    updateHomePageTasks();
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

function updateHomePageTasks() {
    // create a current task div and add all the task data to it
    const currentTaskDiv = document.getElementById("task-container");

    let amountOfTasks = 0; 

    db.collection("tasks").get().then( snapshot => {
        snapshot.docs.forEach(task => {
            if (task.data().taskLength != null) {
                
                amountOfTasks++;

                // add the title to the div
                const taskTitle = document.createElement("h1");
                taskTitle.innerText = task.data().name;
                currentTaskDiv.appendChild(taskTitle);

                // add the due date to the div next
                const taskDueDate = document.createElement("p");
                taskDueDate.innerText = task.data().dueDate;
                currentTaskDiv.appendChild(taskDueDate);

                // add the task length to the div next
                const taskLength = document.createElement("p");
                taskLength.innerText = task.data().taskLength;
                currentTaskDiv.appendChild(taskLength);

                // add the task status last
                const taskStatus = document.createElement("p");
                taskStatus.innerText = task.data().taskStatus;
                currentTaskDiv.appendChild(taskStatus);

                // log the details to see if there are any errors
                console.log("Task details: ");
                console.log(task.data().name);
                console.log(task.data().dueDate);
                console.log(task.data().taskLength);
                console.log(task.data().taskStatus);
            }
        });
        if (amountOfTasks == 0) {
          const noTasksDisplay = document.createElement("p");
          noTasksDisplay.innerText = "You currently have no tasks!";
          currentTaskDiv.appendChild(noTasksDisplay);
        }
    });
}