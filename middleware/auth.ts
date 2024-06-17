// middleware/auth.ts
import { useAuthStore } from '~/src/store/auth';
import { useCookie } from 'nuxt/app';
import { jwtDecode } from 'jwt-decode';
import type { DecodedTokenType } from '~/src/types/types.vue';

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    const tokenCookie = useCookie('token');
    const token = tokenCookie.value;

    if (token) {
        try {
            const decodedToken = jwtDecode(token) as DecodedTokenType;
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                // Token has expired
                authStore.logout();
                if (to.path !== '/') {
                    return navigateTo('/');
                }
            } else {
                // Token is valid
                authStore.token = token;
                authStore.user_id = decodedToken.sub;
                authStore.username = decodedToken.userName;
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
            authStore.logout();
            if (to.path !== '/') {
                return navigateTo('/');
            }
        }
    } else {
        authStore.logout();
        if (to.path !== '/') {
            return navigateTo('/');
        }
    }

    if (to.path === '/' && authStore.token) {
        return navigateTo('/ideas');
    }
});