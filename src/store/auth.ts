// store/auth.ts
import { defineStore } from 'pinia';
import { useCookie } from 'nuxt/app';
import { jwtDecode } from 'jwt-decode';
import type { DecodedTokenType } from '~/src/types/types.vue';

export interface AuthState {
    token: string | null;
    username: string | null;
    user_id: string | null;
    loginError: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        username: null,
        user_id: null,
        loginError: null,
    }),
    actions: {
        async login(credentials: { email: string; password: string }, backUrl: string) {
            try {
                const response = await fetch(`${backUrl}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    this.token = data.token;
                    this.loginError = null; // Clear any previous login error

                    // Decode the token to extract user information
                    const decodedToken = jwtDecode(data.token) as DecodedTokenType;
                    this.user_id = decodedToken.sub;
                    this.username = decodedToken.userName;
                    const expirationDate = new Date(decodedToken.exp * 1000); // Convert to milliseconds

                    // Set the token in a secure cookie
                    const tokenCookie = useCookie('token', {
                        httpOnly: false,
                        secure: process.client && window.location.protocol === 'https:',
                        sameSite: 'strict',
                        expires: expirationDate, // Set the expiration date based on the JWT expiration
                    });
                    tokenCookie.value = data.token;
                } else {
                    console.error('HTTP error', response.status);
                    const errorData = await response.json();
                    this.loginError = errorData.error || 'Login failed. Please try again.';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                this.loginError = 'An error occurred. Please try again later.';
            }
        },
        logout() {
            this.token = null;
            this.username = null;
            this.user_id = null;
            this.loginError = null; // Clear any login error

            // Remove the token cookie
            const tokenCookie = useCookie('token');
            tokenCookie.value = null;
        },
    },
});