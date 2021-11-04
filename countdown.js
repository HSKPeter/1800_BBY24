document.querySelector("#startFlocus").addEventListener("click", () => {
    const startTime = new Date();
    const endTime = startCountDown(startTime);
    console.log(endTime - startTime)
    let minute = parseInt(document.querySelector("#minute").textContent);
    let second = parseInt(document.querySelector("#second").textContent);
    if (second === 0){
        minute --;
        second = 59;
    } else {
        second --;
    }
    document.querySelector("#minute").textContent = formatNumbers(minute);
    document.querySelector("#second").textContent = formatNumbers(second);
    updateTimer(startTime, endTime);
})

function startCountDown(startTime){
    const minute = document.querySelector("#minute").textContent;
    const second = document.querySelector("#second").textContent;
    const endTime = new Date(startTime.getTime());
    endTime.setMinutes(endTime.getMinutes() + parseInt(minute));
    endTime.setSeconds(endTime.getSeconds() + parseInt(second));
    return endTime;
}

function updateTimer(startTime, endTime){
    const interval = setInterval(function() {
        const current = new Date().getTime();
        const difference = endTime - current;
        if (difference < 0) {
            clearInterval(interval);
            document.querySelector("#countdownTime").textContent = "00:00";
        } else {
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            document.querySelector("#minute").textContent = formatNumbers(minutes);
            document.querySelector("#second").textContent = formatNumbers(seconds);
            updateProgressBar(startTime, endTime)
        }
    }, 1000);
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
    const progress = msPassed / sessionLengthInMs;
    if (progress < 0.5){
        const degree = progress * 360;
        document.querySelector('.progress .progress-right .progress-bar').style.transform = "rotate(" + degree + "deg)";
    } else {
        const degree = (progress - 50) * 360;
        document.querySelector('.progress.red .progress-left .progress-bar').style.transform = "rotate(" + degree + "deg)";

    }
}