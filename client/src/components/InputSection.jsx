import React from 'react';
import { useTranslation } from '../utils/translations';

const InputSection = ({ language, prompt, setPrompt, loading, onGenerate }) => {
    const t = useTranslation(language);

    const examplePrompts = [
        "Create a modern portfolio website with hero section, projects gallery, skills section, and contact form",
        "Build a landing page for a coffee shop with hero image, menu cards, location map, and reservation form",
        "Design a dashboard with sidebar navigation, stats cards, charts, and data tables"
    ];

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            onGenerate();
        }
    };

    return (
        <section className="input-section">
            <div className="input-card">
                <div className="card-header">
                    <h2>{t.enterDescription}</h2>
                    <span className="badge">{t.aiPowered}</span>
                </div>

                <textarea
                    className="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.placeholder}
                    rows="8"
                />

                <div className="input-footer">
                    <div className="examples">
                        <span className="example-label">{t.examples}</span>
                        <button
                            className="example-btn"
                            onClick={() => setPrompt(examplePrompts[0])}
                        >
                            {t.portfolio}
                        </button>
                        <button
                            className="example-btn"
                            onClick={() => setPrompt(examplePrompts[1])}
                        >
                            {t.coffeeShop}
                        </button>
                        <button
                            className="example-btn"
                            onClick={() => setPrompt(examplePrompts[2])}
                        >
                            {t.dashboard}
                        </button>
                    </div>

                    <button
                        className="generate-btn"
                        onClick={onGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-loader">
                                <svg className="spinner" viewBox="0 0 50 50">
                                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                </svg>
                            </span>
                        ) : (
                            <span className="btn-text">{t.generate}</span>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InputSection;
