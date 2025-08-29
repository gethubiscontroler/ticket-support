import { AuthTokens, User } from "../types/auth";

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'user_info';

export const tokenStorage = {
    getTokens: (): AuthTokens | null => {
        try {
            const tokens = localStorage.getItem(TOKEN_KEY);
            return tokens ? JSON.parse(tokens) : null;
        } catch {
            return null;
        }
    },

    setTokens: (tokens: AuthTokens): void => {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    },

    removeTokens: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getUser: (): User | null => {
        try {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    setUser: (user: User): void => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
};