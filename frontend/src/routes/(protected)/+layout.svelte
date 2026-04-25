<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';

	let { children } = $props();
	let loading = $state(true);
	let sidebarOpen = $state(true);

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

	function getInitial(name: string | undefined): string {
		return name ? name.charAt(0).toUpperCase() : '?';
	}
</script>

{#if loading}
	<div class="loading-screen">
		<div class="loader-ring">
			<div class="ring"></div>
			<span class="loader-logo">SCCL</span>
		</div>
		<p class="loader-text">Authenticating...</p>
	</div>
{:else}
	<div class="dash-shell" class:sidebar-collapsed={!sidebarOpen}>
		<!-- Sidebar -->
		<aside class="dash-sidebar">
			<div class="sidebar-brand">
				<div class="brand-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				{#if sidebarOpen}<span class="brand-name">SCCL Portal</span>{/if}
			</div>

			<nav class="sidebar-nav">
				<a href="/" class="sidebar-link">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"/></svg>
					{#if sidebarOpen}<span>Home</span>{/if}
				</a>

				{#if $auth.user?.role === 'admin'}
					<a href="/dashboard/officer" class="sidebar-link active">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
						{#if sidebarOpen}<span>Dashboard</span>{/if}
					</a>
				{:else}
					<a href="/dashboard/bidder" class="sidebar-link active">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
						{#if sidebarOpen}<span>Dashboard</span>{/if}
					</a>
				{/if}
			</nav>

			<div class="sidebar-footer">
				<div class="user-card">
					<div class="user-avatar">{getInitial($auth.user?.username)}</div>
					{#if sidebarOpen}
						<div class="user-details">
							<span class="user-name">{$auth.user?.username}</span>
							<span class="user-role">{$auth.user?.role === 'admin' ? 'Officer' : 'Bidder'}</span>
						</div>
					{/if}
				</div>
				<button class="logout-btn" onclick={handleLogout} title="Logout">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/></svg>
					{#if sidebarOpen}<span>Logout</span>{/if}
				</button>
			</div>
		</aside>

		<!-- Main Content Area -->
		<div class="dash-content-area">
			<header class="dash-topbar">
				<button class="toggle-sidebar" onclick={() => sidebarOpen = !sidebarOpen} title="Toggle Sidebar">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</button>
				<div class="topbar-right">
					<span class="role-pill">{$auth.user?.role === 'admin' ? '🛡️ Officer' : '📋 Bidder'}</span>
					<span class="greeting">Welcome, <strong>{$auth.user?.username}</strong></span>
				</div>
			</header>
			<main class="dash-main">
				{@render children()}
			</main>
		</div>
	</div>
{/if}

<style>
	/* Loading Screen */
	.loading-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: linear-gradient(135deg, #0a2e1c 0%, #113322 50%, #0d3d24 100%);
	}
	.loader-ring {
		position: relative;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
	}
	.ring {
		position: absolute;
		inset: 0;
		border: 3px solid rgba(201,162,39,0.15);
		border-top: 3px solid #c9a227;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	.loader-logo {
		font-size: 1rem;
		font-weight: 800;
		color: #c9a227;
		letter-spacing: 0.1em;
	}
	.loader-text {
		color: rgba(255,255,255,0.5);
		font-size: 0.85rem;
	}
	@keyframes spin { to { transform: rotate(360deg); } }

	/* Shell Layout */
	.dash-shell {
		display: flex;
		min-height: 100vh;
		background: #f1f5f0;
	}

	/* Sidebar */
	.dash-sidebar {
		width: 260px;
		background: linear-gradient(180deg, #0a2e1c 0%, #0d3d24 100%);
		color: #fff;
		display: flex;
		flex-direction: column;
		padding: 1.5rem 1rem;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: sticky;
		top: 0;
		height: 100vh;
		overflow-y: auto;
		z-index: 20;
	}
	.sidebar-collapsed .dash-sidebar {
		width: 72px;
		padding: 1.5rem 0.75rem;
		align-items: center;
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 1.5rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.08);
	}
	.brand-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: rgba(201,162,39,0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #c9a227;
		flex-shrink: 0;
	}
	.brand-name {
		font-size: 1.1rem;
		font-weight: 700;
		color: #c9a227;
		letter-spacing: 0.04em;
	}

	.sidebar-nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.sidebar-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 0.85rem;
		border-radius: 8px;
		color: rgba(255,255,255,0.6);
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s ease;
		text-decoration: none;
	}
	.sidebar-link:hover {
		color: #fff;
		background: rgba(255,255,255,0.06);
	}
	.sidebar-link.active {
		color: #c9a227;
		background: rgba(201,162,39,0.1);
		font-weight: 600;
	}

	.sidebar-footer {
		padding-top: 1rem;
		margin-top: 1rem;
		border-top: 1px solid rgba(255,255,255,0.08);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.user-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.user-avatar {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: linear-gradient(135deg, #c9a227 0%, #b8921f 100%);
		color: #0a2e1c;
		font-weight: 700;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.user-details {
		display: flex;
		flex-direction: column;
	}
	.user-name {
		font-size: 0.85rem;
		font-weight: 600;
		color: #fff;
	}
	.user-role {
		font-size: 0.7rem;
		color: rgba(255,255,255,0.4);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.logout-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 500;
		color: rgba(255,255,255,0.5);
		background: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
	}
	.logout-btn:hover {
		color: #ef4444;
		background: rgba(239,68,68,0.08);
	}

	/* Top Bar */
	.dash-content-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.dash-topbar {
		height: 60px;
		background: #fff;
		border-bottom: 1px solid #e2e5ea;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.5rem;
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.toggle-sidebar {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		border: 1px solid #e2e5ea;
		background: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #4b5563;
		transition: all 0.2s;
	}
	.toggle-sidebar:hover {
		background: #f4f5f7;
		color: #0a2e1c;
	}
	.topbar-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.role-pill {
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		background: rgba(201,162,39,0.1);
		color: #0a2e1c;
		font-size: 0.8rem;
		font-weight: 600;
	}
	.greeting {
		font-size: 0.9rem;
		color: #4b5563;
	}
	.greeting strong {
		color: #0a2e1c;
	}

	/* Main Content */
	.dash-main {
		padding: 2rem;
		flex: 1;
	}

	@media (max-width: 768px) {
		.dash-sidebar {
			width: 72px;
			padding: 1.5rem 0.75rem;
			align-items: center;
		}
		.brand-name, .sidebar-link span, .user-details, .logout-btn span {
			display: none;
		}
		.dash-main { padding: 1rem; }
		.role-pill { display: none; }
	}
</style>
