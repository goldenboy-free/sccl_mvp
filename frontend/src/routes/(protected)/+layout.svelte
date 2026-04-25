<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';

	let { children } = $props();
	let loading = $state(true);

	onMount(() => {
		auth.init();
		
		const unsubscribe = auth.subscribe((state) => {
			if (!state.isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('sccl_token')) {
				goto('/login');
			} else {
				loading = false;
			}
		});

		return unsubscribe;
	});

	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

{#if loading}
	<div class="loading-screen">
		<div class="spinner"></div>
		<p>Authenticating...</p>
	</div>
{:else}
	<div class="dashboard-layout">
		<header class="dashboard-header">
			<div class="logo">SCCL Portal</div>
			<div class="user-info">
				<span class="role-badge">{$auth.user?.role}</span>
				<span class="username">{$auth.user?.username}</span>
				<button class="btn-secondary btn-sm" onclick={handleLogout}>Logout</button>
			</div>
		</header>
		<main class="dashboard-main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.loading-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: var(--bg-color);
	}
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--border-color);
		border-top: 4px solid var(--primary-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: var(--spacing-md);
	}
	@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

	.dashboard-layout {
		min-height: 100vh;
		background-color: var(--bg-light);
	}
	.dashboard-header {
		background-color: var(--bg-color);
		border-bottom: 1px solid var(--border-color);
		padding: var(--spacing-md) var(--spacing-xl);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.logo {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--primary-color);
	}
	.user-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}
	.role-badge {
		background-color: var(--accent-light);
		color: var(--accent-dark);
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
	}
	.username {
		font-weight: 500;
		color: var(--text-color);
	}
	.btn-sm {
		padding: 6px 12px;
		font-size: 13px;
	}
	.dashboard-main {
		padding: var(--spacing-xl);
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
