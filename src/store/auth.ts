// store/auth.ts
import { defineStore } from 'pinia';

export interface AuthState {
    token: string | null;
    username: string | null;
    user_id: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        username: null,
        user_id: null,
    }),
    actions: {
        async login(credentials: { email: string; password: string }, backUrl:string) {
            try {
                const response = await fetch(`${backUrl}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });

                if (response.ok) {

                    const data = await response.json();
                    console.log(data)
                    this.token = data.token;
                    this.username = data.name;
                    this.user_id = data.user_id;
                } else {
                    console.error('HTTP error', response.status);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        },
        logout() {
            this.token = null;
            this.username = null;
            this.user_id = null;
        },
    },
});