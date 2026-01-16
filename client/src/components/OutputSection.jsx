import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

const OutputSection = ({ language, code, onCodeChange, previewUrl, showToast, enhanceEnabled, onEnhanceToggle, onEnhanceCode }) => {
    const t = useTranslation(language);
    const [deviceView, setDeviceView] = useState('desktop');
    const [isEditing, setIsEditing] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [enhancing, setEnhancing] = useState(false);

    const deviceSizes = {
        desktop: { width: '100%', label: language === 'hi' ? 'डेस्कटॉप' : 'Desktop', icon: '💻' },
        tablet: { width: '768px', label: language === 'hi' ? 'टैबलेट' : 'Tablet', icon: '📱' },
        mobile: { width: '375px', label: language === 'hi' ? 'मोबाइल' : 'Mobile', icon: '📱' }
    };

    // Update blob URL whenever code changes
    React.useEffect(() => {
        if (code) {
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);

            // Cleanup
            return () => URL.revokeObjectURL(url);
        } else {
            setBlobUrl(null);
        }
    }, [code]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            showToast(language === 'hi' ? 'कोड कॉपी किया गया! 📋' : 'Code copied! 📋', 'success');
        } catch (error) {
            showToast(language === 'hi' ? 'कॉपी करने में विफल' : 'Failed to copy', 'error');
        }
    };

    const handleDownload = () => {
        if (!code) return;

        try {
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated_website.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast(language === 'hi' ? 'डाउनलोड शुरू हुआ! ⬇️' : 'Download started! ⬇️', 'success');
        } catch (error) {
            console.error('Download error:', error);
            showToast(language === 'hi' ? 'डाउनलोड करने में विफल' : 'Failed to download', 'error');
        }
    };

    const handleRefresh = () => {
        const frame = document.getElementById('previewFrame');
        if (frame) {
            // If we have a blobUrl (from editing or just code prop), use that. 
            // Otherwise fall back to previewUrl if we were doing that (though blobUrl covers all cases if code is present)
            frame.src = blobUrl || previewUrl;
            showToast(language === 'hi' ? 'पूर्वावलोकन रीफ्रेश हुआ' : 'Preview refreshed', 'success');
        }
    };

    const handleOpenNewTab = () => {
        const urlToOpen = blobUrl || previewUrl;
        if (urlToOpen) {
            window.open(urlToOpen, '_blank');
        } else {
            showToast(language === 'hi' ? 'कोई पूर्वावलोकन उपलब्ध नहीं' : 'No preview available', 'error');
        }
    };

    React.useEffect(() => {
        if (code && !isEditing) {
            Prism.highlightAll();
        }
    }, [code, isEditing]);

    const handleEnhanceToggle = async (enabled) => {
        if (onEnhanceToggle) {
            onEnhanceToggle(enabled);
        }
        
        // If enabling and code exists, automatically enhance it
        if (enabled && code && onEnhanceCode) {
            setEnhancing(true);
            try {
                await onEnhanceCode(code);
            } catch (error) {
                console.error('Enhancement error:', error);
                showToast(language === 'hi' ? 'कोड बेहतर बनाने में विफल' : 'Failed to enhance code', 'error');
                // Revert toggle on error
                if (onEnhanceToggle) {
                    onEnhanceToggle(false);
                }
            } finally {
                setEnhancing(false);
            }
        }
    };

    return (
        <section className="output-section">
            {/* Code Viewer */}
            <div className="output-card">
                <div className="card-header">
                    <h3>{t.generatedCode}</h3>
                    <div className="card-actions">
                        {/* Enhancement Toggle */}
                        {code && (
                            <div className="enhance-toggle-container">
                                <label className="enhance-toggle-label" title={language === 'hi' ? 'AI द्वारा कोड बेहतर बनाएं' : 'Enhance code with AI'}>
                                    <span className="enhance-toggle-text">
                                        {language === 'hi' ? 'बेहतर बनाएं' : 'Enhance'}
                                    </span>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={enhanceEnabled}
                                            onChange={(e) => handleEnhanceToggle(e.target.checked)}
                                            disabled={enhancing || !code}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                    {enhancing && (
                                        <svg className="enhance-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                                            <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round"></path>
                                        </svg>
                                    )}
                                </label>
                            </div>
                        )}
                        <div className="divider"></div>
                        <button
                            className={`icon-btn ${isEditing ? 'active' : ''}`}
                            onClick={() => setIsEditing(!isEditing)}
                            title={isEditing ? "View Code" : "Edit Code"}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button className="icon-btn" onClick={handleCopy} title="Copy code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button className="icon-btn" onClick={handleDownload} title="Download HTML">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="code-container">
                    {isEditing ? (
                        <textarea
                            className="code-editor"
                            value={code || ''}
                            onChange={(e) => onCodeChange(e.target.value)}
                            spellCheck="false"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                resize: 'none',
                                fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                                padding: '1.25rem',
                                background: '#1E293B',
                                color: '#E2E8F0',
                                fontSize: '14px',
                                lineHeight: '1.7',
                                outline: 'none',
                                fontWeight: '400'
                            }}
                        />
                    ) : (
                        <pre style={{ margin: 0, padding: 0, background: 'transparent' }}>
                            <code className="language-html">
                                {code || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>// Your generated code will appear here...</span>}
                            </code>
                        </pre>
                    )}
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
                    {!code && !previewUrl ? (
                        <div className="preview-placeholder">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="9"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                            <p style={{ marginTop: '12px', fontSize: '16px', fontWeight: '500' }}>
                                {language === 'hi' ? 'आपका पूर्वावलोकन यहाँ दिखाई देगा' : 'Your preview will appear here'}
                            </p>
                            <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                {language === 'hi' ? 'कोड जनरेट करने के लिए ऊपर विवरण दर्ज करें' : 'Enter a description above to generate code'}
                            </p>
                        </div>
                    ) : (
                        <iframe
                            id="previewFrame"
                            className="preview-frame"
                            src={blobUrl || previewUrl}
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
