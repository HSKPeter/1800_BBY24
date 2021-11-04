document.querySelector("#startFlocus").addEventListener("click", () => {
    const endTime = startCountDown();
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
    updateTimer(endTime);
})

function startCountDown(){
    const minute = document.querySelector("#minute").textContent;
    const second = document.querySelector("#second").textContent;
    const endTime = new Date();
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
            document.querySelector("#minute").textContent = formatNumbers(minutes);
            document.querySelector("#second").textContent = formatNumbers(seconds);
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