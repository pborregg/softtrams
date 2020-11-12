import {ENV} from './../core/env.config';

interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
};

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: '[AUTH0_CLIENT_ID]',
    CLIENT_DOMAIN: '[AUTH0_CLIENT_DOMAIN]', // e.g., you.auth0.com
    AUDIENCE: '[YOUR_AUTH0_API_AUDIENCE]', // e.g., http://localhost:3000/api/
    REDIRECT: `${ENV.BASE_URI}/callback`,
    SCOPE: 'openid profile'
};