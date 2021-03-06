// "Countdown" and "timer session" are interchangeable terms sharing the same meaning.

/**
 * Updates the Firebase data regarding the timer session.
 * @param { {startTime: Date, endTime: Date} } timeInfo 
 * @param { {taskName: String, taskID: number} } taskInfo 
 * @returns {Promise}
 */
async function updateFirebase(timeInfo, taskInfo) {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            const { startTime, endTime } = timeInfo;
            const { taskName, taskID } = taskInfo
            const msLeft = endTime - startTime - 1000;
            const sessionLength = endTime - startTime;
            await db.collection("users").doc(user.uid).collection("timerSessions").add({
                taskName: taskName,
                taskID: taskID,
                invokeTime: startTime,
                msLeft: msLeft,
                estimatedSessionLength: sessionLength,
                actualTimeSpentForCompletion: sessionLength,
                isActive: true,
            });
            resolve();
        })

    })
}

/**
 * Updates the value of remaining milliseconds of the active timer session in Firebase.
 * @param {number} msLeft 
 * @returns {Promise}
 */
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

/**
 * Update Firebase and set the active timer session as inactive.
 * @returns {Promise}
 */
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
                window.location.assign("index.html");
            }
            resolve()
        });
    })
}

/**
 * Update the task completion status in Firebase.
 * @param {boolean} status 
 * @param {number} msLeft 
 * @param {null | String} taskID 
 * @returns {Promise}
 */
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
    
                const taskDb = db.collection("users").doc(user.uid).collection("tasks")
                const taskDoc = taskDb.doc(taskID)
                const taskDocContent = await taskDoc.get();
                let { timeSpent } = taskDocContent.data();
                timeSpent += (estimatedSessionLength - msLeft);
                if (status === true) {                    
                    await taskDoc.update({
                        taskStatus: "Done",
                        timeSpent: timeSpent
                    });
                    window.location.assign("statistics.html");
                } else {
                    await taskDoc.update({
                        taskStatus: "In-Progress",
                        timeSpent: timeSpent
                    });
                    window.location.assign("index.html");
                }
                resolve();
            }
        });
    })
}

/**
 * Access the details of the active timer session from Firebase
 * @returns {Promise}
 */
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

/**
 * Access the task details from Firebase.
 * @returns {Promise}
 */
async function getTasksFromFirebase() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (!user){
                window.location.replace("/login.html");
            }
            const activeTasks = db.collection("users").doc(user.uid).collection("tasks").where("taskStatus", "!=", "Done")
            const query = await activeTasks.get();
            const result = query.docs.sort(sortTasks).map(doc => {
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