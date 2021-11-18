const usersDb = db.collection("timerSessions");

const userName = "TEST USER";

async function updateFirebase(timeInfo, taskInfo) {
    const { startTime, endTime } = timeInfo;
    const { taskName, taskID } = taskInfo
    const msLeft = endTime - startTime - 1000;
    const sessionLength = endTime - startTime;
    usersDb.add({
        user: userName,
        taskName: taskName,
        taskID: taskID,
        invokeTime: startTime,
        msLeft: msLeft,
        estimatedSessionLength: sessionLength,
        actualTimeSpentForCompletion: sessionLength,
        isActive: true,
    });
}

async function setMsInFirebase(msLeft) {
    const currentUser = db.collection("timerSessions").where("user", "==", userName).where("isActive", "==", true)
    const query = await currentUser.get();
    const doc = query.docs[0]
    doc.ref.update({
        msLeft
    });
}

async function deactivateSessionInFirebase() {
    const currentUser = db.collection("timerSessions").where("user", "==", userName).where("isActive", "==", true)
    const query = await currentUser.get();
    const doc = query.docs[0]
    await doc.ref.update({
        isActive: false,
        taskCompleted: false,
        msLeft: 0
    });
    window.location.assign("home.html");
}

async function updateTaskCompletionStatus(status, msLeft, taskID = null) {
    const currentUser = db.collection("timerSessions").where("user", "==", userName).where("isActive", "==", true)
    const query = await currentUser.get();
    const doc = query.docs[0]
    const { estimatedSessionLength } = doc.data();
    await doc.ref.update({
        taskCompleted: status,
        isActive: false,
        actualTimeSpentForCompletion: estimatedSessionLength - msLeft,
        msLeft: 0
    });
    if (status === true) {
        const taskDb = db.collection("tasks")
        const taskDoc = taskDb.doc(taskID)
        const taskDocContent = await taskDoc.get();
        let { timeSpent } = taskDocContent.data();
        timeSpent += (estimatedSessionLength - msLeft);
        await taskDoc.update({
            isCompleted: true,
            status: "done",
            timeSpent: timeSpent
        });

        window.location.assign("statics.html");
    } else {
        window.location.assign("home.html");
    }

}

async function getSessionStatusFromFirebase() {
    const currentUser = db.collection("timerSessions").where("user", "==", userName).where("isActive", "==", true)
    const query = await currentUser.get();
    if (query.size == 1) {
        const sessionDetails = query.docs[0].data()
        return sessionDetails;
    }
}

async function getTasksFromFirebase() {
    const currentUser = db.collection("tasks").where("user", "==", userName).where("isCompleted", "==", false)
    const query = await currentUser.get();
    const result = query.docs.map(doc => {
        return {
            id: doc.id,
            name: doc.data().name
        }
    })
    return result;
}