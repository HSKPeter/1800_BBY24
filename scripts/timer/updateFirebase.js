const usersDb = db.collection("users").doc("WMMSrfYUb0OpmQ60qVYS9jqwnhX2").collection("timerSessions");

const userName = "TEST USER";

async function updateFirebase(timeInfo, taskInfo) {
    const { startTime, endTime } = timeInfo;
    const { taskName, taskID } = taskInfo
    const msLeft = endTime - startTime - 1000;
    const sessionLength = endTime - startTime;
    usersDb.add({
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
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (!user){
                window.location.replace("/login.html");
            }
            const activeSessions = db.collection("users").doc(user.uid).collection("timerSessions").where("isActive", "==", true)
            const query = await activeSessions.get();
            const numberOfActiveSessions = query.size;
    
            if (numberOfActiveSessions > 0){
                const doc = query.docs[0]
                doc.ref.update({
                    msLeft
                });
            }
            resolve();
        });
    })
}

async function deactivateSessionInFirebase() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (!user){
                window.location.replace("/login.html");
            }
            const activeSessions = db.collection("users").doc(user.uid).collection("timerSessions").where("isActive", "==", true)
            const query = await activeSessions.get();
            const numberOfActiveSessions = query.size;
    
            if (numberOfActiveSessions > 0){
                const doc = query.docs[0]
                await doc.ref.update({
                    isActive: false,
                    taskCompleted: false,
                    msLeft: 0
                });
                window.location.assign("home.html");
            }
            resolve()
        });
    })
}

async function updateTaskCompletionStatus(status, msLeft, taskID = null) {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (!user){
                window.location.replace("/login.html");
            }
            const activeSessions = db.collection("users").doc(user.uid).collection("timerSessions").where("isActive", "==", true)
            const query = await activeSessions.get();
            const numberOfActiveSessions = query.size;
    
            if (numberOfActiveSessions > 0){
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
                resolve();
            }
        });
    })
}

async function getSessionStatusFromFirebase() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (!user){
                window.location.replace("/login.html");
            }
            const activeSessions = db.collection("users").doc(user.uid).collection("timerSessions").where("isActive", "==", true)
            const query = await activeSessions.get();
    
            if (query.size == 1) {
                const sessionDetails = query.docs[0].data()
                resolve(sessionDetails);
            }
            resolve()
        });
    })

}

async function getTasksFromFirebase() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (!user){
                window.location.replace("/login.html");
            }
            const activeTasks = db.collection("users").doc(user.uid).collection("tasks").where("isActive", "==", true)
            const query = await activeTasks.get();
            const result = query.docs.map(doc => {
                return {
                    id: doc.id,
                    name: doc.data().name
                }
            })
            console.log(result)
            resolve(result);
        });
    });
}