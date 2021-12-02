/**
 * Update the countdown information in DOM and return the end time of the countdown.
 * @param {Date} startTime 
 * @returns {Date}
 */
function startCountDown(startTime){
    const minute = document.querySelector("#minute").textContent;
    const second = document.querySelector("#second").textContent;
    const endTime = new Date(startTime.getTime());
    endTime.setMinutes(endTime.getMinutes() + parseInt(minute));
    endTime.setSeconds(endTime.getSeconds() + parseInt(second));
    timerInstance.setSessionLength(endTime - startTime);
    return endTime;
}