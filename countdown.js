class Countdown {
    #intervalID;
    #sessionLength;
    #millisecondsLeft;

    constructor(){};
    
    setIntervalID(id){
        this.#intervalID = id;
    }

    getIntervalID(){
        return this.#intervalID;
    }

    setSessionLength(sessionLength){
        this.#sessionLength = sessionLength;
    }

    getSessionLength(){
        return this.#sessionLength;
    }

    setMillisecondsLeft(ms){
        this.#millisecondsLeft = ms;
    }

    getMillisecondsLeft(){
        return this.#millisecondsLeft
    }

}

const countdownInstance = new Countdown();

document.querySelectorAll("input").forEach(inputField => inputField.addEventListener("change", () => {
    inputField.value = formatNumbers(inputField.value);
}))

document.querySelector("#music").addEventListener("click", () => {
    let isPlayingMusic = document.querySelector("#music").dataset.music === 'on'
    if (isPlayingMusic){
        document.querySelector("#music").dataset.music = 'off';
        document.querySelector("#music").innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
        document.querySelector('audio').muted = true;
    } else {
        document.querySelector("#music").dataset.music = 'on';
        document.querySelector("#music").innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        document.querySelector('audio').muted = false;
    }
    isPlayingMusic = !isPlayingMusic;
})


document.querySelector("#startFlocus").addEventListener("click", () => {    
    document.querySelector("#startFlocus").style.display = "none";
    document.querySelector("#music").style.display = "block";
    document.querySelector("audio").play();
    document.querySelector("#pauseFlocus").style.display = "block";
    document.querySelector("#stopFlocus").style.display = "block";
    
    document.querySelector("#minute").textContent = document.querySelector("#minuteInput").value;
    document.querySelector("#second").textContent = document.querySelector("#secondInput").value;

    const startTime = new Date();
    const endTime = startCountDown(startTime);
    let minute = parseInt(document.querySelector("#minute").textContent);
    let second = parseInt(document.querySelector("#second").textContent);
    document.querySelector('.circle .left .progress').style.transform = "rotate(" + ((1000 / (endTime - startTime)) * 360) + "deg)";
    if (second === 0){
        minute --;
        second = 59;
    } else {
        second --;
    }
    document.querySelector("#minute").textContent = formatNumbers(minute);
    document.querySelector("#second").textContent = formatNumbers(second);
    const intervalId = updateTimer(startTime, endTime, 10);
    countdownInstance.setIntervalID(intervalId);
})

document.querySelector("#pauseFlocus").addEventListener("click", () => {
    document.querySelector("#pauseFlocus").style.display = "none";
    document.querySelector("#stopFlocus").style.display = "none";
    document.querySelector("#music").style.display = "none";
    document.querySelector("audio").pause();
    document.querySelector("#resumeFlocus").style.display = "block";    
    clearInterval(countdownInstance.getIntervalID());
})

document.querySelector("#resumeFlocus").addEventListener("click", () => {
    document.querySelector("#pauseFlocus").style.display = "block";
    document.querySelector("#stopFlocus").style.display = "block";
    document.querySelector("#music").style.display = "block";
    document.querySelector("audio").play();
    document.querySelector("#resumeFlocus").style.display = "none";    
    const endTime = new Date();
    endTime.setMilliseconds(endTime.getMilliseconds() + countdownInstance.getMillisecondsLeft());
    const startTime = endTime - countdownInstance.getSessionLength();
    const intervalId = updateTimer(startTime, endTime, 10);
    countdownInstance.setIntervalID(intervalId);
})

function startCountDown(startTime){
    const minute = document.querySelector("#minute").textContent;
    const second = document.querySelector("#second").textContent;
    const endTime = new Date(startTime.getTime());
    endTime.setMinutes(endTime.getMinutes() + parseInt(minute));
    endTime.setSeconds(endTime.getSeconds() + parseInt(second));
    countdownInstance.setSessionLength(endTime - startTime);
    return endTime;
}

function updateTimer(startTime, endTime, ms){
    const intervalId = setInterval(function() {
        const current = new Date().getTime();
        const difference = endTime - current;
        countdownInstance.setMillisecondsLeft(difference)
        if (difference < 1) {
            clearInterval(intervalId);
            document.querySelector("#minute").textContent = formatNumbers(0);
            document.querySelector("#second").textContent = formatNumbers(0);
        } else {
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            document.querySelector("#minute").textContent = formatNumbers(minutes);
            document.querySelector("#second").textContent = formatNumbers(seconds);
            updateProgressBar(startTime, endTime)
        }
    }, ms);
    return intervalId;
}

function formatNumbers(num){
    const numInStringForm = num.toString()
    if (numInStringForm.length === 1){
        return '0' + numInStringForm;
    }
    return numInStringForm;
}

function updateProgressBar(startTime, endTime){
    const sessionLengthInMs= endTime - startTime;
    const current = new Date().getTime();
    const msPassed = current - startTime;
    const progress = (msPassed + 1000) / sessionLengthInMs;
    // countdownInstance.setProgress(progress);
    if (progress < 0.5){
        const degree = progress * 360;
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + degree + "deg)";
    } else {
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + 180 + "deg)";
        const degree = Math.min((progress - 0.5) * 360, 180);
        document.querySelector('.circle .right .progress').style.transform = "rotate(" + degree + "deg)";
    }
}

function assumeStartTime(progress, sessionLengthInMs){
    const current = new Date().getTime();
    const msPassed = sessionLengthInMs * progress;
    return current - msPassed;
}