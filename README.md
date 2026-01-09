<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Expense Tracker Web Application</title>

    <style>
        :root {
            --primary: #4f46e5;
            --secondary: #6366f1;
            --bg: #f4f6fb;
            --card: #ffffff;
            --text: #1f2937;
            --muted: #6b7280;
            --accent: #22c55e;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px 16px;
            font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #eef2ff, #f8fafc);
            color: var(--text);
        }

        .container {
            max-width: 900px;
            margin: auto;
            background: var(--card);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
        }

        h1 {
            font-size: 36px;
            color: var(--primary);
            margin-bottom: 10px;
        }

        h2 {
            margin-top: 40px;
            font-size: 26px;
            color: var(--secondary);
            border-left: 5px solid var(--primary);
            padding-left: 12px;
        }

        h3 {
            margin-top: 20px;
            font-size: 20px;
            color: var(--text);
        }

        p {
            font-size: 16px;
            color: var(--muted);
        }

        ul, ol {
            margin-left: 24px;
        }

        li {
            margin: 8px 0;
            font-size: 15px;
        }

        .badge {
            display: inline-block;
            background: var(--accent);
            color: white;
            padding: 4px 10px;
            font-size: 12px;
            border-radius: 999px;
            margin-right: 6px;
        }

        .card {
            background: #f9fafb;
            border-radius: 12px;
            padding: 20px;
            margin-top: 16px;
        }

        pre {
            background: #0f172a;
            color: #e5e7eb;
            padding: 18px;
            border-radius: 12px;
            overflow-x: auto;
            font-size: 14px;
        }

        code {
            background: #eef2ff;
            color: #4338ca;
            padding: 3px 6px;
            border-radius: 6px;
            font-size: 14px;
        }

        footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: var(--muted);
            font-size: 14px;
        }

        .highlight {
            font-weight: 600;
            color: var(--primary);
        }
    </style>
</head>
<body>

<div class="container">

    <h1>💰 Expense Tracker Web Application</h1>
    <p>
        A modern and user-friendly <span class="highlight">Expense Tracker Web Application</span>
        built using <span class="highlight">HTML, CSS, and JavaScript</span>.
        It helps users manage expenses, track spending habits, and organize tasks
        using <span class="highlight">browser localStorage</span>.
    </p>

    <h2>🚀 Features</h2>

    <div class="card">
        <h3>✅ Expense Management</h3>
        <ul>
            <li>Add expenses with amount, category, description, and date</li>
            <li>Edit and delete expenses</li>
            <li>View expenses in a clean tabular format</li>
        </ul>
    </div>

    <div class="card">
        <h3>🌍 Multi-Currency Support</h3>
        <ul>
            <li>Supports USD, INR, EUR, GBP, JPY, AUD, CAD, CNY</li>
            <li>Dynamic currency symbol formatting</li>
            <li>Currency preference saved automatically</li>
        </ul>
    </div>

    <div class="card">
        <h3>📊 Expense Summary</h3>
        <ul>
            <li>Total and category-wise calculations</li>
            <li>Clear financial overview</li>
        </ul>
    </div>

    <div class="card">
        <h3>📝 Notes & 🧾 To-Do</h3>
        <ul>
            <li>Create and manage notes</li>
            <li>Add, complete, and remove to-do tasks</li>
        </ul>
    </div>

    <h2>🛠️ Tech Stack</h2>
    <ul>
        <li><span class="badge">HTML5</span> Structure</li>
        <li><span class="badge">CSS3</span> Styling</li>
        <li><span class="badge">JavaScript</span> Logic</li>
        <li><span class="badge">LocalStorage</span> Persistence</li>
    </ul>

    <h2>📁 Project Structure</h2>
    <pre>
Expense-Tracker-main/
│
├── index.html        - Add expenses
├── expenses.html     - View expenses
├── edit.html         - Edit expense
├── summary.html      - Expense summary
├── todo.html         - To-do list
├── notes.html        - Notes
│
├── style.css         - Styles
├── script.js         - Logic
│
└── README.html       - Documentation
    </pre>

    <h2>⚙️ How to Run</h2>
    <ol>
        <li>Download or clone the project</li>
        <li>Open the folder</li>
        <li>Launch <code>index.html</code> in a browser</li>
    </ol>

    <h2>🌱 Future Enhancements</h2>
    <ul>
        <li>Monthly and yearly reports</li>
        <li>Graphs and charts</li>
        <li>Export to PDF / CSV</li>
        <li>Authentication & backend integration</li>
    </ul>

    <footer>
        <p><strong>Author:</strong> Chaitanya Reddy Munnangi </p>
        <p>Student | Aspiring Software Developer</p>
        <p>Open-source project for learning & personal use</p>
    </footer>

</div>

</body>
</html>
