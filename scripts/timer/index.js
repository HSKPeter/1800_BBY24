/**
 * The Timer class would manage data variables that are needed to operate the timer.
 */
class Timer {
    #intervalID;
    #sessionLength;
    #millisecondsLeft;
    #isPlayingMusic;
    #taskID;

    /**
     * Construct the Timer instance.
     */
    constructor() {
        // Background music would be played by default.
        this.#isPlayingMusic = true;
    };

    /**
     * Mutator of interval ID.
     * @param {number} id 
     */
    setIntervalID(id) {
        this.#intervalID = id;
    }

    /**
     * Accessor of interval ID.
     * @returns {number}
     */
    getIntervalID() {
        return this.#intervalID;
    }

    /**
     * Mutator of task ID.
     * @param {string} id 
     */
    setTaskID(id) {
        this.#taskID = id;
    }

    /**
     * Accessor of task ID.
     * @returns {string}
     */
    getTaskID() {
        return this.#taskID;
    }

    /**
     * Mutator of the length of the countdown session. 
     * @param {number} sessionLength 
     */
    setSessionLength(sessionLength) {
        this.#sessionLength = sessionLength;
    }

    /**
     * Accessor of the length of the countdown session.
     * @returns {number}
     */
    getSessionLength() {
        return this.#sessionLength;
    }

    /**
     * Mutator of the value of the remaining milliseconds.
     * @param {number} ms 
     */
    setMillisecondsLeft(ms) {
        setMsInFirebase(ms);
        this.#millisecondsLeft = ms;
    }

    /**
     * Accessor of the value of the remaining milliseconds.
     * @returns {number}
     */
    getMillisecondsLeft() {
        return this.#millisecondsLeft
    }

    /**
     * Initialize and display the timer in the HTML page.
     * @returns 
     */
    init() {
        if (document.querySelector('select').value === '') {
            alert("Please choose a task in the dropdown menu.")
            return;
        }

        const dropdownMenu = document.querySelector('#selectExistingTasks')
        const taskName = dropdownMenu.options[dropdownMenu.selectedIndex].textContent
        const taskID = dropdownMenu.value;

        timerInstance.setTaskID(taskID);

        document.querySelector("#task").innerHTML = `
        <strong>
        <div class="d-flex flex-column">
        <div>Task of this Flocus session:</div>
        <div>${taskName}</div>
        </div>
        </strong>
        `;
        document.querySelector("#startFlocus").style.display = "none";
        document.querySelector("#music").style.display = "block";
        document.querySelector("#backgroundMusic").play();
        document.querySelector("#pauseFlocus").style.display = "block";
        document.querySelector("#stopFlocus").style.display = "block";

        document.querySelector("#minute").textContent = document.querySelector("#minuteInput").value;
        document.querySelector("#second").textContent = document.querySelector("#secondInput").value;

        const startTime = new Date();
        const endTime = startCountDown(startTime);
        let minute = parseInt(document.querySelector("#minute").textContent);
        let second = parseInt(document.querySelector("#second").textContent);
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + ((1000 / (endTime - startTime)) * 360) + "deg)";
        if (second === 0) {
            minute--;
            second = 59;
        } else {
            second--;
        }
        document.querySelector("#minute").textContent = formatNumbers(minute);
        document.querySelector("#second").textContent = formatNumbers(second);
        const intervalId = updateTimer(startTime, endTime, 1000);
        timerInstance.setIntervalID(intervalId);

        updateFirebase({ startTime, endTime }, { taskName, taskID });
    }

    /**
     * Pause the timer.
     */
    pause() {
        document.querySelector("#pauseFlocus").style.display = "none";
        document.querySelector("#stopFlocus").style.display = "none";
        document.querySelector("#music").style.display = "none";
        document.querySelector("#resumeFlocus").style.display = "block";
        clearInterval(this.#intervalID);
        document.querySelector("#backgroundMusic").pause();
    }

    /**
     * Stop the timer.
     */
    stop() {
        clearInterval(this.#intervalID);
        document.querySelector("#backgroundMusic").pause();
    }

    /**
     * Resume the timer.
     */
    resume() {
        document.querySelector("#pauseFlocus").style.display = "block";
        document.querySelector("#stopFlocus").style.display = "block";
        document.querySelector("#music").style.display = "block";
        document.querySelector("#resumeFlocus").style.display = "none";

        document.querySelector("#backgroundMusic").play();

        const endTime = new Date();
        endTime.setMilliseconds(endTime.getMilliseconds() + timerInstance.getMillisecondsLeft());
        const startTime = endTime - timerInstance.getSessionLength();
        const intervalId = updateTimer(startTime, endTime, 1000);
        timerInstance.setIntervalID(intervalId);
    }

    /**
     * Change settings of the background music (i.e. mute / unmute).
     */
    changeMusicSetting() {
        if (this.#isPlayingMusic === true) {
            document.querySelector("#music").dataset.music = 'off';
            document.querySelector("#music").innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
            document.querySelector('audio').muted = true;
        } else {
            document.querySelector("#music").dataset.music = 'on';
            document.querySelector("#music").innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            document.querySelector('audio').play();
            document.querySelector('audio').muted = false;
        }
        this.#isPlayingMusic = !this.#isPlayingMusic;
    }

}

// Instantiate an instance of the Timer class
const timerInstance = new Timer();

(async() => {
    const sessionDetailsFromFirebase = await getSessionStatusFromFirebase();
    if (sessionDetailsFromFirebase) {
        const { taskName, msLeft, estimatedSessionLength, taskID } = sessionDetailsFromFirebase;
        const endTime = new Date();
        timerInstance.setMillisecondsLeft(msLeft);
        timerInstance.setSessionLength(estimatedSessionLength);
        endTime.setMilliseconds(endTime.getMilliseconds() + timerInstance.getMillisecondsLeft());
        const startTime = endTime - timerInstance.getSessionLength();
        timerInstance.setTaskID(taskID);

        const current = new Date().getTime();
        const difference = endTime - current;
        document.querySelector("#timeSetting").style.display = "block"
        updateProgressBar(startTime, endTime)

        if (difference <= 1000) {
            const modalOfSessionCompletion = new bootstrap.Modal(document.getElementById('completeSessionModal'))
            document.querySelector("#minute").textContent = "00";
            document.querySelector("#second").textContent = "00";
            modalOfSessionCompletion.show();
        } else {
            document.querySelector("#resumeFlocus").style.display = "block";
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            document.querySelector("#minute").textContent = formatNumbers(minutes);
            document.querySelector("#second").textContent = formatNumbers(seconds);
        }

        document.querySelector("#task").innerHTML = `
        <strong>
        <div class="d-flex flex-column">
        <div>Task of this Flocus session:</div>
        <div>${taskName}</div>
        </div>
        </strong>
        `;
        document.querySelector("#startFlocus").style.display = "none";
        document.querySelector("#pauseFlocus").style.display = "none";
        document.querySelector("#stopFlocus").style.display = "none";
        document.querySelector("#music").style.display = "none";
        document.querySelector("#timeSetting").style.display = "block"
    } else {
        const taskDetailsFromFirebase = await getTasksFromFirebase();
        console.log(taskDetailsFromFirebase)
        taskDetailsFromFirebase.forEach(task => {
            document.querySelector('#selectExistingTasks').innerHTML += `
            <option value="${task.id}">${task.name}</option>\n          
            `
        })
        document.querySelector("#timeSetting").style.display = "block"
        document.querySelector("#startFlocus").style.display = "block"
        document.querySelector("#selectExistingTasks").style.display = "block"
        document.querySelector("#startFlocus").addEventListener("click", () => { timerInstance.init() })
        document.querySelector("#timeSetting").addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                timerInstance.init();
            }
        });
        document.querySelectorAll("input").forEach(inputField => inputField.addEventListener("change", () => {
            inputField.value = formatNumbers(inputField.value);
        }))
    }
})();

document.querySelector("#music").addEventListener("click", () => { timerInstance.changeMusicSetting() });

document.querySelector("#pauseFlocus").addEventListener("click", () => { timerInstance.pause() })
document.querySelector("#resumeFlocus").addEventListener("click", () => { timerInstance.resume() })

document.querySelectorAll('.resumeCountDown').forEach(element => element.addEventListener('click', () => { timerInstance.resume() }));
document.querySelectorAll('.pauseCountDown').forEach(element => element.addEventListener('click', () => {
    timerInstance.stop();
}));

/* A modal would be prompted when a countdown session is ended.  
Users would be asked whether they have completed the particular task within that countdown session.  
The "yes" and "no" buttons in this modal share the class "updateTaskProgress". */
document.querySelectorAll(".updateTaskProgress").forEach(inputField => inputField.addEventListener("click", () => {
    document.querySelector("#notification").pause();
}))

document.querySelector("#confirmedQuitSession").addEventListener('click', () => {
    deactivateSessionInFirebase()
})

document.querySelector("#confirmedEndSessionEarly").addEventListener('click', () => {
    updateTaskCompletionStatus(true, timerInstance.getMillisecondsLeft(), timerInstance.getTaskID());
})

document.querySelector("#taskCompleted").addEventListener('click', () => {
    updateTaskCompletionStatus(true, 0, timerInstance.getTaskID());
})

document.querySelector("#taskNotCompleted").addEventListener('click', () => {
    updateTaskCompletionStatus(false, 0, timerInstance.getTaskID());
})