<script lang='ts'>
		let { children } = $props();
		let mobileMenuOpen = $state(false);
</script>

<header class="site-header" data-purpose="site-header">
	<div class="header-inner">
		<div class="logo-container" data-purpose="logo-container">
			<img
				alt="SCCL Logo"
				class="logo-img"
				src="/images/sccl-logo.gif"
			/>
			<a class="logo-text nav-link" href="/">SCCL</a>
		</div>
		<nav class="main-nav" class:mobile-open={mobileMenuOpen}>
			<a href="/about" class="nav-link" onclick={() => mobileMenuOpen = false}
				>About <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					></path></svg
				></a
			>
			<a href="/business" class="nav-link" onclick={() => mobileMenuOpen = false}
				>Business <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					></path></svg
				></a
			>
			<a href="/performance" class="nav-link" onclick={() => mobileMenuOpen = false}
				>Performance <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					></path></svg
				></a
			>
			<a href="/sustainability" class="nav-link" onclick={() => mobileMenuOpen = false}
				>Sustainability <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					></path></svg
				></a
			>
			<a href="/careers" class="nav-link" onclick={() => mobileMenuOpen = false}>Careers</a>
		</nav>
		<div class="header-icons">
			<button aria-label="Search" class="icon-btn">
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					></path></svg
				>
			</button>
			<a aria-label="User Account" class="icon-btn" href="/login">
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					></path></svg
				>
			</a>
			<button
				aria-label="Toggle menu"
				class="icon-btn hamburger-btn"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
			>
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileMenuOpen}
						<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
					{:else}
						<path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
					{/if}
				</svg>
			</button>
		</div>
	</div>
</header>

{@render children()}