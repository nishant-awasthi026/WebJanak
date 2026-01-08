# WebJanak 🇮🇳
### AI-Aided Automated Front-End Design & UI Generation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

> **WebJanak** is an intelligent web design automation platform developed with Indian Government aesthetic principles. It leverages advanced AI models to generate production-ready, responsive front-end code from natural language descriptions.

## 🌟 Features

### Core Functionality
- **AI-Powered Code Generation**: Transform natural language descriptions into complete HTML/CSS/React components
- **Live Preview**: Real-time rendering of generated code with device responsiveness testing
- **TF-IDF Keyword Analysis**: Real-time keyword importance mapping from user prompts
- **Smart Chatbot Assistant**: Context-aware development help with RAG (Retrieval-Augmented Generation) system
- **Project Management**: Save, load, and manage generated projects
- **Fallback Templates**: Beautiful pre-built templates (Portfolio, Coffee Shop, Dashboard) when API limits are reached

### UI/UX Excellence
- **Indian Government Theme**: Official tricolor (Saffron-White-Green) design system with Ashoka Chakra emblem
- **Bilingual Support**: Full English/Hindi language switching
- **Accessibility**: Font size controls (A-, A, A+) with comprehensive scaling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Device Preview**: Test generated UIs on Desktop (💻), Tablet (📱), Mobile (📱) viewports

### Technical Highlights
- **React + Vite**: Modern, fast development with HMR (Hot Module Replacement)
- **TypeScript Backend**: Type-safe Express.js server
- **Syntax Highlighting**: Prism.js integration for code display
- **File System Management**: Automatic project storage and organization

## 🏗️ Architecture

```
WebJanak/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx           # App header with controls
│   │   │   ├── InputSection.jsx     # Prompt input area
│   │   │   ├── OutputSection.jsx    # Code viewer & preview
│   │   │   ├── KeywordMapper.jsx    # TF-IDF analysis
│   │   │   ├── Chatbot.jsx          # AI assistant
│   │   │   ├── FileSystemViewer.jsx # Project navigator
│   │   │   └── AshokaChakra.jsx     # Government emblem
│   │   ├── utils/
│   │   │   ├── tfidf.js             # Keyword analysis
│   │   │   └── translations.js       # i18n support
│   │   ├── App.jsx           # Main application
│   │   └── App.css           # Government UI styles
│   └── package.json
│
├── src/                       # TypeScript Backend
│   ├── app/
│   │   └── actions.ts        # AI generation logic
│   └── server.ts             # Express API server
│
├── fallback-templates/        # Pre-built templates
│   ├── portfolio.html
│   ├── coffeeshop.html
│   └── dashboard.html
│
├── generated-projects/        # User-generated code storage
├── dist/                      # Compiled backend
└── .env                       # Configuration
```

## 🤖 AI Models

### Current Implementation
WebJanak currently uses **Google Gemini 1.5 Flash** for code generation with intelligent fallback to hardcoded templates when quota limits are reached.

### Future: Fine-Tuned Qwen LLM Integration

The platform is architected to support custom LLM integration. Planned enhancement:

**Fine-Tuned Qwen Model**
- **Purpose**: Domain-specific UI/UX code generation optimized for Indian government design patterns
- **Training Data**: Curated dataset of government websites, accessibility standards, and responsive design patterns
- **Integration Point**: `src/app/actions.ts` - Replace Gemini API calls with Qwen inference
- **Benefits**: 
  - No API quota limitations
  - Custom design system understanding
  - Faster inference times
  - Privacy and data sovereignty

**Implementation Path**:
```typescript
// src/app/actions.ts - Future Qwen Integration
import { QwenInference } from './qwen-model';

export async function generateCode(description: string): Promise<string> {
  try {
    const qwenModel = new QwenInference({
      modelPath: './models/webjanak-qwen-finetuned',
      temperature: 0.7,
      maxTokens: 4096
    });
    
    return await qwenModel.generate(description);
  } catch (error) {
    // Fallback to templates
    return getFallbackTemplate(description);
  }
}
```

### RAG-Enhanced Chatbot

The development assistant chatbot uses **Retrieval-Augmented Generation**:

**Current**: Context-aware responses using Gemini with code context
**Enhanced RAG System**:
- **Vector Database**: Embeddings of web development documentation, React patterns, government design standards
- **Retrieval**: Semantic search for relevant documentation before generation
- **Context Window**: 
  - Generated code snippets
  - React component library docs
  - Indian government web guidelines
  - Accessibility (WCAG) standards

**RAG Architecture**:
```
User Query → Embedding → Vector Search → Top-K Docs → LLM Context → Response
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v9.x or higher
- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey) (or use your Qwen model)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/webjanak.git
cd webjanak
```

2. **Install dependencies**
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

3. **Configure environment**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "PORT=3000" >> .env
```

4. **Build the backend**
```bash
npm run build
```

### Running the Application

**Development Mode** (recommended):

```bash
# Terminal 1 - Start backend server
npm start

# Terminal 2 - Start React dev server
cd client
npm run dev
```

**Access the application**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Build

```bash
# Build frontend for production
cd client
npm run build

# Serve built files (configure your server)
npm run preview
```

## 📖 Usage Guide

### Basic Workflow

1. **Enter Description**: Type your UI requirements in natural language
   - Example: "Create a modern landing page for a coffee shop with menu cards"

2. **Analyze Keywords**: View TF-IDF analysis showing important keywords

3. **Generate Code**: Click "GENERATE" button
   - AI generates complete HTML/CSS/React code
   - Code appears in left panel with syntax highlighting
   - Live preview renders in right panel

4. **Test Responsiveness**: Use device selector buttons
   - 💻 Desktop view
   - 📱 Tablet view (768px)
   - 📱 Mobile view (375px)

5. **Get Help**: Click chatbot button for development assistance

### Example Prompts

```
✅ Good Prompts:
"Create a portfolio website with hero section, project gallery, skills grid, and contact form"
"Build a dashboard with sidebar, stats cards, charts, and data table"
"Design a coffee shop landing page with menu, about section, and location info"

❌ Avoid:
"Make a website" (too vague)
"Beautiful UI" (lacks specifics)
```

### Language & Accessibility

- **Language Switch**: Top-right dropdown (English/हिन्दी)
- **Font Size**: A- (small) / A (medium) / A+ (large)
- **Mobile**: Fully responsive on all devices

## 🔌 API Endpoints

### Backend REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate UI code from prompt |
| GET | `/api/projects` | List all generated projects |
| GET | `/api/projects/:id` | Get specific project details |
| POST | `/api/chat` | Chatbot conversation endpoint |
| GET | `/generated/:id/index.html` | Serve preview HTML |

### API Request Examples

**Generate Code**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a modern portfolio website"}'
```

**Chat with Assistant**:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I make this responsive?",
    "code": "<html>...</html>",
    "language": "en"
  }'
```

## 🎨 Design System

### Color Palette (Indian Government)

```css
--saffron: #FF9933;     /* Primary accent */
--white: #FFFFFF;       /* Background */
--green: #138808;       /* Secondary accent */
--navy-blue: #000080;   /* Text & borders */
```

### Typography

- **Headings**: Georgia (serif) - formal government style
- **Body**: Arial, Helvetica (sans-serif)
- **Code**: 'Fira Code', monospace

### Components

All UI components follow government accessibility guidelines:
- Minimum 44px touch targets
- WCAG AA contrast ratios
- Semantic HTML structure
- Keyboard navigation support

## 🛠️ Development

### Project Structure

```
src/app/actions.ts     → AI generation logic (replace with Qwen)
src/server.ts          → Express API server
client/src/App.jsx     → Main React app
client/src/components/ → Reusable UI components
client/src/utils/      → Helper utilities
```

### Adding a Custom LLM

To integrate your fine-tuned Qwen model:

1. **Create model interface**: `src/app/qwen-inference.ts`
2. **Update actions**: Modify `src/app/actions.ts` 
3. **Configure model path**: Add to `.env`
4. **Test generation**: Verify output quality

### Extending the RAG System

For chatbot RAG enhancement:

1. **Vector store**: Integrate Pinecone/Weaviate/ChromaDB
2. **Embeddings**: Use `text-embedding-3-small` or custom model
3. **Update chatbot**: Modify `client/src/components/Chatbot.jsx`
4. **Backend endpoint**: Enhance `/api/chat` with retrieval logic

## 📊 Performance

- **Initial Load**: ~500ms (Vite HMR)
- **Code Generation**: 2-5s (depends on LLM)
- **Preview Rendering**: Instant
- **Mobile Performance**: Optimized for 3G networks

## 🔒 Security

- Environment variables for API keys
- CORS configuration for API access
- Input sanitization on prompts
- No sensitive data in generated code

## 🌐 Deployment

### Recommended Stack

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, DigitalOcean
- **Database** (optional): MongoDB for project storage

### Environment Variables

```bash
# Production .env
GEMINI_API_KEY=your_production_key
PORT=3000
NODE_ENV=production
QWEN_MODEL_PATH=/models/webjanak-qwen  # For custom LLM
VECTOR_DB_URL=your_vector_db_url        # For RAG system
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Future Roadmap

- [ ] Fine-tuned Qwen LLM integration
- [ ] RAG-enhanced chatbot with vector database
- [ ] Multi-file project generation (components, styles, assets)
- [ ] Design system library (pre-built components)
- [ ] Export to GitHub/CodeSandbox
- [ ] Collaborative editing
- [ ] A/B testing for generated designs
- [ ] Figma plugin integration

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👥 Authors

**WebJanak Team**
- Developed with ❤️ for Indian Government Digital Initiatives
- Powered by AI and modern web technologies

## 🙏 Acknowledgments

- Google Gemini for initial AI capabilities
- Qwen Team for open-source LLM foundation
- Government of India for design inspiration
- React and Vite communities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/webjanak/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/webjanak/discussions)
- **Email**: support@webjanak.gov.in (replace with actual)

---

<div align="center">
  <strong>Built with 🇮🇳 for India's Digital Future</strong>
  <br>
  <sub>WebJanak - Empowering Government Web Development</sub>
</div>
