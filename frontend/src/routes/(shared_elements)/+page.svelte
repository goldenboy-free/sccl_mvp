<script lang="ts">
	import { onMount } from 'svelte';
	import { getTenders, type Tender } from '$lib/api';

	const slides = [
		{
			image: '/images/mine-operations.jpeg',
			alt: 'Open cast mine operations',
			title: 'Fueling the <br />Nation\'s Progress',
			subtitle: 'Responsible Mining, Sustainable Future.',
			cta: 'Explore Our Operations'
		},
		{
			image: '/images/mining-equipment.jpeg',
			alt: 'Coal production facility',
			title: 'Powering India\'s <br />Energy Future',
			subtitle: 'Leading coal production with world-class safety standards.',
			cta: 'View Production Stats'
		},
		{
			image: '/images/community-program.jpeg',
			alt: 'Community development program',
			title: 'Building Stronger <br />Communities',
			subtitle: 'Committed to social responsibility and sustainable growth.',
			cta: 'Our CSR Initiatives'
		}
	];

	let currentSlide = $state(0);
	let paused = $state(false);
	let intervalId: ReturnType<typeof setInterval>;
	let tenders = $state<Tender[]>([]);

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
	}

	function goToSlide(index: number) {
		currentSlide = index;
	}

	function formatDate(dateStr: string): string {
		try {
			return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
		} catch { return dateStr; }
	}

	onMount(async () => {
		intervalId = setInterval(() => {
			if (!paused) nextSlide();
		}, 6000);

		try {
			tenders = await getTenders();
		} catch {
			tenders = [];
		}

		return () => clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>SCCL — Fueling the Nation's Progress</title>
	<meta name="description" content="The Singareni Collieries Company Limited (SCCL) — India's leading coal mining enterprise. Explore operations, tenders, careers, and sustainability initiatives." />
</svelte:head>

<main>
	<!-- Hero Section -->
	<section
		class="hero-section"
		data-purpose="hero-slider"
		onmouseenter={() => paused = true}
		onmouseleave={() => paused = false}
	>
		{#each slides as slide, i}
			<img
				alt={slide.alt}
				class="hero-bg"
				class:hero-bg--active={i === currentSlide}
				src={slide.image}
			/>
		{/each}
		<div class="hero-overlay">
			<div class="container">
				<div class="hero-content">
					<h1 class="hero-title">{@html slides[currentSlide].title}</h1>
					<p class="hero-subtitle">{slides[currentSlide].subtitle}</p>
					<a href="#" class="btn-gold">{slides[currentSlide].cta}</a>
				</div>
			</div>
		</div>
		<button class="carousel-btn carousel-btn--left" onclick={prevSlide}>
			<svg class="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
				></path></svg
			>
		</button>
		<button class="carousel-btn carousel-btn--right" onclick={nextSlide}>
			<svg class="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
				></path></svg
			>
		</button>
		<div class="carousel-dots">
			{#each slides as _, i}
				<button
					class="carousel-dot"
					class:carousel-dot--active={i === currentSlide}
					onclick={() => goToSlide(i)}
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="stats-bar" data-purpose="stats-bar">
		<div class="container">
			<div class="stats-grid">
				<div class="stat-item">
					<div class="stat-number">65+</div>
					<div class="stat-label">Million Tonnes Annual Production</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">27</div>
					<div class="stat-label">Open Cast Mines</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">18</div>
					<div class="stat-label">Underground Mines</div>
				</div>
				<div class="stat-item">
					<div class="stat-number">48K+</div>
					<div class="stat-label">Employees Strong</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Portal Quick Links -->
	<section class="portal-section" data-purpose="portal-links">
		<div class="container">
			<div class="section-accent"></div>
			<h2 class="section-heading">Quick Access Portals</h2>
			<p class="section-subheading">Access SCCL services and portals with a single click</p>
			<div class="portal-grid">
				<div class="portal-card" data-purpose="portal-card">
					<div class="portal-icon">
						<svg class="icon-xl" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
							></path></svg
						>
					</div>
					<h3 class="portal-title">Customer Portal</h3>
					<a href="/login" class="btn-dark">Login to Portal</a>
				</div>

				<div class="portal-card" data-purpose="portal-card">
					<div class="portal-icon">
						<svg class="icon-xl" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm10 12h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V9h8v2zm0-4h-8V5h8v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2z"
							></path></svg
						>
					</div>
					<h3 class="portal-title">Vendor Portal</h3>
					<a href="#" class="btn-dark">Access Tenders &amp; Payments</a>
				</div>

				<div class="portal-card" data-purpose="portal-card">
					<div class="portal-icon">
						<svg class="icon-xl" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
							></path></svg
						>
					</div>
					<h3 class="portal-title">Employee Login</h3>
					<a href="#" class="btn-dark">Sign In</a>
				</div>
			</div>
		</div>
	</section>

	<!-- News & Tenders — NO duplicate images, using tags and icons instead -->
	<section class="news-section" data-purpose="news-section">
		<div class="container">
			<div class="section-accent"></div>
			<h2 class="section-heading">Latest News &amp; Tenders</h2>
			<p class="section-subheading">Stay updated with the latest from SCCL</p>
			<div class="news-grid">
				<div class="news-card">
					<div class="news-body">
						<span class="news-tag">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
							Production
						</span>
						<h4 class="news-title">SCCL Announces Record Production for Q3</h4>
						<p class="news-excerpt">
							SCCL achieved a remarkable milestone in Q3 production with record-breaking output across all mining areas for the period ending December...
						</p>
						<span class="news-time">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
							14 hours ago
						</span>
					</div>
				</div>

				{#each tenders.slice(0, 3) as tender}
				<div class="tender-card">
					<div class="tender-inner">
						<div class="tender-icon">
							<svg class="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
								></path></svg
							>
						</div>
						<span class="news-tag">Open Tender</span>
						<h4 class="news-title">{tender.title}</h4>
						<div class="tender-dates">
							<p>Published: <span class="tender-date">{formatDate(tender.opening_date)}</span></p>
							<p>Deadline: <span class="tender-date">{formatDate(tender.closing_date)}</span></p>
						</div>
					</div>
					<a href="/login" class="tender-link">View Details →</a>
				</div>
				{/each}

				<div class="news-card">
					<div class="news-body">
						<span class="news-tag">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
							CSR Initiative
						</span>
						<h4 class="news-title">SCCL Launches New CSR Program in Singareni</h4>
						<p class="news-excerpt">
							A Community Initiative CSR Program in Singareni aimed at local development and uplifting the communities around mining areas...
						</p>
						<span class="news-time">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
							12 hours ago
						</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Mission & Vision -->
	<section class="mv-section" data-purpose="mission-vision">
		<div class="container">
			<h2 class="mv-heading">Mission &amp; Vision</h2>
			<div class="mv-divider"></div>
			<div class="mv-grid">
				<div class="mv-item" data-purpose="mission-item">
					<div class="mv-icon">
						<svg class="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								d="M13 10V3L4 14h7v7l9-11h-7z"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							></path></svg
						>
					</div>
					<div>
						<h3 class="mv-title">Our Mission</h3>
						<p class="mv-text">
							To be a market leader in the coal mining industry, delivering value to stakeholders
							through safe, sustainable, and responsible practices.
						</p>
					</div>
				</div>

				<div class="mv-item" data-purpose="vision-item">
					<div class="mv-icon">
						<svg class="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							></path><path
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							></path></svg
						>
					</div>
					<div>
						<h3 class="mv-title">Our Vision</h3>
						<p class="mv-text">
							To empower the nation with energy security while preserving the environment and
							uplifting communities.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<!-- Footer -->
<footer class="site-footer" data-purpose="site-footer">
	<div class="container">
		<div class="footer-grid">
			<div class="footer-col">
				<h5 class="footer-heading">Quick Links</h5>
				<ul class="footer-list">
					<li><a href="/sitemap" class="footer-link">Sitemap</a></li>
					<li><a href="/contact" class="footer-link">Contact Us</a></li>
					<li><a href="/faqs" class="footer-link">FAQs</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<h5 class="footer-heading">About SCCL</h5>
				<ul class="footer-list">
					<li><a href="/about" class="footer-link">History</a></li>
					<li><a href="/about#leadership" class="footer-link">Leadership</a></li>
					<li><a href="/performance" class="footer-link">Reports</a></li>
				</ul>
			</div>

			<div class="footer-col">
				<h5 class="footer-heading">Sustainability</h5>
				<ul class="footer-list">
					<li><a href="/sustainability" class="footer-link">Environment</a></li>
					<li><a href="/sustainability#csr" class="footer-link">CSR</a></li>
					<li><a href="/sustainability#safety" class="footer-link">Safety</a></li>
				</ul>
			</div>

			<div class="footer-social">
				<a href="https://www.linkedin.com/company/scaboratories/" aria-label="LinkedIn" class="social-btn" target="_blank" rel="noopener noreferrer">
					<svg class="icon-sm" fill="currentColor" viewBox="0 0 24 24"
						><path
							d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
						></path></svg
					>
				</a>
				<a href="https://twitter.com/scaboratories" aria-label="Twitter" class="social-btn" target="_blank" rel="noopener noreferrer">
					<svg class="icon-sm" fill="currentColor" viewBox="0 0 24 24"
						><path
							d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
						></path></svg
					>
				</a>
				<a href="https://www.facebook.com/scaboratories" aria-label="Facebook" class="social-btn" target="_blank" rel="noopener noreferrer">
					<svg class="icon-sm" fill="currentColor" viewBox="0 0 24 24"
						><path
							d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
						></path></svg
					>
				</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>© The Singareni Collieries Company Limited</p>
			<p>All rights reserved.</p>
		</div>
	</div>
</footer>
