import React, { useState } from 'react';

const FileSystemViewer = ({ projectId, language }) => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [expanded, setExpanded] = useState({});

    const handleFileClick = (file) => {
        setSelectedFile(file);
    };

    const toggleFolder = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const renderFileTree = (items, level = 0) => {
        return items.map((item) => (
            <div key={item.path} style={{ marginLeft: `${level * 20}px` }}>
                {item.type === 'folder' ? (
                    <>
                        <div
                            className="file-item folder"
                            onClick={() => toggleFolder(item.path)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>{item.name}</span>
                            <span className="chevron">{expanded[item.path] ? '▼' : '▶'}</span>
                        </div>
                        {expanded[item.path] && item.children && renderFileTree(item.children, level + 1)}
                    </>
                ) : (
                    <div
                        className={`file-item file ${selectedFile?.path === item.path ? 'selected' : ''}`}
                        onClick={() => handleFileClick(item)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        <span>{item.name}</span>
                        <span className="file-size">{item.size}</span>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="filesystem-viewer">
            <div className="fs-header">
                <h4>{language === 'hi' ? 'फ़ाइल संरचना' : 'File Structure'}</h4>
            </div>

            {files.length === 0 ? (
                <div className="fs-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>{language === 'hi' ? 'कोई फ़ाइल नहीं' : 'No files generated yet'}</p>
                </div>
            ) : (
                <div className="fs-tree">
                    {renderFileTree(files)}
                </div>
            )}

            {selectedFile && (
                <div className="fs-preview">
                    <div className="preview-header">
                        <span>{selectedFile.name}</span>
                        <button onClick={() => setSelectedFile(null)}>×</button>
                    </div>
                    <div className="preview-content">
                        <pre><code>{selectedFile.content}</code></pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileSystemViewer;
