const translations = {
    en: {
        enterDescription: 'Enter Description',
        aiPowered: 'AI POWERED',
        examples: 'Examples:',
        portfolio: 'Portfolio',
        coffeeShop: 'Coffee Shop',
        dashboard: 'Dashboard',
        generate: 'GENERATE',
        generatedCode: 'Generated Code',
        livePreview: 'Live Preview',
        placeholder: 'Example: Create a modern landing page for a coffee shop with hero section, menu cards, and contact form...'
    },
    hi: {
        enterDescription: 'विवरण दर्ज करें',
        aiPowered: 'AI सशक्त',
        examples: 'उदाहरण:',
        portfolio: 'पोर्टफोलियो',
        coffeeShop: 'कॉफी शॉप',
        dashboard: 'डैशबोर्ड',
        generate: 'जनरेट करें',
        generatedCode: 'उत्पन्न कोड',
        livePreview: 'लाइव पूर्वावलोकन',
        placeholder: 'उदाहरण: एक कॉफी शॉप के लिए हीरो सेक्शन, मेनू कार्ड और संपर्क फॉर्म के साथ एक आधुनिक लैंडिंग पेज बनाएं...'
    }
};

export const useTranslation = (lang) => {
    return translations[lang] || translations.en;
};
