type Student = {
  studentId: number;
  fullName: string;
  className: string;
  classSection: string;
  schoolLevel?: string | null;
  LRN: string | null;
  sex: string | null;
  age: number | null;
  subjects: {
    name: string;
    grades: number | null;
    quarter: number | null;
  }[];
};

type SubjectMapEntry = {
  name: string;
  grades: Record<string, number | string>;
};

// Collect each subject's quarterly grades into a lookup map for one student.
function groupSubjectsByQuarter(student: Student) {
  const subjectMap = new Map<string, SubjectMapEntry>();

  for (const sub of student.subjects) {
    if (!subjectMap.has(sub.name)) {
      subjectMap.set(sub.name, { name: sub.name, grades: {} });
    }

    const subjectData = subjectMap.get(sub.name);
    if (subjectData && sub.quarter && sub.grades !== null) {
      subjectData.grades[`Q${sub.quarter}`] = sub.grades;
    }
  }

  return subjectMap;
}

// Compute the subject average from Q1-Q3 and return the pass/fail status.
function computeAverageAndStatus(grades: Record<string, number | string>) {
  const q1 = grades.Q1 ? parseFloat(String(grades.Q1)) : null;
  const q2 = grades.Q2 ? parseFloat(String(grades.Q2)) : null;
  const q3 = grades.Q3 ? parseFloat(String(grades.Q3)) : null;

  if (q1 === null || q2 === null || q3 === null) {
    return { average: "-", status: "-" };
  }

  const average = ((q1 + q2 + q3) / 3).toFixed(2);
  const status = parseFloat(average) >= 75 ? "PASS" : "FAIL";

  return { average, status };
}

// Render the grade table rows for a single student.
function renderSubjectGradeRows(student: Student) {
  const subjectMap = groupSubjectsByQuarter(student);

  return Array.from(subjectMap.values())
    .map(subject => {
      const { average, status } = computeAverageAndStatus(subject.grades);

      return `
        <tr>
          <td>${subject.name}</td>
          <td>${subject.grades.Q1 ?? "-"}</td>
          <td>${subject.grades.Q2 ?? "-"}</td>
          <td>${subject.grades.Q3 ?? "-"}</td>
          <td>${average}</td>
          <td class="${status === "PASS" ? "status-pass" : status === "FAIL" ? "status-fail" : ""}">${status}</td>
        </tr>
      `;
    })
    .join("");
}

// Render one complete student page with identity details, grades, and remarks.
function renderStudentPage(student: Student) {
  const subjectTableRows = renderSubjectGradeRows(student);

  return `
    <main class="main">
      <div class="sheet">
        <article id="header">
          <img src="https://th.bing.com/th/id/OIP.pyCJLlr1nrBCaHdOdKXbbAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" alt="School logo" class="header-logo">
          <div class="header-content">
            <span class="eyebrow">Republic of the Philippines</span>
            <p>Department of Education</p>
            <span class="subtext">Learner record and enrollment information</span>
          </div>
        </article>

        <article class="school-block">
          <h1 class="school-name">Abang-Suizo Integrated School</h1>
          <div class="school-meta">
            <p>School ID: <span>123313</span></p>
            <span>Tacurong sultan kudarat</span>
            <span class="school-level">${String(student.schoolLevel ?? "").toUpperCase()}</span>
          </div>
        </article>

        <article class="program-block">
          <div class="program-track">Enhanced Basic Educational Program</div>
          <div class="program-item">LRN: ${student.LRN}</div>
        </article>

        <article class="student-card">
          <div class="student-grid">
            <div class="field wide-field"><strong>Name</strong><span>${student.fullName.toUpperCase()}</span></div>
            <div class="field"><strong>Sex</strong><span>${student.sex}</span></div>
            <div class="field"><strong>Age</strong><span>${student.age}</span></div>
            <div class="field"><strong>Grade</strong><span>${student.className}</span></div>
            <div class="field"><strong>Section</strong><span>${student.classSection}</span></div>
          </div>
        </article>

        <article class="grades-table">
          <h2>Subject Grades</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Average</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${subjectTableRows}
            </tbody>
          </table>
        </article>

        <article class="note-card">
          <h2>Remarks</h2>
          <p>The learner consistently participates in class discussions, submits requirements on time, and shows respectful behavior toward teachers and classmates. Continued support in Mathematics and regular home review are recommended to further improve performance.</p>
          <div class="paper-lines"></div>
        </article>
      </div>
    </main>
  `;
}

// Wrap all student pages in the final PDF HTML document.
function renderPdfDocument(rows: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Grade Reports Record</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <style>
      :root {
        color-scheme: light;
        --paper: #ffffff;
        --ink: #111111;
        --muted: #303030;
        --line: #6f6f6f;
        --line-soft: #b5b5b5;
        --page-bg: #efefef;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        min-height: 100%;
        color: var(--ink);
        font-family: "Times New Roman", Times, serif;
      }

      @media print {
        .main {
          page-break-before: always;
        }
      }

      @page {
        size: A4;
        margin: 12mm;
      }

      main {
        width: min(210mm, 100%);
        margin: 0 auto;
        background: var(--paper);
      }

      .sheet {
        padding: 12mm;
      }

      h1,
      h2,
      p {
        margin: 0;
      }

      #header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        padding-bottom: 8px;
        margin-bottom: 10px;
        border-bottom: 1.5px solid var(--line);
      }

      .header-logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
      }

      .header-content {
        text-align: center;
        line-height: 1.15;
      }

      .header-content .eyebrow,
      .header-content .subtext {
        display: block;
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .header-content .subtext {
        color: var(--muted);
        margin-top: 2px;
      }

      .school-block {
        display: grid;
        place-items: center;
        text-align: center;
        margin-bottom: 10px;
      }

      .school-name {
        font-size: 1.5rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        line-height: 1.1;
      }

      .school-meta {
        margin-top: 4px;
        font-size: 12px;
        display: grid;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
        color: var(--muted);
      }

      .school-meta span {
        min-width: 100px;
        text-align: center;
        padding-bottom: 1px;
      }

      .school-level {
        font-weight: 600;
        font-size: 1rem;
      }

      .program-track {
        font-weight: 600;
        font-size: 1.2rem;
      }

      .enrollment-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
        text-align: center;
        align-items: center;
      }

      .enrollment-item {
        display: inline;
        font-size: 12px;
        line-height: 1.4;
      }

      .enrollment-item:last-child {
        border-bottom: 0;
      }

      .enrollment-item strong {
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: none;
        color: var(--ink);
        font-weight: 600;
      }

      .enrollment-item span {
        text-align: center;
        font-weight: 600;
        min-width: 0;
      }

      .program-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
        text-align: center;
        align-items: center;
      }

      .program-item {
        display: inline;
        font-size: 12px;
        line-height: 1.4;
      }

      .student-card,
      .note-card {
        background: var(--paper);
        padding: 8px;
      }

      .student-title,
      .note-card h2 {
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-bottom: 1px solid var(--line-soft);
        padding-bottom: 4px;
        margin-bottom: 6px;
      }

      .stack {
        display: grid;
        gap: 2px;
      }

      .label-row,
      .field {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        gap: 6px;
        padding: 3px 0;
        border-bottom: 1px dotted var(--line-soft);
        font-size: 12px;
        min-height: 22px;
      }

      .label-row:last-child,
      .field:last-child {
        border-bottom: 0;
      }

      .label-row span:first-child,
      .field strong {
        font-size: 10px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--muted);
        flex: 0 0 auto;
        font-weight: 700;
      }

      .label-row span:last-child,
      .field span {
        text-align: left;
        font-weight: 600;
        min-width: 0;
        border-bottom: 0;
        padding-bottom: 0;
      }

      .student-card {
        margin-bottom: 10px;
      }

      .student-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px 12px;
      }

      .wide-field {
        grid-column: 1 / -1;
      }

      .note-card {
        min-height: 110px;
      }

      .note-card p {
        display: block;
        font-size: 12px;
        line-height: 1.4;
        margin-bottom: 6px;
      }

      .paper-lines {
        display: none;
      }

      .grades-table {
        margin-bottom: 10px;
        padding: 8px;
        background: var(--paper);
      }

      .grades-table h2 {
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-bottom: 1px solid var(--line-soft);
        padding-bottom: 4px;
        margin-bottom: 8px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }

      table thead {
        background-color: var(--line-soft);
      }

      table th {
        padding: 6px;
        text-align: left;
        font-weight: 700;
        border: 1px solid var(--line);
        color: var(--ink);
      }

      table td {
        padding: 6px;
        border: 1px solid var(--line-soft);
        text-align: center;
      }

      table tbody tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .status-pass {
        color: #22863a;
        font-weight: 700;
      }

      .status-fail {
        color: #cb2431;
        font-weight: 700;
      }

    </style>
    <body>
      ${rows}
    </body>
    </html>
  `;
}

// Build the full PDF-ready HTML string for every student in the report.
export default function generateGradePDF(result: Student[]) {
  const rows = result.map(renderStudentPage).join("");
  return renderPdfDocument(rows);
}