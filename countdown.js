document.querySelector("#startFlocus").addEventListener("click", () => {
    const endTime = startCountDown();
    document.querySelector("#countdownTime").textContent = "24:59";
    updateTimer(endTime);
})

function startCountDown(){
    const endTime = new Date();
    const sessionLength = document.querySelector("#countdownTime").textContent;
    [minute, second] = sessionLength.split(":");
    endTime.setMinutes(endTime.getMinutes() + parseInt(minute));
    endTime.setSeconds(endTime.getSeconds() + parseInt(second));
    return endTime;
}

function updateTimer(endTime){
    setInterval(function() {
        const current = new Date().getTime();
        const difference = endTime - current;
        if (difference < 0) {
            clearInterval(x);
            document.querySelector("#countdownTime").textContent = "00:00";
        } else {
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            document.querySelector("#countdownTime").textContent = minutes + ":" + seconds;
        }
    }, 1000);
}