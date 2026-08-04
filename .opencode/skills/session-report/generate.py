import sqlite3
import json
import os
import subprocess
import sys

db_path = os.path.expanduser('~/.local/share/opencode/opencode.db')
project_dir = os.getcwd()
out_path = os.path.join(project_dir, '.temp', 'session_report.html')

try:
    git_out = subprocess.check_output(['git', 'log', '--format=%ct', '--all'], cwd=project_dir).decode('utf-8')
    commit_times = [int(x) for x in git_out.strip().split('\n') if x.strip()]
except Exception as e:
    print(f"Error fetching git commits: {e}")
    commit_times = []

# Hardcoded data map with added focus score and code types
session_data = {
    "Analyzing Opencode session metrics and abandonments": {
        "title": "Analyzing Opencode Session Metrics",
        "summary": "Requesting an analysis of all Opencode sessions, including token counts, status, and abandonment reasons.",
        "score": 7,
        "types": "Python, Markdown, SQLite"
    },
    "Favicon design ideas": {
        "title": "Favicon Design Ideas",
        "summary": "Generated and committed a new minimalist terminal favicon and PNG/ICO fallbacks for the project.",
        "score": 9,
        "types": "HTML, JSON, Images"
    },
    "Implementing dark mode toggle": {
        "title": "Dark Mode Toggle Implementation",
        "summary": "Added dark mode support to the site, including a navigation toggle and a CSS filter fix for the QR code.",
        "score": 6,
        "types": "CSS, JS"
    },
    "Kill running Hugo servers": {
        "title": "Kill Hugo Servers",
        "summary": "Stopped all background Hugo server processes.",
        "score": 10,
        "types": "CLI / Process"
    },
    "Testing plugin update": {
        "title": "Testing Plugin Update",
        "summary": "Initiated a test of a plugin update but was blocked by Plan Mode restrictions.",
        "score": 10,
        "types": "N/A"
    },
    "agent-browser skill opencode compatibility": {
        "title": "Agent-Browser Skill Troubleshooting",
        "summary": "Identified a typo in the directory structure (`skils` instead of `skills`) that prevented a skill from loading.",
        "score": 10,
        "types": "File System"
    },
    "Hide terminal cursor when not typing": {
        "title": "Hide Terminal Cursor Enhancements",
        "summary": "Updated header logic so the terminal cursor is hidden when the terminal is not actively simulating typing.",
        "score": 9,
        "types": "HTML, CSS"
    },
    "Terminal prompt spacing fix": {
        "title": "Terminal Prompt Spacing Fix",
        "summary": "Adjusted CSS gap properties to ensure consistent 1-character spacing between the terminal prompt and cursor.",
        "score": 9,
        "types": "CSS"
    },
    "Hugo deployment to GitHub Pages": {
        "title": "Hugo GitHub Actions CI",
        "summary": "Set up a GitHub Action workflow to automatically build and deploy the Hugo site to GitHub Pages.",
        "score": 9,
        "types": "YAML (GitHub Actions), Config"
    },
    "Fixing header layout shifts": {
        "title": "Header Layout Shifts Fix",
        "summary": "Added fixed widths to the avatar and emotion containers to prevent layout shifting during header animations.",
        "score": 9,
        "types": "CSS"
    },
    "Header layout shift on terminal close": {
        "title": "Header Reset Behavior Fix",
        "summary": "Refactored CSS to cleanly handle terminal close animations and resizing, stopping layout jumps.",
        "score": 9,
        "types": "CSS"
    },
    "Header animation scenes": {
        "title": "Header Animation Scenes Refactor",
        "summary": "Refactored header logic to include an isolated Scene Manager to handle a sequence of common programmer commands.",
        "score": 8,
        "types": "HTML, JS"
    },
    "Softening avatar eyes in header.html": {
        "title": "Soften Header Avatar Eyes",
        "summary": "Prevented terminal text overflow and adjusted avatar eye character representation for a softer look.",
        "score": 7,
        "types": "HTML, CSS"
    },
    "Delayed cursor blink in header.html": {
        "title": "Delayed Cursor Blink",
        "summary": "Changed the terminal close icon from a times symbol to a standard 'X' for better vertical alignment.",
        "score": 6,
        "types": "HTML"
    },
    "Hugo header ASCII art update": {
        "title": "Update Hugo Header ASCII Art",
        "summary": "Investigated injecting a custom ASCII art flip symbol into the Hugo 404 page template.",
        "score": 9,
        "types": "HTML"
    },
    "Update header icon to (┛ಠ_ಠ)┛": {
        "title": "Update Header Icon",
        "summary": "An incomplete session where the user requested an ASCII art update.",
        "score": 10,
        "types": "N/A"
    }
}

new_session_mappings = [
    ("I've noticed that my opencode sessions", "Opencode Session Titling Fix", "Upgraded `@opencode-ai/plugin` dependencies to fix an issue where sessions using antigravity models were not getting auto-titled.", 9, "JSON (NPM)"),
    ("I want to use javascript to add a function", "Console Logging & JS Expose", "Implemented a script that outputs a styled message to the DevTools console on load and exposes a `dev.legros` namespace function.", 8, "JS, HTML"),
    ("I've got the PDF version of my resume", "Web Scraper Privacy Concerns", "Discussed privacy concerns regarding phone numbers on the resume and how GitHub Pages handles website analytics.", 6, "Discussion"),
    ("Looking at the mobile view", "Mobile Header Enhancements", "Modified the header behavior on mobile so the avatar and terminal space are hidden until activated.", 9, "CSS, HTML"),
    ("I've added a better photo", "Update Headshot Image", "Updated the main page and resume page to use a new outdoor headshot image.", 9, "HTML, Markdown"),
    ("I'd like to enhance the behavior of the header", "Web Audio API for Header", "Discussed using the Web Audio API to play typing sounds for the terminal header and the browser autoplay policies.", 9, "Discussion"),
    ("Use the `antigravity_quota`", "Antigravity Quota Check", "Used the `antigravity_quota` tool to check API quota usage and limits across models.", 10, "CLI / Tool"),
    ("ok, I want to begin preparing this hugo site", "GitHub Pages Deployment Prep", "Investigated and fixed broken CSS and link paths caused by deploying the Hugo site to GitHub Pages.", 9, "Config, CSS"),
    ("let's create a new blog post", "Getting Started Blog Post", "Created a new initial blog post titled 'Getting started' under the `content/read` directory.", 10, "Markdown"),
    ("look at @assets/js/resume.js", "Refactor JS IIFEs", "Refactored Immediately Invoked Function Expressions (IIFEs) in `resume.js` into standard registered functions.", 9, "JS"),
    ("let's talk about robots.txt", "Robots.txt Optimization", "Configured and analyzed `robots.txt` to balance SEO visibility with AI agent scraping restrictions.", 9, "Config (Hugo.toml)"),
    ("I noticed that when Hugo starts up", "Fix Hugo Startup Warnings", "Fixed a deprecation warning in `hugo.toml` by migrating `languageCode` to the new `locale` configuration.", 10, "Config (Hugo.toml)"),
    ("On the home page, let's move the profile", "Profile Image CSS Background", "Migrated the profile image to a CSS background to deter automated scraping.", 10, "CSS"),
    ("I want to add content to the home page", "Home Page Content Setup", "Generated professional content and added an optimized circular profile image shortcode to the homepage.", 8, "HTML, Markdown"),
    ("Check the version of hugo", "Check Hugo & Theme Versions", "Verified that the installed versions of Hugo and the selected theme were up to date.", 10, "CLI / Tool"),
    ("let's flip the order of the nav", "Navigation Menu Updates", "Renamed the blog directory to `read`, updated permalinks, and flipped the navigation button order.", 8, "Config, HTML"),
    ("I'd like to enhance the resuling modal", "QR Code Modal Enhancements", "Fixed RSS XML overrides and adjusted the layout and size of the QR code modal on mobile breakpoints.", 5, "XML, CSS"),
    ("Take a look at the image @~/Pictures", "Make Headshot Transparent", "Processed a headshot image to remove the white background, converting it to a transparent PNG.", 10, "Image Processing"),
    ("I want to change the navigation bar", "Mobile Navigation Bar Layout", "Modified the mobile CSS media queries to evenly space the navigation buttons across the top of the screen.", 9, "CSS"),
    ("go through the CSS for the website", "CSS Rem Unit Consistency", "Fixed a page routing issue that occurred after renaming a folder, causing 404 errors. Did not focus on CSS rems.", 3, "HTML, Routing"),
    ("Right now the link to the RSS feed", "RSS Feed Link Update", "Changed the RSS feed link from `index.xml` to `rss.xml` and adjusted the terminal box border radius.", 5, "Config, CSS"),
    ("The copyright on the generate hugo", "Update Footer Copyright Year", "Fixed the site footer to dynamically generate the current copyright year and adjusted RSS icon sizing.", 5, "HTML, CSS"),
    ("Review my resume below and propose", "Resume Copy Editing", "Reviewed resume for spelling and grammar, but stopped before applying changes due to Plan Mode restrictions.", 10, "YAML, Markdown"),
    ("how do I set the default primary agent", "Override Default Agent Config", "Explored ways to override the default opencode startup agent via configuration files.", 9, "JSON (Config)"),
    ("give me a prompt for an opencode agent", "Custom Agent Prompt Formulation", "Designed a system prompt for a Technical Planning Agent that explicitly admits when it doesn't know an answer.", 9, "Markdown"),
    ("hello", "Agent Introduction", "Initial greeting where the agent introduced itself and its current context in the project.", 10, "Discussion"),
    ("I have an html snippet that uses", "Convert HTML to Hugo Partial", "Explained how to move standalone HTML/JS snippets into Hugo partials and use Hugo Pipes for asset management.", 9, "HTML, JS"),
    ("Please analyze this codebase and create", "Create AGENTS.md Guidelines", "Generated the `AGENTS.md` file containing build commands and style conventions for AI coding agents.", 9, "Markdown"),
    ("Terminal Header Animation", "Terminal Header Feature Request", "User provided a project overview for a reactive terminal header, but the session was interrupted.", 10, "Discussion")
]

try:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # Try to find project by worktree matching current dir
    cur.execute("SELECT id FROM project WHERE worktree = ?", (project_dir,))
    row = cur.fetchone()
    
    if not row:
        # Fallback to like match
        cur.execute("SELECT id FROM project WHERE worktree LIKE ?", (f'%{os.path.basename(project_dir)}%',))
        row = cur.fetchone()
        
    if not row:
        print(f"Could not find project matching {project_dir} in Opencode DB.")
        sys.exit(1)
        
    proj_id = row[0]
    
    cur.execute('''
        SELECT id, title, time_created, (tokens_input + tokens_output + tokens_reasoning) as total_tokens, time_updated
        FROM session 
        WHERE project_id = ? 
        ORDER BY time_created DESC
    ''', (proj_id,))
    
    sessions = cur.fetchall()
    
    processed_sessions = []
    
    for s in sessions:
        sid, title, tc, tokens, tu = s
        
        # Calculate number of commits
        start_t = tc / 1000.0 - 60
        end_t = tu / 1000.0 + 60
        commits_in_session = sum(1 for ct in commit_times if start_t <= ct <= end_t)
        
        cur.execute('SELECT id, data FROM message WHERE session_id = ? ORDER BY time_created ASC', (sid,))
        msgs = cur.fetchall()
        
        extracted_msgs = []
        for mid, mdata in msgs:
            try:
                m = json.loads(mdata)
                role = m.get('role', 'unknown')
            except:
                role = 'unknown'
            
            cur.execute('SELECT data FROM part WHERE message_id = ? ORDER BY time_created ASC', (mid,))
            parts = cur.fetchall()
            combined_text = ""
            for (pdata,) in parts:
                try:
                    p = json.loads(pdata)
                    if p.get('type') == 'text':
                        combined_text += p.get('text', '') + " "
                except:
                    pass
            if combined_text.strip():
                extracted_msgs.append((role, combined_text.strip()))
        
        final_title = title
        final_summary = "No summary available."
        final_score_num = 0
        final_types = "Unknown"
        
        if title in session_data:
            final_title = session_data[title]['title']
            final_summary = session_data[title]['summary']
            final_score_num = session_data[title]['score']
            final_types = session_data[title]['types']
        elif title.startswith("New session"):
            first_msg = next((text for role, text in extracted_msgs if role == 'user'), "")
            for pattern, p_title, p_summary, p_score, p_types in new_session_mappings:
                if pattern.lower() in first_msg.lower():
                    final_title = p_title
                    final_summary = p_summary
                    final_score_num = p_score
                    final_types = p_types
                    break
        
        if not extracted_msgs:
            status, reason = "Unknown", "No interactions found."
        else:
            last_role, last_text = extracted_msgs[-1]
            last_text_lower = last_text.lower()
            success_keywords = [
                'successfully', 'committed', 'updated', 'added', 
                'fixed', 'here is what was done', 'processed', 
                'implemented', 'generated', 'stopped', 'created'
            ]
            
            if last_role == 'assistant':
                if any(k in last_text_lower for k in success_keywords):
                    status, reason = "Successful", "Completed task"
                elif 'plan mode' in last_text_lower or 'read-only' in last_text_lower:
                    status, reason = "Abandoned", "Plan Mode blocked"
                else:
                    status, reason = "Successful", "Completed task"
            else:
                status, reason = "Abandoned", "User interrupted"
        
        # Determine title if still unknown (for truly new sessions)
        if final_title.startswith("New session"):
            first_msg = next((text for role, text in extracted_msgs if role == 'user'), "")
            if first_msg:
                final_title = first_msg[:57] + "..." if len(first_msg) > 60 else first_msg
        
        processed_sessions.append({
            "title": final_title,
            "summary": final_summary,
            "tokens": tokens,
            "score": final_score_num,
            "types": final_types,
            "status": status,
            "reason": reason,
            "commits": commits_in_session
        })
        
    abandoned = [s for s in processed_sessions if s['status'] == 'Abandoned']
    successful = [s for s in processed_sessions if s['status'] == 'Successful']
    
    def get_stats(group):
        valid_scores = [s['score'] for s in group if s['score'] > 0]
        avg_score = sum(valid_scores) / len(valid_scores) if valid_scores else 0
        avg_tokens = sum(s['tokens'] for s in group) / len(group) if group else 0
        avg_commits = sum(s['commits'] for s in group) / len(group) if group else 0
        return avg_score, avg_tokens, avg_commits
        
    ab_avg_score, ab_avg_tokens, ab_avg_commits = get_stats(abandoned)
    su_avg_score, su_avg_tokens, su_avg_commits = get_stats(successful)
    
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opencode Session Report: legros.dev</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1300px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #fafafa;
        }}
        h1 {{
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }}
        h2 {{
            color: #334155;
            margin-top: 2.5rem;
        }}
        .stats {{
            background: #ffffff;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }}
        .stats ul {{
            margin: 0;
            padding-left: 1.5rem;
        }}
        .stats li {{
            margin-bottom: 0.5rem;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            margin-bottom: 3rem;
        }}
        th, td {{
            text-align: left;
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }}
        th {{
            background-color: #f8fafc;
            font-weight: 600;
            color: #475569;
        }}
        tr:last-child td {{
            border-bottom: none;
        }}
        tr:hover {{
            background-color: #f1f5f9;
        }}
        .score {{
            font-weight: bold;
            color: #0284c7;
        }}
        .summary {{
            max-width: 300px;
        }}
    </style>
</head>
<body>
    <h1>Opencode Session Report: legros.dev</h1>

    <h2>{len(abandoned)} Abandoned Sessions</h2>
    <div class="stats">
        <ul>
            <li><strong>Average Focus Score:</strong> {ab_avg_score:.1f}/10</li>
            <li><strong>Average Tokens:</strong> {ab_avg_tokens:,.0f}</li>
            <li><strong>Average Commits:</strong> {ab_avg_commits:.1f}</li>
        </ul>
    </div>
    <table>
        <thead>
            <tr>
                <th>Session Title</th>
                <th>Summary</th>
                <th>Total Tokens</th>
                <th>Focus Score</th>
                <th>Code Types</th>
                <th># of Commits</th>
                <th>Reason / Notes</th>
            </tr>
        </thead>
        <tbody>
"""

    for p in abandoned:
        score_str = f"<span class='score'>{p['score']}/10</span>" if p['score'] > 0 else "N/A"
        html_template += f"""
            <tr>
                <td>{p['title']}</td>
                <td class="summary">{p['summary']}</td>
                <td>{p['tokens']:,}</td>
                <td>{score_str}</td>
                <td>{p['types']}</td>
                <td>{p['commits']}</td>
                <td>{p['reason']}</td>
            </tr>"""

    html_template += f"""
        </tbody>
    </table>

    <h2>{len(successful)} Successful Sessions</h2>
    <div class="stats">
        <ul>
            <li><strong>Average Focus Score:</strong> {su_avg_score:.1f}/10</li>
            <li><strong>Average Tokens:</strong> {su_avg_tokens:,.0f}</li>
            <li><strong>Average Commits:</strong> {su_avg_commits:.1f}</li>
        </ul>
    </div>
    <table>
        <thead>
            <tr>
                <th>Session Title</th>
                <th>Summary</th>
                <th>Total Tokens</th>
                <th>Focus Score</th>
                <th>Code Types</th>
                <th># of Commits</th>
                <th>Reason / Notes</th>
            </tr>
        </thead>
        <tbody>
"""

    for p in successful:
        score_str = f"<span class='score'>{p['score']}/10</span>" if p['score'] > 0 else "N/A"
        html_template += f"""
            <tr>
                <td>{p['title']}</td>
                <td class="summary">{p['summary']}</td>
                <td>{p['tokens']:,}</td>
                <td>{score_str}</td>
                <td>{p['types']}</td>
                <td>{p['commits']}</td>
                <td>{p['reason']}</td>
            </tr>"""

    html_template += """
        </tbody>
    </table>
</body>
</html>
"""

    # Ensure .temp directory exists
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, 'w') as f:
        f.write(html_template)
            
    print(f"Report successfully updated at {out_path}")
    
except Exception as e:
    import traceback
    traceback.print_exc()
