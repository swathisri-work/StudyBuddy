const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/quiz.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const palette = { innerHTML: '', closest: () => ({ hidden: false }), replaceChildren() { this.innerHTML = ''; }, querySelector() { return { scrollIntoView() {} }; } };
const panel = { hidden: false };
palette.closest = () => panel;
const elements = new Map(['finish-answered-count', 'finish-unanswered-count', 'finish-marked-count', 'finish-attempt-modal'].map(id => [id, { textContent: '', hidden: true }]));
const context = vm.createContext({
  document: {
    getElementById: id => id === 'question-palette' ? palette : elements.get(id),
    querySelector: () => ({ focus() {} }),
  },
  app: { navigate: view => { context.lastNavigatedView = view; } },
});
vm.runInContext(source, context);
const quiz = vm.runInContext('quiz', context);
quiz.renderQuestion = function() { this.renderPalette(); };

assert.match(css, /\.quiz-sidebar\s*\{[^}]*position:\s*sticky/s, 'desktop palette should remain visible beside long questions');
assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.quiz-layout,\s*\.planner-layout\s*\{\s*flex-direction:\s*column/s, 'mobile layout should put the palette below the question card');
assert.match(css, /\.palette-btn\s*\{[^}]*font-size:\s*18px/s, 'palette number font must be at least 18px');
assert.match(css, /\.palette-legend\s*\{[^}]*font-size:\s*18px/s, 'legend font must be at least 18px');
assert.match(css, /\.quiz-sidebar\s*\{[^}]*max-height:\s*calc\(100vh/s, 'desktop palette should have a bounded scroll area');
assert.match(css, /\.palette-scroll\s*\{[^}]*overflow-y:\s*auto/s, 'palette viewport should scroll vertically');
assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.palette-scroll\s*\{[^}]*max-height:\s*30dvh/s, 'mobile palette should have a bounded scroll area');
assert.match(css, /\.palette-btn::after\s*\{[^}]*height:\s*5px/s, 'each question button should have a status strip');
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /Finish attempt…/, 'finish attempt action should be present');

quiz.currentQuestions = [];
quiz.renderPalette();
assert.equal(palette.innerHTML, '', 'empty sessions must not leave stale question buttons');
assert.equal(panel.hidden, true, 'empty sessions must hide the palette panel');

for (const { mode, count } of [
  { mode: 'Daily Practice', count: 10 },
  { mode: 'Subject Practice', count: 50 },
  { mode: 'Mock Test', count: 100 },
]) {
  quiz.currentQuestions = Array.from({ length: count }, (_, i) => ({ id: `${mode}-${i + 1}` }));
  quiz.currentIndex = 0;
  quiz.userAnswers = {};
  quiz.markedForReview = new Set();
  quiz.renderPalette();

  let buttons = [...palette.innerHTML.matchAll(/<button\b([^>]*)>(\d+)<\/button>/g)];
  assert.equal(buttons.length, count, `${mode}: one palette button per question`);
  assert.deepEqual(buttons.map(m => Number(m[2])), Array.from({ length: count }, (_, i) => i + 1), `${mode}: numbered buttons cover the whole session`);
  assert.match(buttons[0][1], /aria-current="true"/, `${mode}: first question is marked current`);
  assert.match(buttons[0][1], /unanswered/, `${mode}: unanswered state is explicit`);

  quiz.currentIndex = 1;
  quiz.selectOption(2);
  assert.match(palette.innerHTML, new RegExp(`class="palette-btn answered current"[^>]*aria-label="Question 2, answered, current question"`), `${mode}: selected answer updates status and current marker`);
  quiz.toggleMarkForReview();
  assert.match(palette.innerHTML, /class="palette-btn answered-marked current"/, `${mode}: answered and marked state is distinct`);
  quiz.currentIndex = 3;
  quiz.toggleMarkForReview();
  assert.match(palette.innerHTML, /class="palette-btn marked current"/, `${mode}: unanswered review mark is visible`);

  const clickHandlers = [...palette.innerHTML.matchAll(/onclick="quiz\.goToQuestion\((\d+)\)"/g)];
  for (let i = 0; i < clickHandlers.length; i++) {
    quiz.goToQuestion(Number(clickHandlers[i][1]));
    assert.equal(quiz.currentIndex, i, `${mode}: clicking Question ${i + 1} opens the matching question`);
  }
  quiz.goToQuestion(Number(clickHandlers[1][1]));
  assert.equal(quiz.currentIndex, 1, `${mode}: clicking a number navigates to its question`);
  assert.equal(quiz.userAnswers[1], 2, `${mode}: answer remains selected after navigation`);
  assert(quiz.markedForReview.has(1), `${mode}: review flag remains after navigation`);
  quiz.selectOption(1);
  assert.equal(quiz.userAnswers[1], 1, `${mode}: changing the answer is retained`);
  assert.match(palette.innerHTML, /class="palette-btn answered-marked current"/, `${mode}: answer changes keep combined status current`);

  quiz.calculateResults = function() { this.testSubmissions = (this.testSubmissions || 0) + 1; };
  quiz.timerInterval = null;
  quiz.showFinishAttempt();
  assert.equal(elements.get('finish-answered-count').textContent, 1, `${mode}: finish summary counts answered questions`);
  assert.equal(Number(elements.get('finish-unanswered-count').textContent), count - 1, `${mode}: finish summary counts unanswered questions`);
  assert.equal(elements.get('finish-marked-count').textContent, 2, `${mode}: finish summary counts review marks`);
  assert.equal(elements.get('finish-attempt-modal').hidden, false, `${mode}: finish action opens the summary`);
  quiz.cancelFinishAttempt();
  assert.equal(elements.get('finish-attempt-modal').hidden, true, `${mode}: return to test closes the summary`);
  assert.equal(quiz.userAnswers[1], 1, `${mode}: returning preserves the selected answer`);
  quiz.showFinishAttempt();
  const submissionsBeforeConfirm = quiz.testSubmissions || 0;
  quiz.confirmFinishAttempt();
  assert.equal(quiz.testSubmissions, submissionsBeforeConfirm + 1, `${mode}: explicit confirmation submits once`);
  assert.equal(context.lastNavigatedView, 'quiz-results', `${mode}: confirmed submission opens results`);
  console.log(`PASS ${mode}: ${count} numbered buttons, navigation, answers, review states`);
}
