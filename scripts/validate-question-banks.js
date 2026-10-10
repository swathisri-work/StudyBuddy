const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = [
  'data/afcat-previous.json', 'data/afcat-practice.json',
  'data/tnpsc-previous.json', 'data/tnpsc-practice.json', 'data/question-review.json', 'data/gk-facts.json'
];
const report = { generatedAt: new Date().toISOString(), banks: {}, totals: { records: 0, reviewRequired: 0, validated: 0, duplicateIds: 0, duplicateTexts: 0 }, issues: [] };
const ids = new Set();
const texts = new Set();
const norm = value => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();

for (const relative of files) {
  const rows = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  if (!Array.isArray(rows)) throw new Error(`${relative} must contain a JSON array`);
  let invalid = 0, reviewRequired = 0, validated = 0;
  for (const q of rows) {
    report.totals.records++;
    if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.explanation || !Number.isInteger(Number(q.correctAnswer)) || Number(q.correctAnswer) < 0 || Number(q.correctAnswer) >= (q.options || []).length) invalid++;
    const id = norm(q.id), text = norm(q.question);
    if (ids.has(id)) report.totals.duplicateIds++; else ids.add(id);
    if (texts.has(text)) report.totals.duplicateTexts++; else texts.add(text);
    if (q.verification === 'needs-review') reviewRequired++;
    else validated++;
    if (q.language && ['ta', 'ta-en'].includes(q.language) && !/[\u0B80-\u0BFF]/u.test(`${q.question} ${(q.options || []).join(' ')} ${q.explanation || ''}`)) invalid++;
  }
  report.totals.reviewRequired += reviewRequired;
  report.totals.validated += validated;
  report.banks[relative] = { records: rows.length, invalid, reviewRequired, validated };
  if (invalid) report.issues.push(`${relative}: ${invalid} structurally invalid record(s)`);
}
report.totals.duplicateIds = report.totals.duplicateIds;
report.totals.duplicateTexts = report.totals.duplicateTexts;
fs.writeFileSync(path.join(root, 'data/question-bank-validation.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
