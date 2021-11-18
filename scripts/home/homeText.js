function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
      if (value === searchValue) {
         return key;
      }
  }
}

function readDisplayQuote(documentName) {
  db.collection("quotes").doc(documentName)
      .onSnapshot(genericQuotesDoc => {
          const randomQuoteIndex = Math.floor(Math.random() * genericQuotesDoc.data().size) + 1;
          console.log(randomQuoteIndex);

          const quoteMap = genericQuotesDoc.data().randomQuoteIndex;
          document.getElementById("quote").innerHTML = getByValue(quoteMap, randomQuoteIndex);
          document.getElementById("quote-author").innerHTML = getByValue(quoteMap, randomQuoteIndex);
      });
}
//readDisplayQuote("hmRMGzkdEoeD7dhDq0c3");

function insertName() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if user is signed in:
      if (user) {
          // Do something for the current logged-in user here: 
          console.log(user.uid);
          //go to the correct user document by referencing to the user uid
          currentUser = db.collection("users").doc(user.uid);
          //get the document for current user.
          currentUser.get().then(userDoc => {
              var userName = userDoc.data().name;
              console.log(userName);
              //method #1:  insert with html only
              //document.getElementById("name-goes-here").innerText = n;    //using javascript
              //method #2:  insert using jquery
              $("#user-name").text(userName) //using jquery
          });
      } else {
          console.log("No used is signed in!");
      }

  });
}
insertName();