import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const OutputSection = ({ language, code, previewUrl, showToast }) => {
    const t = useTranslation(language);
    const [deviceView, setDeviceView] = useState('desktop');

    const deviceSizes = {
        desktop: { width: '100%', label: language === 'hi' ? 'डेस्कटॉप' : 'Desktop', icon: '💻' },
        tablet: { width: '768px', label: language === 'hi' ? 'टैबलेट' : 'Tablet', icon: '📱' },
        mobile: { width: '375px', label: language === 'hi' ? 'मोबाइल' : 'Mobile', icon: '📱' }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            showToast(language === 'hi' ? 'कोड कॉपी किया गया! 📋' : 'Code copied! 📋', 'success');
        } catch (error) {
            showToast(language === 'hi' ? 'कॉपी करने में विफल' : 'Failed to copy', 'error');
        }
    };

    const handleRefresh = () => {
        if (previewUrl) {
            document.getElementById('previewFrame').src = previewUrl;
            showToast(language === 'hi' ? 'पूर्वावलोकन रीफ्रेश हुआ' : 'Preview refreshed', 'success');
        }
    };

    const handleOpenNewTab = () => {
        if (previewUrl) {
            window.open(previewUrl, '_blank');
        } else {
            showToast(language === 'hi' ? 'कोई पूर्वावलोकन उपलब्ध नहीं' : 'No preview available', 'error');
        }
    };

    React.useEffect(() => {
        if (code) {
            Prism.highlightAll();
        }
    }, [code]);

    return (
        <section className="output-section">
            {/* Code Viewer */}
            <div className="output-card">
                <div className="card-header">
                    <h3>{t.generatedCode}</h3>
                    <div className="card-actions">
                        <button className="icon-btn" onClick={handleCopy} title="Copy code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="code-container">
                    <pre><code className="language-html">{code || '// Your generated code will appear here...'}</code></pre>
                </div>
            </div>

            {/* Live Preview */}
            <div className="output-card">
                <div className="card-header">
                    <h3>{t.livePreview}</h3>
                    <div className="card-actions">
                        {/* Device Selector */}
                        <div className="device-selector">
                            {Object.entries(deviceSizes).map(([key, { label, icon }]) => (
                                <button
                                    key={key}
                                    className={`device-btn ${deviceView === key ? 'active' : ''}`}
                                    onClick={() => setDeviceView(key)}
                                    title={label}
                                >
                                    <span className="device-icon">{icon}</span>
                                    <span className="device-label">{label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="divider"></div>

                        <button className="icon-btn" onClick={handleRefresh} title="Refresh preview">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <polyline points="1 20 1 14 7 14"></polyline>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                        </button>
                        <button className="icon-btn" onClick={handleOpenNewTab} title="Open in new tab">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="preview-container" style={{
                    display: 'flex',
                    justifyContent: deviceView === 'desktop' ? 'stretch' : 'center',
                    alignItems: 'flex-start',
                    background: deviceView !== 'desktop' ? '#f0f0f0' : 'white'
                }}>
                    {!previewUrl ? (
                        <div className="preview-placeholder">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="9"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                            <p>Your preview will appear here</p>
                        </div>
                    ) : (
                        <iframe
                            id="previewFrame"
                            className="preview-frame"
                            src={previewUrl}
                            style={{
                                width: deviceSizes[deviceView].width,
                                maxWidth: '100%',
                                height: '600px',
                                border: deviceView !== 'desktop' ? '2px solid #333' : 'none',
                                borderRadius: deviceView !== 'desktop' ? '12px' : '0',
                                boxShadow: deviceView !== 'desktop' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                            }}
                        ></iframe>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OutputSection;
