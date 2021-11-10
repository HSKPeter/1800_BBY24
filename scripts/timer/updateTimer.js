function updateTimer(startTime, endTime, ms){
    const intervalId = setInterval(function() {
        const current = new Date().getTime();
        const difference = endTime - current;
        timerInstance.setMillisecondsLeft(difference)
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

        if (difference <= 1000){
            clearInterval(intervalId);
            const modalOfSessionCompletion = new bootstrap.Modal(document.getElementById('completeSessionModal'))
            modalOfSessionCompletion.show();
            document.querySelector("#backgroundMusic").pause();
            document.querySelector("#notification").play();
        }
    }, ms);
    return intervalId;
}