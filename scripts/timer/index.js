class Timer {
    #intervalID;
    #sessionLength;
    #millisecondsLeft;
    #isPlayingMusic;

    constructor() {
        this.#isPlayingMusic = true;
    };

    setIntervalID(id) {
        this.#intervalID = id;
    }

    getIntervalID() {
        return this.#intervalID;
    }

    setSessionLength(sessionLength) {
        this.#sessionLength = sessionLength;
    }

    getSessionLength() {
        return this.#sessionLength;
    }

    setMillisecondsLeft(ms) {
        setMsInFirebase(ms);
        this.#millisecondsLeft = ms;
    }

    getMillisecondsLeft() {
        return this.#millisecondsLeft
    }

    init() {
        if (document.querySelector('select').value === '') {
            alert("Please choose a task in the dropdown menu.")
            return;
        }
        const taskName = document.querySelector('#selectExistingTasks').value;

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

        updateFirebase({ startTime, endTime }, taskName);
    }

    pause() {
        document.querySelector("#pauseFlocus").style.display = "none";
        document.querySelector("#stopFlocus").style.display = "none";
        document.querySelector("#music").style.display = "none";
        document.querySelector("#resumeFlocus").style.display = "block";
        clearInterval(this.#intervalID);
        document.querySelector("#backgroundMusic").pause();
    }

    stop() {
        clearInterval(this.#intervalID);
        document.querySelector("#backgroundMusic").pause();
    }

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

const timerInstance = new Timer();

(async() => {
    const detailsFromFirebase = await getSessionStatusFromFirebase();
    if (detailsFromFirebase) {
        const { taskName, msLeft, sessionLength } = detailsFromFirebase;
        const endTime = new Date();
        timerInstance.setMillisecondsLeft(msLeft);
        timerInstance.setSessionLength(sessionLength);
        endTime.setMilliseconds(endTime.getMilliseconds() + timerInstance.getMillisecondsLeft());
        const startTime = endTime - timerInstance.getSessionLength();
                
        const current = new Date().getTime();
        const difference = endTime - current;
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        document.querySelector("#minute").textContent = formatNumbers(minutes);
        document.querySelector("#second").textContent = formatNumbers(seconds);
        document.querySelector("#timeSetting").style.display = "block"
        updateProgressBar(startTime, endTime)

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
        document.querySelector("#resumeFlocus").style.display = "block";    
    

        
    } else {
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

document.querySelectorAll(".updateTaskProgress").forEach(inputField => inputField.addEventListener("click", () => {
    document.querySelectorAll("#notification").pause();
}))

document.querySelector("#confirmedQuitSession").addEventListener('click', () => {
    deactivateSessionInFirebase()
})

document.querySelector("#confirmedEndSessionEarly").addEventListener('click', () => {
    setMsInFirebase(0);
    updateTaskCompletionStatus(true);
})


