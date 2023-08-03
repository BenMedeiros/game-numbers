'use strict';

//adds a temp css transition class and removes it when complete;
//needed so that user resize:both isn't isn't animated
function addTempTransitionClass(el, cssClassName) {
  el.classList.add(cssClassName);
  Promise.allSettled(el.getAnimations().map(ani => ani.finished)).then(() => {
    el.classList.remove(cssClassName);
  })
}

function collapseSettingElement(event) {
  if (settingsExpanded) {
    const gameConfigEl = document.querySelector('.collapsible');
    settingsExpanded = false;
    if (!gameConfigEl.classList.contains('collapsed')) {
      gameConfigEl.classList.add('collapsed');
      addTempTransitionClass(gameConfigEl, 'collapsing');
    }
  }
}

function expandSettingElement(event) {
  event.stopPropagation();
  if (!settingsExpanded) {
    const gameConfigEl = document.querySelector('.collapsible');
    settingsExpanded = true;
    if (gameConfigEl.classList.contains('collapsed')) {
      gameConfigEl.classList.remove('collapsed');
      addTempTransitionClass(gameConfigEl, 'expanding');
    }
  }
}


const gameConfigEl = document.getElementById('gameConfig');
document.addEventListener('click', collapseSettingElement);
gameConfigEl.addEventListener('click', expandSettingElement);

let settingsExpanded = true;

export default {
  gameConfigEl
}
