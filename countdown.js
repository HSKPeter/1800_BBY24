document.querySelector("#startFlocus").addEventListener("click", () => {
    const startTime = new Date();
    const endTime = startCountDown(startTime);
    let minute = parseInt(document.querySelector("#minute").textContent);
    let second = parseInt(document.querySelector("#second").textContent);
    console.log(((1000 / (endTime - startTime)) * 360))
    document.querySelector('.circle .left .progress').style.transform = "rotate(" + ((1000 / (endTime - startTime)) * 360) + "deg)";
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
        if (difference < 1) {
            clearInterval(interval);
            document.querySelector("#minute").textContent = formatNumbers(0);
            document.querySelector("#second").textContent = formatNumbers(0);
        } else {
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            document.querySelector("#minute").textContent = formatNumbers(minutes);
            document.querySelector("#second").textContent = formatNumbers(seconds);
            updateProgressBar(startTime, endTime)
        }
    }, 10);
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
    if (progress < 0.5){
        const degree = progress * 360;
        console.log(degree)
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + degree + "deg)";
    } else {
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + 180 + "deg)";
        const degree = Math.min((progress - 0.5) * 360, 180);
        document.querySelector('.circle .right .progress').style.transform = "rotate(" + degree + "deg)";
    }
}