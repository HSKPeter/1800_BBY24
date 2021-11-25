function toggleColorTheme(){
    var currentTheme = db.collection("users").doc(user.uid);
    if (currentTheme.data.theme == "dark") {
        currentTheme.data.theme = "light";
        document.getElementsByClassName("bg-primary-color-scheme").style.background-color;

    }
    if (currentTheme == light) {
        currentTheme.data.theme = "dark";
    }
}