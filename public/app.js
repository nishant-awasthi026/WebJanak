// State management
let currentProjectId = null;
let currentPreviewUrl = null;
let currentLanguage = 'en';
let currentFontSize = 'medium';

// DOM Elements
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const btnText = generateBtn.querySelector('.btn-text');
const btnLoader = generateBtn.querySelector('.btn-loader');
const codeOutput = document.getElementById('codeOutput');
const previewFrame = document.getElementById('previewFrame');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const projectSelector = document.getElementById('projectSelector');
const languageSelector = document.getElementById('languageSelector');
const fontSizeSelector = document.getElementById('fontSizeSelector');
const copyBtn = document.getElementById('copyBtn');
const refreshBtn = document.getElementById('refreshBtn');
const openNewTabBtn = document.getElementById('openNewTabBtn');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    attachEventListeners();
    applyLanguage();
    applyFontSize();
});

// Event Listeners
function attachEventListeners() {
    generateBtn.addEventListener('click', handleGenerate);

    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prompt = e.target.getAttribute('data-prompt');
            promptInput.value = prompt;
            promptInput.focus();
        });
    });

    projectSelector.addEventListener('change', handleProjectSelect);
    languageSelector.addEventListener('change', handleLanguageChange);
    fontSizeSelector.addEventListener('change', handleFontSizeChange);
    copyBtn.addEventListener('click', handleCopyCode);
    refreshBtn.addEventListener('click', handleRefreshPreview);
    openNewTabBtn.addEventListener('click', handleOpenNewTab);

    // Enter to submit (with Ctrl/Cmd)
    promptInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleGenerate();
        }
    });
}

// Language Change
function handleLanguageChange(e) {
    currentLanguage = e.target.value;
    applyLanguage();
}

// Apply language to all elements
function applyLanguage() {
    const lang = currentLanguage;

    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-lang-en]').forEach(el => {
        const text = el.getAttribute(`data-lang-${lang}`);
        if (text) {
            el.textContent = text;
        }
    });

    // Update placeholder
    const placeholder = promptInput.getAttribute(`data-placeholder-${lang}`);
    if (placeholder) {
        promptInput.placeholder = placeholder;
    }
}

// Font Size Change
function handleFontSizeChange(e) {
    currentFontSize = e.target.value;
    applyFontSize();
}

// Apply font size
function applyFontSize() {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${currentFontSize}`);
}

// Generate UI
async function handleGenerate() {
    const prompt = promptInput.value.trim();

    if (!prompt) {
        showToast(currentLanguage === 'hi' ? 'कृपया विवरण दर्ज करें' : 'Please enter a description', 'error');
        return;
    }

    // Show loading state
    setLoading(true);

    try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Generation failed');
        }

        const data = await response.json();

        // Update UI with generated code
        currentProjectId = data.projectId;
        currentPreviewUrl = `http://localhost:3000${data.previewUrl}`;

        displayCode(data.code);
        displayPreview(currentPreviewUrl);

        // Reload project list
        await loadProjects();

        showToast(currentLanguage === 'hi' ? 'सफलतापूर्वक उत्पन्न! 🎉' : 'Generated successfully! 🎉', 'success');

    } catch (error) {
        console.error('Generation error:', error);
        showToast(currentLanguage === 'hi' ? 'जनरेट करने में विफल। कृपया पुन: प्रयास करें।' : 'Failed to generate. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
}

// Display generated code
function displayCode(code) {
    codeOutput.textContent = code;

    // Apply syntax highlighting
    if (window.Prism) {
        Prism.highlightElement(codeOutput);
    }
}

// Display preview
function displayPreview(url) {
    previewPlaceholder.classList.add('hidden');
    previewFrame.classList.remove('hidden');
    previewFrame.src = url;
}

// Load projects list
async function loadProjects() {
    try {
        const response = await fetch('http://localhost:3000/api/projects');
        const data = await response.json();

        // Clear existing options (except first)
        projectSelector.innerHTML = '<option value="">Recent Projects</option>';

        // Add project options
        data.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            const date = new Date(project.createdAt).toLocaleString();
            option.textContent = `${project.prompt.substring(0, 50)}... (${date})`;
            projectSelector.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Handle project selection
async function handleProjectSelect(e) {
    const projectId = e.target.value;

    if (!projectId) return;

    try {
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}`);
        const data = await response.json();

        currentProjectId = data.id;
        currentPreviewUrl = `http://localhost:3000${data.previewUrl}`;

        promptInput.value = data.prompt;
        displayCode(data.code);
        displayPreview(currentPreviewUrl);

    } catch (error) {
        console.error('Error loading project:', error);
        showToast(currentLanguage === 'hi' ? 'प्रोजेक्ट लोड करने में विफल' : 'Failed to load project', 'error');
    }
}

// Copy code to clipboard
async function handleCopyCode() {
    const code = codeOutput.textContent;

    try {
        await navigator.clipboard.writeText(code);
        showToast(currentLanguage === 'hi' ? 'कोड कॉपी किया गया! 📋' : 'Code copied! 📋', 'success');
    } catch (error) {
        console.error('Copy failed:', error);
        showToast(currentLanguage === 'hi' ? 'कॉपी करने में विफल' : 'Failed to copy', 'error');
    }
}

// Refresh preview
function handleRefreshPreview() {
    if (currentPreviewUrl) {
        previewFrame.src = currentPreviewUrl;
        showToast(currentLanguage === 'hi' ? 'पूर्वावलोकन रीफ्रेश हुआ' : 'Preview refreshed', 'success');
    }
}

// Open preview in new tab
function handleOpenNewTab() {
    if (currentPreviewUrl) {
        window.open(currentPreviewUrl, '_blank');
    } else {
        showToast(currentLanguage === 'hi' ? 'कोई पूर्वावलोकन उपलब्ध नहीं' : 'No preview available', 'error');
    }
}

// Loading state
function setLoading(loading) {
    if (loading) {
        generateBtn.classList.add('loading');
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        generateBtn.classList.remove('loading');
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Toast notifications
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
