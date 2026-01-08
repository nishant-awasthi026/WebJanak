# Text to React UI Generator

An AI-powered application that generates React frontend code from natural language descriptions using Google's Gemini API. The generated code is saved to the file system and displayed in a live preview.

## Features

✨ **AI-Powered Generation** - Uses Google Gemini to create React components from text descriptions  
📁 **File System Storage** - Automatically saves generated projects to organized folders  
👁️ **Live Preview** - Real-time preview of generated UI in an iframe  
📋 **Code Viewer** - Syntax-highlighted display of generated code  
🗂️ **Project History** - Browse and reload previously generated projects  
🎨 **Modern UI** - Beautiful dark mode interface with glassmorphism effects  

## Prerequisites

- Node.js (v14 or higher)
- Google Gemini API key

## Installation

1. Clone or navigate to the project directory:
```bash
cd "d:\text to react ui"
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with your Gemini API key.

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter a description of the UI you want to create, for example:
   - "Create a modern landing page for a fitness app with hero section, features, and pricing"
   - "Build a dashboard with sidebar, stats cards, and data table"
   - "Design a portfolio website with project gallery and contact form"

4. Click "Generate UI" and wait for the AI to create your component

5. View the generated code and live preview

6. Generated projects are saved in `generated-projects/` folder

## Project Structure

```
text-to-react-ui/
├── server.js           # Express server with Gemini integration
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (API key)
├── public/            # Frontend files
│   ├── index.html     # Main UI
│   ├── styles.css     # Styling
│   └── app.js         # Frontend logic
└── generated-projects/ # Generated UI projects (auto-created)
```

## API Endpoints

- `POST /api/generate` - Generate React code from prompt
- `GET /api/projects` - List all generated projects
- `GET /api/projects/:id` - Get specific project details
- `GET /generated/:id/index.html` - Serve generated preview

## Technologies Used

- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Styling**: Custom CSS with glassmorphism
- **Code Highlighting**: Prism.js

## Tips for Best Results

- Be specific about the components you want (hero, navbar, cards, etc.)
- Mention desired colors, styles, or themes
- Specify any interactive features or animations
- Include layout preferences (grid, flexbox, sections)

## Example Prompts

1. **Landing Page**: "Create a modern SaaS landing page with animated hero section, feature cards with icons, pricing table with three tiers, and testimonial carousel"

2. **Dashboard**: "Build an admin dashboard with sidebar navigation, top stats cards showing metrics, line chart for analytics, and recent activity table"

3. **Portfolio**: "Design a creative portfolio with full-screen hero with parallax effect, project grid with hover effects, skills section with progress bars, and contact form"

## License

MIT
"# WebJanak" 
