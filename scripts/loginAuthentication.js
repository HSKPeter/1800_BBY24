firebase.auth().onAuthStateChanged(user => {
    // console.log(user)
    db.collection("users").doc(user.uid).collection("timerSessions").doc("test").set()
    if (!user) {
        window.location.replace("/login.html");
    }
});