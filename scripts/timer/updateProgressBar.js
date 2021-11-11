function updateProgressBar(startTime, endTime){
    const sessionLengthInMs= endTime - startTime;
    const current = new Date().getTime();
    const msPassed = current - startTime;
    const progress = (msPassed + 1000) / sessionLengthInMs;
    if (progress < 0.5){
        const degree = progress * 360;
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + degree + "deg)";
    } else {
        document.querySelector('.circle .left .progress').style.transform = "rotate(" + 180 + "deg)";
        const degree = Math.min((progress - 0.5) * 360, 180);
        document.querySelector('.circle .right .progress').style.transform = "rotate(" + degree + "deg)";
    }

    if(sessionLengthInMs - msPassed <= 6000){
        document.querySelectorAll('.circle .bar .progress').forEach(element => element.style.background = "red")
    }
}