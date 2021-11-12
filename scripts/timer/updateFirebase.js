const usersDb = db.collection("users");
const currentUser = usersDb.doc("i1UwfwRmSTDX4pSSA1dC");

function updateFirebase(timeInfo, taskName) {
    const {startTime, endTime} = timeInfo;
    const msLeft = endTime - startTime - 1000;
    const sessionLength = endTime - startTime;
    currentUser.update({
        taskName: taskName,
        invokeTime: startTime,
        msLeft: msLeft,
        sessionLength: sessionLength,
        isActive: true,
    });
}

function setMsInFirebase(msLeft) {
    currentUser.update({
        msLeft
    });
}

function deactivateSessionInFirebase() {
    currentUser.update({
        isActive: false,
        msLeft: 0
    });
}

async function getSessionStatusFromFirebase(){
    const doc = await currentUser.get();
    const sessionDetails = doc.data()
    if (sessionDetails.isActive){
        return sessionDetails;
    }
}