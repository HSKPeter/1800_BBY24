function insertName() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if user is signed in:
      if (user) {
          //go to the correct user document by referencing to the user uid
          currentUser = db.collection("users").doc(user.uid);
          //get the document for current user.
          currentUser.get().then(userDoc => {
              var userName = userDoc.data().name;
              document.getElementById("user-name").innerText = " " + userName;
          });
      } else {
          console.log("No used is signed in!");
      }

  });
}
insertName();

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
      if (value === searchValue) {
         return key;
      }
  }
}

// get help implementing a quote
function readDisplayQuote(documentName) {
  db.collection("quotes").doc(documentName)
      .onSnapshot(genericQuotesDoc => {
          const randomQuoteIndex = Math.floor(Math.random() * genericQuotesDoc.data().size) + 1;
          const quoteMap = genericQuotesDoc.data()[randomQuoteIndex];
          console.log(quoteMap);

          //document.getElementById("quote").textContent = quoteMap;
          //document.getElementById("quote-author").textContent = "Test";
      });
}
readDisplayQuote("hmRMGzkdEoeD7dhDq0c3");
