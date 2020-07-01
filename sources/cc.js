// Settings
const DEBUG = false;
const VER = "0.3"

// Functions
function refreshCounters() {
  let listHeaders = document.querySelectorAll('.list-header');
  let header, list, quantity
  for (var i = 0; i < listHeaders.length; i++) {
      header = listHeaders[i]
      list = header.parentElement.getElementsByClassName('list-cards')[0]
      quantity = list.childElementCount
      header.setAttribute('data-counter', quantity)
  }
}

// Init
if (DEBUG) {
  console.log("Card Counter v"+VER+" is running")
}
refreshCounters();

// Observer
const config = { childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          refreshCounters();
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(document.querySelector('#board'), config);
