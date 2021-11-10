function assumeStartTime(progress, sessionLengthInMs){
    const current = new Date().getTime();
    const msPassed = sessionLengthInMs * progress;
    return current - msPassed;
}