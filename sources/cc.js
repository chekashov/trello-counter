// Settings
const DEBUG = false;
const VER = "1.0.0";

// Functions
async function waitBoard() {
  while(!document.getElementById('board')) {
    await new Promise(r => setTimeout(r, 500));
  }
}

async function waitPoints() {
  while(!document.getElementById('board')) {
    await new Promise(r => setTimeout(r, 500));
  }
}

function formatCounter(num) {
  if (num >= 1000 && num < 100000) {
    num = (num / 1000).toString().slice(0, 3);
    num = num.replace(new RegExp('\\.$'), '')+'K';
  } else if (num >= 100000) {
    num = (num / 1000000).toString().slice(0, 3);
    num = num.replace(new RegExp('\\.$'), '')+'M';
  } else {
    num = num.toString();
    if (num.length > 4) {
      num = num.slice(0, 4).replace(new RegExp('\\.$'), '');
    }
  }
  return num;
}

function refreshCounters() {
  let listHeaders = document.querySelectorAll('.list-header');
  let header, list, cards, saved, badge;
  let quantity = 0;
  let points = 0;
  for (var i = 0; i < listHeaders.length; i++) {
      // Define all elements
      header = listHeaders[i];
      list = header.parentNode;
      cards = list.querySelectorAll('a.list-card');
      quantity = cards.length;
      quantity = formatCounter(quantity);

      // Redraw card counter
      list.classList.add('counter-cards');
      header.setAttribute('data-cards', quantity);

      // Sum points in the current list
      for (var j = 0; j < cards.length; j++) {
        badge = cards[j].querySelector('.js-plugin-badges .badge')
        if (badge) {points += parseFloat(badge.innerText);}
      }
      if (DEBUG) {console.log('List '+(i+1)+': '+points+' points')}

      // Redraw points counter
      if (points > 0) {
        list.classList.add('counter-points');
        header.setAttribute('data-points', formatCounter(points));
        points = 0;
      } else {
        header.setAttribute('data-points', '');
        list.classList.remove('counter-points');
      }
  }
}

// Observer
let delay;
const config = { childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          if (DEBUG) {console.log('> Board DOM changed')}
          // Prevent extra runs
          clearTimeout(delay);
          delay = setTimeout(() => {refreshCounters();}, 0);
        }
    }
};
const observer = new MutationObserver(callback);

// Init
if (DEBUG) {console.log("Card Counter v"+VER+" is running")}
waitBoard().then( () => {
  if (DEBUG) {console.log("The board solemnly arrived")}
  refreshCounters();
  observer.observe(document.getElementById('popover-boundary'), config);
});
