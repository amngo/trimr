// Application Constants
export const APP_NAME = 'trimr';
export const APP_DESCRIPTION = 'A simple and fast URL shortener';

// API Constants
export const API_ROUTES = {
    LINKS: '/api/links',
    AUTH: '/api/auth',
} as const;

// Default Values
export const DEFAULT_LINK_EXPIRATION_DAYS = 30;
export const DEFAULT_PAGE_SIZE = 20;

// UI Constants
export const TOAST_DURATION = 4000;
export const LOADING_DELAY = 150;

// External Services
export const FAVICON_SERVICE_URL = 'https://www.google.com/s2/favicons';
export const IPAPI_URL = 'https://ipapi.co';

// File Upload Limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;