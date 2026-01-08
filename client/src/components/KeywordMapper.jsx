import React, { useState, useEffect } from 'react';
import { TFIDFAnalyzer } from '../utils/tfidf';

const KeywordMapper = ({ text, language }) => {
    const [keywords, setKeywords] = useState([]);
    const analyzer = new TFIDFAnalyzer();

    useEffect(() => {
        if (text && text.length > 10) {
            const analysis = analyzer.analyze(text);
            setKeywords(analysis);
        } else {
            setKeywords([]);
        }
    }, [text]);

    if (keywords.length === 0) return null;

    const getImportanceColor = (importance) => {
        switch (importance) {
            case 'high': return '#FF9933'; // Saffron
            case 'medium': return '#138808'; // Green
            case 'low': return '#999999'; // Gray
            default: return '#666666';
        }
    };

    return (
        <div className="keyword-mapper">
            <div className="mapper-header">
                <h4>{language === 'hi' ? 'मुख्य शब्द विश्लेषण' : 'Keyword Analysis'}</h4>
                <span className="mapper-badge">TF-IDF</span>
            </div>
            <div className="keywords-grid">
                {keywords.map((keyword, index) => (
                    <div
                        key={index}
                        className={`keyword-pill ${keyword.importance}`}
                        style={{
                            borderColor: getImportanceColor(keyword.importance),
                            backgroundColor: `${getImportanceColor(keyword.importance)}15`
                        }}
                    >
                        <span className="keyword-term">{keyword.term}</span>
                        <span className="keyword-score">{(keyword.score * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
            <div className="mapper-legend">
                <div className="legend-item">
                    <span className="legend-dot high"></span>
                    <span>{language === 'hi' ? 'उच्च' : 'High'}</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot medium"></span>
                    <span>{language === 'hi' ? 'मध्यम' : 'Medium'}</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot low"></span>
                    <span>{language === 'hi' ? 'निम्न' : 'Low'}</span>
                </div>
            </div>
        </div>
    );
};

export default KeywordMapper;
