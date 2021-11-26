// Authenticate users and redirect users to the login page if they have not signed in yet.
firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    db.collection("users").doc(user.uid).collection("timerSessions").doc("test").set()
    if (!user) {
        window.location.replace("/login.html");
    }
});