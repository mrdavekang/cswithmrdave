'use strict';
const cards = document.querySelector('#termCards');
const questions = document.querySelector('#recallQuestions');
const comparisons = document.querySelector('#comparisons');
for (const term of window.KEY_TERMS) {
  const card = document.createElement('article');
  card.className = 'term';
  const heading = document.createElement('h2');
  heading.textContent = `${term.number}. ${term.name}`;
  const source = document.createElement('p');
  source.className = 'small';
  source.textContent = `Exact textbook excerpt · p.${term.page} · specification ${term.ref}`;
  const quote = document.createElement('blockquote');
  quote.textContent = term.quote;
  const remember = document.createElement('p');
  remember.textContent = term.remember;
  const example = document.createElement('p');
  example.className = 'example';
  example.textContent = `Example: ${term.example}`;
  card.append(heading, source, quote, remember, example);
  cards.append(card);
  const question = document.createElement('li');
  question.textContent = `${term.question} [2 marks]`;
  questions.append(question);
  const comparison = document.createElement('p');
  const label = document.createElement('strong');
  label.textContent = `${term.number}. ${term.name}: `;
  comparison.append(label, document.createTextNode(term.comparison));
  comparisons.append(comparison);
}
function showPanel(id) {
  if (!['study', 'recall', 'check'].includes(id)) return;
  for (const panel of document.querySelectorAll('.panel')) panel.hidden = panel.id !== id;
  for (const tab of document.querySelectorAll('.tabs button')) {
    if (tab.dataset.panel === id) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  document.querySelector(`#${id} h2`).scrollIntoView({ block: 'start' });
}
for (const button of document.querySelectorAll('[data-panel]')) {
  button.addEventListener('click', () => showPanel(button.dataset.panel));
}
