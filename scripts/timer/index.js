class Timer {
    #intervalID;
    #sessionLength;
    #millisecondsLeft;
    #isPlayingMusic;

    constructor(){
        this.#isPlayingMusic = true;
    };
    
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

    init(){
        if (document.querySelector('select').value === ''){
            alert("Please choose a task in the dropdown menu.")
            return;
        }
        document.querySelector("#task").innerHTML = `
        <strong>
        <div class="d-flex flex-column">
        <div>Task of this Flocus session:</div>
        <div>${document.querySelector('select').value}</div>
        </div>
        </strong>
        `;
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
        timerInstance.setIntervalID(intervalId);
    }

    pause(){
        document.querySelector("#pauseFlocus").style.display = "none";
        document.querySelector("#stopFlocus").style.display = "none";
        document.querySelector("#music").style.display = "none";    
        document.querySelector("#resumeFlocus").style.display = "block";  
        clearInterval(this.#intervalID);
        document.querySelector("audio").pause();
    }

    stop(){
        clearInterval(this.#intervalID);
        document.querySelector("audio").pause();
    }

    resume(){
        document.querySelector("#pauseFlocus").style.display = "block";
        document.querySelector("#stopFlocus").style.display = "block";
        document.querySelector("#music").style.display = "block";    
        document.querySelector("#resumeFlocus").style.display = "none";  

        document.querySelector("audio").play();
        
        const endTime = new Date();    
        endTime.setMilliseconds(endTime.getMilliseconds() + timerInstance.getMillisecondsLeft());
        const startTime = endTime - timerInstance.getSessionLength();
        const intervalId = updateTimer(startTime, endTime, 10);
        timerInstance.setIntervalID(intervalId);
    }

    changeMusicSetting(){
        if (this.#isPlayingMusic === true){
            document.querySelector("#music").dataset.music = 'off';
            document.querySelector("#music").innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
            document.querySelector('audio').muted = true;
        } else {
            document.querySelector("#music").dataset.music = 'on';
            document.querySelector("#music").innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            document.querySelector('audio').muted = false;
        }
        this.#isPlayingMusic = !this.#isPlayingMusic;
    }

}

const timerInstance = new Timer();


document.querySelector("#startFlocus").addEventListener("click", () => {timerInstance.init()})
document.querySelector("#timeSetting").addEventListener('keydown', (event) => {
    if (event.key === "Enter"){
        timerInstance.init();
    }
});

document.querySelector("#music").addEventListener("click", () => {timerInstance.changeMusicSetting()});

document.querySelector("#pauseFlocus").addEventListener("click", () => {timerInstance.pause()})
document.querySelector("#resumeFlocus").addEventListener("click", () => {timerInstance.resume()})

document.querySelectorAll('.resumeCountDown').forEach(element => element.addEventListener('click', () => {timerInstance.resume()}));
document.querySelectorAll('.pauseCountDown').forEach(element => element.addEventListener('click', () => {
    timerInstance.stop();
}));

document.querySelectorAll("input").forEach(inputField => inputField.addEventListener("change", () => {
    inputField.value = formatNumbers(inputField.value);
}))






