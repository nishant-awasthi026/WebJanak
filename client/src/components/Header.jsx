import React from 'react';
import AshokaChakra from './AshokaChakra';

const Header = ({ language, setLanguage, fontSize, setFontSize, projects, onProjectSelect }) => {
    return (
        <header className="header">
            <div className="logo">
                <AshokaChakra />
                <div>
                    <h1>WebJanak</h1>
                </div>
            </div>
            <div className="header-actions">
                <select
                    className="control-selector"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                >
                    <option value="small">A-</option>
                    <option value="medium">A</option>
                    <option value="large">A+</option>
                </select>

                <select
                    className="control-selector"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                </select>

                <select
                    className="project-selector"
                    onChange={(e) => onProjectSelect(e.target.value)}
                >
                    <option value="">Recent Projects</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.prompt.substring(0, 50)}... ({new Date(project.createdAt).toLocaleString()})
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
};

export default Header;
