"use strict";

// Utility to generate unique IDs
const generateId = (() => {
  let id = 0;
  return () => ++id;
})();

const cardsContainer = document.getElementById("cardsContainer");
const addStopwatchBtn = document.getElementById("addStopwatch");
const addTimerBtn = document.getElementById("addTimer");
const stopwatchTemplate = document.getElementById("stopwatchTemplate");
const timerTemplate = document.getElementById("timerTemplate");

// Add new stopwatch card
addStopwatchBtn.addEventListener("click", () => {
  const card = stopwatchTemplate.content.cloneNode(true).children[0];
  card.dataset.id = generateId();
  cardsContainer.appendChild(card);
});

// Add new timer card
addTimerBtn.addEventListener("click", () => {
  const card = timerTemplate.content.cloneNode(true).children[0];
  card.dataset.id = generateId();
  cardsContainer.appendChild(card);
});

// Event delegation for card actions (delete, controls, etc.)
cardsContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  // Delete card
  if (e.target.classList.contains("card__delete")) {
    card.remove();
    return;
  }

  // Further logic for controls will be added here
});
