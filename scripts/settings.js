function toggleColorTheme(){
    var currentTheme = db.collection("users").doc(user.uid);
    if (currentTheme.data.theme == "dark") {
        currentTheme.data.theme = "light";
    }
    if (currentTheme == light) {
        currentTheme.data.theme = "dark";
    }
}