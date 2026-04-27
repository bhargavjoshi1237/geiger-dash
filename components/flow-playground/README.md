# Geiger Flow Playground

This directory contains a complete copy of the Geiger Flow project interface for use as an interactive demo on the Geiger Dash homepage.

## Structure

```
flow-playground/
├── addons/              # Addon system (SQL, etc.)
├── context/             # React context providers with demo data
├── screens/             # All project screens (Overview, Tasks, Issues, etc.)
├── sidebar/             # Project sidebar navigation
├── topbar/              # Project topbar
└── FlowPlayground.jsx   # Main playground component
```

## Features

- **Full Project Interface**: Complete Geiger Flow project page with all screens
- **Demo Data**: Pre-populated with mock project data for demonstration
- **Interactive**: Fully functional navigation between different project views
- **Standalone**: Self-contained with all dependencies copied over

## Screens Included

- Overview (Project Details)
- Issues (Workflows)
- Tasks
- Goals
- Objectives
- Milestones
- Planning
- Projections
- Team
- Vault
- Assets
- Logs
- Security
- Settings

## Usage

The playground is embedded in the homepage at `/app/page.js`:

```jsx
import { FlowPlayground } from "@/components/flow-playground/FlowPlayground";

<FlowPlayground />
```

## Demo Data

Mock project data is provided in `context/project-context-demo.js` with:
- Project name: "Geiger Flow Demo"
- Team size: 8 members
- Progress: 67%
- Budget tracking
- Timeline information
- And more...

## Dependencies

All necessary UI components have been copied to `components/ui/` and dependencies added to `package.json`.
