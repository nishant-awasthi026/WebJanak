import React from 'react';

const AshokaChakra = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            {/* Ashoka Chakra inspired emblem */}
            <circle cx="25" cy="25" r="24" fill="#000080" stroke="#FF9933" strokeWidth="2" />
            <circle cx="25" cy="25" r="12" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="25" cy="25" r="2" fill="white" />
            {/* 24 spokes */}
            <line x1="25" y1="13" x2="25" y2="23" stroke="white" strokeWidth="1.5" />
            <line x1="25" y1="27" x2="25" y2="37" stroke="white" strokeWidth="1.5" />
            <line x1="13" y1="25" x2="23" y2="25" stroke="white" strokeWidth="1.5" />
            <line x1="27" y1="25" x2="37" y2="25" stroke="white" strokeWidth="1.5" />
            <line x1="18" y1="18" x2="23" y2="23" stroke="white" strokeWidth="1.5" />
            <line x1="27" y1="27" x2="32" y2="32" stroke="white" strokeWidth="1.5" />
            <line x1="32" y1="18" x2="27" y2="23" stroke="white" strokeWidth="1.5" />
            <line x1="23" y1="27" x2="18" y2="32" stroke="white" strokeWidth="1.5" />
        </svg>
    );
};

export default AshokaChakra;
