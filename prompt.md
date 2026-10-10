# MASTER PROMPT: Build a Complete Dual-Exam Preparation Web Application

## 1. Role and Objective

Act as a senior frontend developer, UI/UX designer, educational platform architect, and exam-preparation system designer.

Build a complete, responsive, interactive, frontend-first web application named **StudyMate – Smart Exam Preparation Portal** for two students preparing for two different competitive examinations:

1. **Jayakumar** – AFCAT (Air Force Common Admission Test).
2. **Swathisri B A** – TNPSC Group 4 (Tamil Nadu Public Service Commission Group IV).

The application must allow each student to select their profile and access a personalized exam-preparation dashboard with the correct syllabus, subjects, study materials, practice questions, mock tests, study planner, notes, bookmarks, and progress tracking.

This must be a functional application, not merely a static UI prototype.

Do not stop after creating a landing page or dashboard mockup. Implement the complete frontend, connect the interactions, populate the application using the supplied materials where available, and test the major user journeys.

---

## 2. Project Folder Structure

Before development, inspect the existing project directory and its contents.

Use the following structure where practical. Do not overwrite existing files unnecessarily.

```text
study-buddy-exam-prep/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── afcat.js
│   ├── tnpsc.js
│   ├── quiz.js
│   ├── progress.js
│   ├── planner.js
│   ├── notes.js
│   └── chatbot.js
│
├── assets/
│   ├── images/
│   └── icons/
│
├── data/
│   ├── afcat-questions.json
│   ├── tnpsc-questions.json
│   └── gk-facts.json
│
└── study-materials/
    ├── afcat/
    │   ├── AFCAT-Syllabus.pdf
    │   ├── English/
    │   ├── General-Awareness/
    │   ├── Numerical-Ability/
    │   ├── Reasoning/
    │   └── EKT/
    │
    └── tnpsc-group-4/
        ├── TNPSC-Syllabus.pdf
        ├── Tamil/
        ├── General-Studies/
        └── Aptitude/
```

Important instructions:

- The two syllabus PDFs may already be available in the project directory or attached to the development conversation. Inspect the files that are actually accessible.
- The folders for individual subjects may initially be empty.
- Do not invent filenames, claim files exist when they do not, or create fake study materials to fill empty folders.
- Allow additional PDFs, text documents, and other supported study materials to be integrated later.
- Keep AFCAT and TNPSC materials separate.
- If the current project already has a different but working structure, adapt to it rather than rebuilding everything unnecessarily.

---

## 3. Profile Selection and Landing Page

Create an attractive landing page titled:

**StudyMate – Your Personal Exam Preparation Companion**

Subtitle:

*One platform. Two aspirants. One goal: success.*

Display two large, attractive profile cards.

### Profile 1: Jayakumar

- Examination: AFCAT
- Subtitle: Prepare for a career in the Indian Air Force.
- Button: **Enter AFCAT Dashboard**
- Use suitable aviation-themed illustrations, aircraft imagery, or subtle aviation-inspired design elements.
- Clicking this card must open Jayakumar's AFCAT dashboard.

### Profile 2: Swathisri B A

- Examination: TNPSC Group 4
- Subtitle: Prepare for Tamil Nadu government examinations.
- Button: **Enter TNPSC Dashboard**
- Use suitable educational, books, Tamil Nadu, or government-examination-inspired imagery.
- Clicking this card must open Swathisri's TNPSC dashboard.

Functional requirements:

- Profile selection must work correctly.
- Each profile must display only its relevant syllabus, materials, practice questions, notes, and progress.
- Provide a clear way to return to the profile selection screen.
- Remember the most recently selected profile where appropriate.
- Clearly display the active student's name and examination throughout the dashboard.
- Do not mix the two students' examination content.

---

## 4. UI/UX Design Requirements

Create a polished, modern, premium-quality interface with excellent readability.

### Typography

- Use **Times New Roman** throughout the application.
- Minimum font size: **16px**.
- Body text should generally be 16–18px or larger.
- Dashboard headings should be approximately 24–32px.
- Main page headings should be approximately 30–38px.
- Important buttons should use readable text of at least 16px.
- Small labels, tooltips, chart labels, table headings, calendar dates, and graph legends must remain readable.

### Colour palette

Use soft, bright pastel colours, such as:

- Lavender
- Light blue
- Mint green
- Peach
- Pale pink
- Cream
- Soft purple
- Muted navy for text and contrast

Use a consistent palette throughout the application. Each dashboard may have a subtle accent colour, but maintain a common visual identity.

### Design principles

- Use clear spacing and alignment.
- Use rounded cards with subtle shadows.
- Use attractive icons.
- Use smooth transitions and subtle animations.
- Use hover effects on clickable cards and buttons.
- Use a consistent navigation style.
- Keep backgrounds and navigation visually harmonious.
- Avoid excessive gradients, neon colours, clutter, and unnecessary animation.
- Do not use low-contrast text.
- Never place light text on a light background or dark text on an unsuitable dark background.
- Ensure every button, card, graph, modal, input, calendar, and dropdown is readable.
- Make the design responsive for desktops, tablets, and mobile phones.
- Use accessible colour contrast, keyboard navigation, visible focus states, and meaningful labels.

Do not use CSS or UI components that make text invisible, clipped, overlapping, or difficult to read.

---

## 5. Individual Student Dashboards

Build a complete dashboard for each profile.

Each dashboard should contain:

1. Welcome section with the student's name.
2. Examination name.
3. Daily study summary.
4. Overall preparation progress.
5. Subjects and syllabus.
6. Study materials.
7. Daily practice questions.
8. Subject-wise practice.
9. Mock tests.
10. General Knowledge and current-affairs section.
11. Interactive GK facts.
12. Study planner and calendar.
13. Personal notes.
14. Bookmarks and saved questions.
15. Revision section.
16. Performance analytics.
17. Chatbox or study assistant.
18. Settings and profile switching.

Use cards, progress indicators, simple charts, lists, and clear navigation.

Dashboard statistics must be calculated from actual saved application data. Do not show fabricated personal achievements, completed tests, or progress percentages.

When no activity exists, display a helpful empty state such as "Start your first practice session to see your progress."

---

## 6. AFCAT Dashboard – Jayakumar

Use the supplied AFCAT syllabus PDF as the primary source for the examination structure and syllabus.

### AFCAT examination structure

According to the supplied syllabus document, the AFCAT written examination has:

- 100 questions.
- 120 minutes.
- 300 maximum marks.
- +3 marks for a correct answer.
- -1 mark for an incorrect answer.

For the Engineering Knowledge Test (EKT), where applicable to the candidate's chosen technical entry:

- 50 questions.
- 45 minutes.
- 150 maximum marks.

Clearly distinguish AFCAT from EKT. Do not force EKT preparation on a student who does not require it. Let the user enable or disable EKT according to their eligibility and examination pathway.

### AFCAT subjects

Create subject pages for:

**A. English**

Include the syllabus topics supported by the supplied PDF, with suitable subsections for grammar, vocabulary, comprehension, and other listed areas.

**B. General Awareness**

Organize the listed topics into manageable categories, such as history, geography, polity, science, defence awareness, sports, culture, and current affairs, only where supported by the syllabus or suitable verified learning materials.

**C. Numerical Ability**

Organize the actual syllabus topics into clear subtopics. Provide formula references, worked examples, and practice problems.

**D. Reasoning and Military Aptitude**

Organize the syllabus into relevant reasoning and aptitude subtopics. Include practice questions with explanations.

**E. EKT**

If enabled, provide the technical syllabus relevant to the student's selected stream. The supplied document mentions streams including Computer Science and Engineering, Electronics, and Mechanical Engineering.

Do not assume which technical stream Jayakumar is pursuing. Allow him to choose one if EKT is enabled.

### AFCAT learning features

For every subject and subtopic, provide:

- Topic overview.
- Key concepts.
- Study-material links or viewers.
- Practice questions.
- Answer explanations.
- Revision checklist.
- Bookmark option.
- Topic completion tracking.
- Difficulty selection: Easy, Medium, and Hard.
- Practice history.

Use the actual syllabus structure from the PDF instead of creating an unrelated generic syllabus.

---

## 7. TNPSC Group 4 Dashboard – Swathisri B A

Use the supplied TNPSC Group 4 syllabus and scheme-of-examination PDF as the primary source.

### TNPSC Group 4 examination structure

According to the supplied document:

- One objective-type examination paper.
- 200 questions.
- 3 hours.
- 300 maximum marks.
- Part A: Tamil Eligibility-cum-Scoring Test, 100 questions and 150 marks.
- Part B: General Studies, 75 questions, and Aptitude and Mental Ability, 25 questions, totalling 100 questions and 150 marks.
- The document specifies a minimum qualifying score of 60/150 in Part A and states that Part B is not evaluated if the minimum qualifying mark in Part A is not achieved.

Display these rules clearly in the examination overview and mock-test instructions.

Treat the supplied PDF as the source of truth. If the official examination scheme changes, flag the discrepancy for verification instead of silently replacing the supplied information.

### TNPSC subjects

**A. Tamil Eligibility-cum-Scoring Test**

Create a separate Tamil preparation section.

- Follow the actual Tamil syllabus and its listed units.
- Preserve Tamil script and Unicode characters correctly.
- Organize lessons by the syllabus units and subtopics.
- Include grammar, literature, authors, works, meanings, and other categories only where supported by the supplied syllabus and materials.
- Support Tamil questions, Tamil answer options, explanations, and notes.
- Use readable Tamil fonts and sufficient spacing.

**B. General Studies**

Organize the actual syllabus topics into their listed units and subtopics.

Where the syllabus supports them, provide structured sections for general science, geography, history, Indian polity, Indian economy, Indian national movement, Tamil Nadu history and culture, development administration, and current affairs.

Do not add unsupported topics as if they were official syllabus items.

**C. Aptitude and Mental Ability**

Organize the topics listed in the supplied PDF into individual practice sections.

Provide simple explanations, formulas, worked examples, and practice questions for the relevant numerical and reasoning topics.

### TNPSC learning features

For every subject and subtopic, provide:

- Syllabus coverage.
- Topic explanations.
- Study-material links or viewers.
- Daily practice.
- Subject-wise tests.
- Timed mock tests.
- Tamil-language support.
- Answer explanations.
- Revision lists.
- Bookmarks and notes.
- Completion tracking.

Make the Tamil preparation section particularly easy to navigate.

---

## 8. Study Materials Integration

The application must use the files inside the `study-materials/` folder wherever they are available.

### During development

1. Inspect the folders and identify available files.
2. Read the supplied syllabus PDFs and extract the syllabus topics accurately.
3. Organize extracted topics into structured data, such as JavaScript objects or JSON.
4. Use that structured data to populate the syllabus pages.
5. Where practical, extract study notes and questions from the available materials.
6. Keep a record of the source file for each extracted question, explanation, or study note.
7. Display a clear message when a subject has no uploaded study materials.

If a PDF contains scanned pages, use OCR or another appropriate extraction method where available. If content cannot be extracted reliably, flag it for manual review instead of inventing its contents.

### During application use

Provide an organized study-material library where users can:

- Browse by examination.
- Browse by subject.
- Browse by topic.
- Open supported PDFs in an embedded viewer or a new tab.
- Download available files where permitted.
- Search by material title.
- See which materials belong to each subject.

If a file is missing, show a helpful empty state.

Do not claim that a file was successfully processed when it was not.

### Adding new files later

Design the project so additional materials can be integrated without rewriting the entire application.

If new files are added to the project directory, provide clear instructions for rebuilding or redeploying the application if necessary.

If a browser-based upload interface is implemented, explain whether uploaded files are only temporarily previewed, saved locally, or stored remotely.

A frontend-only application cannot automatically access arbitrary files on the user's computer without the user selecting them or granting the relevant browser permission.

---

## 9. Daily Practice Questions

Implement a dedicated Daily Practice section for each student.

Requirements:

- Display the day and date.
- Allow users to start a daily practice session.
- Select questions from the correct examination and subject.
- Provide a configurable number of questions, including a 50-question practice option.
- Include a mixture of appropriate difficulty levels.
- Support multiple-choice answers.
- Provide a Submit Answer button.
- Display the correct answer and explanation after submission.
- Track correct answers, incorrect answers, unanswered questions, and accuracy.
- Save completed sessions.
- Provide a review of incorrect answers.
- Include a revision option for previously incorrect questions.
- Avoid repeating questions excessively when a sufficiently large verified question bank is available.
- Show a completion summary.

A user should be able to return to an unfinished session when practical.

Daily questions must be based on the appropriate syllabus and available, verified materials.

If the question bank is limited, explain that the available question set is limited. Do not create false claims about having a large verified question bank.

---

## 10. Subject-wise Practice

Create an interactive practice system for every subject and subtopic.

Include:

- Subject selection.
- Topic selection.
- Number of questions.
- Difficulty selection.
- Optional timer.
- Multiple-choice questions.
- Answer submission.
- Correct answer.
- Detailed explanation.
- Previous and next navigation.
- Question bookmarking.
- Incorrect-answer review.
- Session summary.
- Practice history.

Allow the user to practise one topic at a time or select multiple topics.

Questions must not be mixed between AFCAT and TNPSC.

Do not label a question as a previous-year examination question unless the source confirms its origin.

Clearly distinguish verified previous-year questions, questions extracted from study materials, and newly generated practice questions.

---

## 11. Mock Tests

Create full-length and custom mock tests for both examinations.

### AFCAT mock tests

- Support the examination pattern described in the supplied AFCAT PDF.
- Provide a 100-question, 120-minute mock test when a complete suitable question bank is available.
- Apply the specified +3 and -1 scoring scheme.
- Include question navigation, a countdown timer, answered/unanswered indicators, and final submission.
- Include EKT separately when enabled.

### TNPSC Group 4 mock tests

- Support the 200-question, 3-hour examination pattern described in the supplied document.
- Organize the questions according to the specified Part A and Part B structure.
- Include the 100-question Tamil section.
- Include 75 General Studies questions and 25 Aptitude and Mental Ability questions in Part B.
- Apply the supplied examination rules in the results and explanations.

### Mock-test functionality

Implement:

- Start test.
- Countdown timer.
- Question palette.
- Next and previous buttons.
- Mark for review.
- Clear response.
- Answered and unanswered indicators.
- Confirmation before final submission.
- Automatic submission when the timer expires.
- Results and score breakdown.
- Accuracy by subject.
- Incorrect-answer review.
- Save attempt history.

Never present a short sample test as a complete full-length examination. If a complete question bank is not available, label the test as a sample or partial mock test.

---

## 12. Interactive General Knowledge Facts

Create a visually appealing **GK Fact of the Day** section.

Include:

- One featured fact.
- Category labels.
- Short explanations.
- Next Fact button.
- Previous Fact button where practical.
- Save to Favourites.
- Share or copy functionality where supported.
- Related practice questions where available.

Support relevant categories such as history, geography, science, polity, defence, Tamil Nadu, and current affairs, as appropriate to the selected examination.

Facts must be accurate and traceable to reliable materials where practical.

For time-sensitive current affairs, display the publication or event date and identify the source. Do not fabricate today's news or imply that static facts are live updates.

If no live news service or external data source is connected, label the section as a curated learning resource rather than a live current-affairs feed.

---

## 13. Study Planner and Calendar

Create a personal study planner for each student.

Features:

- Monthly calendar.
- Daily study tasks.
- Add, edit, and delete tasks.
- Subject selection.
- Topic selection.
- Planned study duration.
- Priority selection.
- Task completion checkbox.
- Upcoming tasks.
- Overdue tasks.
- Completed-task history.
- Daily study goals.
- Weekly study summary.
- Study streaks based on actual recorded activity.

Allow the user to create a realistic preparation schedule.

Example tasks:

- Revise Tamil grammar.
- Practise numerical ability.
- Complete an English vocabulary session.
- Review General Studies notes.
- Attempt a timed quiz.

The examples are suggestions only; users must be able to edit them.

Ensure that calendar dates, event text, buttons, and labels remain readable.

---

## 14. Notes, Bookmarks, and Revision

Create separate notes and bookmarks for each profile.

### Personal notes

Allow users to:

- Create notes.
- Edit notes.
- Delete notes.
- Add a title.
- Add subject and topic tags.
- Search notes.
- Sort notes.
- Save important formulas or facts.
- Attach a reference to an available study material.

### Bookmarks

Allow users to bookmark:

- Questions.
- Study notes.
- Syllabus topics.
- General Knowledge facts.
- Study materials.

Create a dedicated Bookmarks page.

### Revision

Provide:

- Incorrect questions.
- Saved questions.
- Recently studied topics.
- Topics marked for revision.
- A revision checklist.
- A way to retry incorrect questions.

Keep all personal content associated with the correct student profile.

---

## 15. Progress Tracking and Analytics

Create a meaningful progress dashboard based on actual application activity.

Track:

- Questions attempted.
- Correct answers.
- Incorrect answers.
- Accuracy percentage.
- Subject-wise accuracy.
- Topic-wise performance.
- Mock-test scores.
- Time spent studying, where measurable.
- Topics completed.
- Topics remaining.
- Study tasks completed.
- Recent activity.
- Revision progress.

Use readable charts and progress bars.

Every chart must have visible titles, axis labels, legends, and readable text. Avoid tiny labels, low contrast, overlapping values, or confusing colour combinations.

Calculate statistics correctly.

For example:

Accuracy percentage = (Correct answers / Attempted questions) × 100.

Handle cases where no questions have been attempted.

Do not fill the dashboard with randomly generated scores or fabricated study histories.

---

## 16. Chatbox and Study Assistant

Create a study assistant available inside both dashboards.

It should help users navigate the application and find available learning resources.

Suggested functions:

- Explain how to use the dashboard.
- Help find a subject or syllabus topic.
- Recommend relevant materials that are actually available.
- Explain the structure of the examination.
- Help locate bookmarked questions.
- Provide revision suggestions based on recorded performance.
- Answer questions using available, extracted study content where feasible.

The assistant must respect the active student's examination and must not mix the AFCAT and TNPSC syllabuses.

### Technical limitation

This project is frontend-first.

Do not pretend that a static chatbot is a real AI assistant or that it has access to live internet data.

If no AI API or backend is configured, implement a helpful rule-based assistant with clearly defined capabilities.

If an AI-powered assistant is added later, use a secure backend to protect API credentials. Never expose secret API keys in frontend JavaScript.

A local chatbot can answer only from the content and rules made available to it. Clearly communicate this limitation to users.

---

## 17. Data Persistence

Use browser LocalStorage or IndexedDB for local persistence in the frontend-only version.

Save and restore:

- Selected profile.
- Study preferences.
- Completed questions.
- Quiz and mock-test attempts.
- Progress statistics.
- Notes.
- Bookmarks.
- Study planner tasks.
- Revision lists.
- Daily practice history.

Requirements:

- Data should remain available after refreshing the page.
- Changes should be saved reliably.
- Data for Jayakumar and Swathisri must remain separate.
- Provide clear empty states when no data exists.
- Handle missing or malformed stored data gracefully.
- Provide an option to reset the current profile's progress with confirmation.
- If appropriate, provide JSON export and import for personal backup.

**Important:** LocalStorage data is stored in the browser on the current device. It does not automatically synchronize between devices or browsers.

If cross-device synchronization, shared chat history, or cloud backups are required, explain that a backend service such as Firebase or Supabase is needed. Do not claim cloud synchronization exists unless it has actually been implemented.

---

## 18. Search and Navigation

Create a global search feature that searches the content available to the current profile.

Where supported, search:

- Subjects.
- Syllabus topics.
- Study materials.
- Notes.
- Bookmarks.
- Saved questions.

Include clear navigation to:

- Dashboard.
- Syllabus.
- Study Materials.
- Daily Practice.
- Subject Practice.
- Mock Tests.
- GK Facts.
- Study Planner.
- Notes.
- Bookmarks.
- Progress.
- Study Assistant.
- Settings.

Use a responsive sidebar, top navigation, or another consistent layout.

On mobile devices, ensure that navigation does not cover the main content or create horizontal overflow.

Every visible navigation item must lead to a functioning page or section.

---

## 19. Technical Requirements

Build the application primarily using:

- HTML5.
- CSS3.
- Vanilla JavaScript.
- JSON or JavaScript objects for structured syllabus and question data.

Use external libraries only when they offer a clear benefit and can be included reliably.

Recommended implementation principles:

- Modular, readable code.
- Reusable components or functions.
- Clear separation of UI, data, quiz logic, progress, notes, and planner functionality.
- Consistent naming.
- Error handling.
- Safe rendering of user-entered text.
- Semantic HTML.
- Responsive CSS.
- Reliable event handling.
- No unnecessary dependencies.

Avoid creating a single enormous JavaScript file if modular files are practical.

Do not leave nonfunctional placeholder buttons, fake loading animations, empty pages presented as complete features, or unfinished navigation.

If a requested feature cannot be implemented in a frontend-only architecture, explain the limitation and provide the best working frontend alternative.

---

## 20. Data Accuracy and Question Quality

Accuracy is more important than the number of questions.

Follow these rules:

1. Use the supplied PDFs as the primary reference for syllabus structure and examination patterns.
2. Do not invent syllabus units and claim they came from the official PDFs.
3. Do not fabricate previous-year questions.
4. Do not fabricate source citations or claim that a fact has been verified when it has not.
5. Give each sourced question a source reference when available.
6. Mark newly written practice questions as practice questions, not official previous-year questions.
7. Provide answer explanations where reliable information is available.
8. Flag uncertain or incomplete content for review.
9. Preserve the original meaning of extracted study materials.
10. Preserve Tamil characters and Unicode formatting.
11. Avoid duplicate questions where possible.
12. Make the question data easy to expand later.

Each question should use a consistent structure similar to:

```json
{
  "id": "unique-question-id",
  "exam": "TNPSC_GROUP_4",
  "subject": "Tamil",
  "topic": "Syllabus topic",
  "question": "Question text",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctAnswer": 0,
  "explanation": "Explanation based on a reliable source",
  "difficulty": "Easy",
  "sourceType": "study_material",
  "sourceReference": "Source filename or page, if available"
}
```

Treat this as an example data structure. Adapt it to the actual syllabus and available source content.

Ensure that answer indexing, scoring, and displayed explanations are consistent.

---

## 21. Testing and Quality Assurance

After implementation, test the application systematically.

### Profile selection

- Jayakumar opens the AFCAT dashboard.
- Swathisri opens the TNPSC Group 4 dashboard.
- Switching profiles does not mix their data.
- Returning to the landing page works.

### Syllabus and materials

- Syllabus sections match the supplied PDFs.
- Available files can be opened correctly.
- Missing files display a useful message.
- Tamil text renders correctly.
- Additional materials can be integrated without rebuilding the entire application.

### Practice and mock tests

- Questions and answer options display correctly.
- Correct answers are evaluated correctly.
- Incorrect answers are evaluated correctly.
- AFCAT and TNPSC scoring rules are applied correctly.
- Timers and question navigation work.
- Full-length tests are not falsely represented by short question sets.
- Results are saved.

### Planner, notes, and progress

- Tasks can be added, edited, completed, and deleted.
- Notes can be created and edited.
- Bookmarks persist after refresh.
- Progress is calculated from real activity.
- Each profile has independent data.

### UI/UX

- Text is readable everywhere.
- Font family is Times New Roman.
- No text is smaller than 16px.
- Calendar dates are visible.
- Chart labels and legends are visible.
- Buttons are functional.
- No content overlaps or gets clipped.
- Desktop and mobile layouts work.
- No horizontal overflow occurs unnecessarily.
- Keyboard navigation and focus states work.

Fix discovered issues before declaring the application complete.

---

## 22. Development Workflow

Work in the following order:

### Phase 1: Inspect and prepare

- Inspect the project directory.
- Locate the supplied AFCAT and TNPSC syllabus PDFs.
- Inspect the study-materials folders.
- Extract and organize the syllabus structure.
- Identify missing materials.

### Phase 2: Build the core application

- Create the landing page.
- Implement profile selection.
- Build the two separate dashboards.
- Implement responsive navigation and the design system.

### Phase 3: Integrate syllabus and study materials

- Populate the actual syllabus.
- Create subject and topic pages.
- Connect available PDFs and study resources.
- Provide empty states for missing materials.

### Phase 4: Implement learning features

- Daily practice.
- Subject-wise practice.
- Question review.
- Mock tests.
- GK facts.
- Notes and bookmarks.
- Study planner.
- Revision tools.
- Chatbox.

### Phase 5: Implement data persistence and analytics

- Save student-specific activity.
- Calculate progress.
- Add performance charts.
- Implement backup or export where appropriate.

### Phase 6: Test and refine

- Test all navigation and interactions.
- Verify syllabus and question accuracy.
- Check scoring and timers.
- Improve readability.
- Fix bugs.
- Verify responsive behaviour.

Complete the phases within the existing project instead of generating disconnected demonstrations for each feature.

---

## 23. Final Deliverables

When finished, provide:

1. Complete working source code.
2. All required HTML, CSS, JavaScript, and data files.
3. A clear README.md.
4. Instructions to run the application locally.
5. Instructions for adding more study materials.
6. A list of features that are fully implemented.
7. A list of features that require a backend or external service.
8. A summary of the actual syllabus files successfully inspected and integrated.
9. A summary of the available question-bank size, distinguishing verified questions from newly written practice questions.
10. A testing checklist showing what was actually tested and any remaining issues.
11. Deployment instructions suitable for a static frontend application, if compatible with the final implementation.

Do not claim that tests passed unless they were actually run.

Do not claim that the website is deployed unless a working deployment has been completed.

## Final Instruction

Build a polished, practical, expandable exam-preparation platform that Jayakumar and Swathisri can use every day.

Prioritize correct syllabus coverage, high-quality practice, readable design, reliable functionality, profile separation, and accurate progress tracking over decorative features.

Start by inspecting the project and available syllabus PDFs. Then implement the complete application in the existing project, testing each major feature as you proceed.