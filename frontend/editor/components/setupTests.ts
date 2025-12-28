import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder in Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

