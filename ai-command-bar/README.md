# AI Command Bar

## What is this UI pattern?
A popup search box that opens with a keyboard shortcut (Ctrl+K). The user types to find commands or pages, or asks the AI a question in plain language.

## Where is it commonly used?
Linear, Notion, Raycast, VS Code, Slack and GitHub.

## Why is it relevant to modern web interfaces?
It lets power users do things quickly without clicking through menus. With AI, the same box can also answer questions in natural language.

## Design and interaction patterns I observed
- Opens with a keyboard shortcut and closes with Esc
- Results are filtered instantly as you type
- Results are grouped (Actions, Pages, Ask AI)
- Arrow keys move through results and Enter selects
- Dimmed background behind a centered popup

## What my implementation does differently
- Simulated "Ask AI" answer when nothing matches
- Recent actions list
- Dark and light theme
- Responsive layout
- Plain HTML, CSS and JavaScript only

## Technologies
HTML5, CSS3, JavaScript

## How to run
Open `index.html` in a browser and press Ctrl+K.