// Authenticate users and redirect users to the login page if they have not signed in yet.
firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if (!user) {
        window.location.replace("/login.html");
    }
});

/**
 * Sign out the user.
 */
function signOut() {
    firebase.auth().signOut().then(() => {
        window.location.replace("/login.html");
      }).catch((error) => {
        console.log("Error in sign out.")
      });
}


