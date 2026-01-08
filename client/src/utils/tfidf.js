// TF-IDF Calculator for real-time keyword analysis
export class TFIDFAnalyzer {
    constructor() {
        this.stopWords = new Set([
            'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
            'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
            'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
            'own', 'same', 'so', 'than', 'too', 'very', 'just', 'create', 'make',
            'build', 'design', 'generate', 'add', 'use', 'using', 'with'
        ]);
    }

    // Tokenize and clean text
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !this.stopWords.has(word));
    }

    // Calculate term frequency
    calculateTF(tokens) {
        const tf = {};
        const totalTokens = tokens.length;

        tokens.forEach(token => {
            tf[token] = (tf[token] || 0) + 1;
        });

        // Normalize by document length
        Object.keys(tf).forEach(term => {
            tf[term] = tf[term] / totalTokens;
        });

        return tf;
    }

    // Calculate IDF (simplified - using a general corpus assumption)
    calculateIDF(term) {
        // Common web development terms have lower IDF
        const commonTerms = new Set([
            'website', 'page', 'app', 'application', 'site', 'web', 'button',
            'form', 'input', 'text', 'image', 'section', 'div', 'component'
        ]);

        // Technical/specific terms have higher IDF
        const technicalTerms = new Set([
            'dashboard', 'authentication', 'api', 'database', 'modal', 'carousel',
            'accordion', 'navbar', 'sidebar', 'footer', 'hero', 'testimonial',
            'portfolio', 'ecommerce', 'admin', 'analytics', 'chart', 'graph'
        ]);

        if (technicalTerms.has(term)) return 2.5;
        if (commonTerms.has(term)) return 0.5;
        return 1.0; // Default IDF for other terms
    }

    // Calculate TF-IDF scores
    analyze(text) {
        const tokens = this.tokenize(text);
        const tf = this.calculateTF(tokens);
        const tfidf = {};

        Object.keys(tf).forEach(term => {
            const idf = this.calculateIDF(term);
            tfidf[term] = tf[term] * idf;
        });

        // Sort by score and return top keywords
        return Object.entries(tfidf)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([term, score]) => ({
                term,
                score: parseFloat(score.toFixed(3)),
                importance: this.getImportanceLevel(score)
            }));
    }

    // Get importance level for visualization
    getImportanceLevel(score) {
        if (score > 0.15) return 'high';
        if (score > 0.08) return 'medium';
        return 'low';
    }
}
