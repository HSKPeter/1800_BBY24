// used as a test to ensure the page is linked up to this file
console.log("Hello World!");

// Define all query selectors
const openPopUpButtons = document.querySelectorAll('[data-pop-up-target]');
const closePopUpButtons = document.querySelectorAll('[data-close-button]');

// define overlay
const overlay = document.getElementById('overlay');

openPopUpButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popUp = document.querySelector(button.dataset.popUpTarget); // popUpTarget is converted to camel case automatically
    openPopUp(popUp);
  });
});

overlay.addEventListener('click', () => {
  const popUps = document.querySelectorAll('.pop-up.active');
  popUps.forEach(popUp => {
    closePopUp(popUp);
  });
});


closePopUpButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popUp = button.closest('.pop-up');
    closePopUp(popUp);
  });
});

openPopUp = function(popUp) {
  if (popUp == null) {
    return;
  }
  console.log("opened popup!");
  popUp.classList.add('active');
  overlay.classList.add('active');
}

closePopUp = function(popUp) {
  if (popUp == null) {
    return;
  }
  console.log("closed popup!");
  popUp.classList.remove('active');
  overlay.classList.remove('active');
}