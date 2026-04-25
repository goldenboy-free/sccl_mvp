import { writable } from 'svelte/store';
import type { AuthUser } from '$lib/api';

interface AuthState {
	token: string | null;
	user: AuthUser | null;
	isAuthenticated: boolean;
}

function createAuthStore() {
	const initial: AuthState = {
		token: null,
		user: null,
		isAuthenticated: false
	};

	const { subscribe, set, update } = writable<AuthState>(initial);

	return {
		subscribe,
		init() {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('sccl_token');
				const userStr = localStorage.getItem('sccl_user');
				if (token && userStr) {
					try {
						const user = JSON.parse(userStr);
						set({ token, user, isAuthenticated: true });
					} catch {
						localStorage.removeItem('sccl_token');
						localStorage.removeItem('sccl_user');
					}
				}
			}
		},
		login(token: string, user: AuthUser) {
			localStorage.setItem('sccl_token', token);
			localStorage.setItem('sccl_user', JSON.stringify(user));
			set({ token, user, isAuthenticated: true });
		},
		logout() {
			localStorage.removeItem('sccl_token');
			localStorage.removeItem('sccl_user');
			set({ token: null, user: null, isAuthenticated: false });
		}
	};
}

export const auth = createAuthStore();
