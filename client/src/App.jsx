import { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import KeywordMapper from './components/KeywordMapper';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Apply font size class to body
  useEffect(() => {
    document.body.className = `font-${fontSize}`;
  }, [fontSize]);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast(language === 'hi' ? 'कृपया विवरण दर्ज करें' : 'Please enter a description', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setGeneratedCode(data.code);
      setPreviewUrl(`http://localhost:3000${data.previewUrl}`);
      await loadProjects();
      showToast(language === 'hi' ? 'सफलतापूर्वक उत्पन्न! 🎉' : 'Generated successfully! 🎉', 'success');
    } catch (error) {
      console.error('Generation error:', error);
      showToast(language === 'hi' ? 'जनरेट करने में विफल। कृपया पुन: प्रयास करें।' : 'Failed to generate. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = async (projectId) => {
    if (!projectId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}`);
      const data = await response.json();
      setPrompt(data.prompt);
      setGeneratedCode(data.code);
      setPreviewUrl(`http://localhost:3000${data.previewUrl}`);
    } catch (error) {
      console.error('Error loading project:', error);
      showToast(language === 'hi' ? 'प्रोजेक्ट लोड करने में विफल' : 'Failed to load project', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <div className="app">
      <Header
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        projects={projects}
        onProjectSelect={handleProjectSelect}
      />

      <div className="container">
        <main className="main-content">
          <InputSection
            language={language}
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            onGenerate={handleGenerate}
          />

          <KeywordMapper text={prompt} language={language} />

          <OutputSection
            language={language}
            code={generatedCode}
            previewUrl={previewUrl}
            showToast={showToast}
          />
        </main>
      </div>

      <Chatbot language={language} generatedCode={generatedCode} />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
