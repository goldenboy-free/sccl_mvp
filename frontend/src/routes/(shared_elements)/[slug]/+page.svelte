<script lang="ts">
	import { page } from '$app/stores';

	const pages: Record<string, { title: string; icon: string; description: string }> = {
		'/about': {
			title: 'About SCCL',
			icon: '🏢',
			description: 'The Singareni Collieries Company Limited (SCCL) is a government coal mining company jointly owned by the Government of Telangana and the Government of India. Established in 1889, SCCL is the sole coal-producing company in the Telangana region.'
		},
		'/business': {
			title: 'Our Business',
			icon: '⛏️',
			description: 'SCCL operates 27 opencast and 18 underground mines across four districts of Telangana, producing over 65 million tonnes of coal annually. Our operations span coal production, power generation, and sustainable mining practices.'
		},
		'/performance': {
			title: 'Performance & Reports',
			icon: '📊',
			description: 'SCCL consistently achieves record-breaking production targets. Our performance metrics, annual reports, and financial statements are available for stakeholders and the public to review.'
		},
		'/sustainability': {
			title: 'Sustainability',
			icon: '🌱',
			description: 'SCCL is committed to responsible mining with a focus on environmental protection, community development through CSR initiatives, and world-class safety standards for our 48,000+ employees.'
		},
		'/careers': {
			title: 'Careers at SCCL',
			icon: '💼',
			description: 'Join one of India\'s leading coal mining enterprises. SCCL offers rewarding careers in mining engineering, environmental science, IT, management, and more. Check back for upcoming recruitment notifications.'
		}
	};

	let info = $derived(pages[$page.url.pathname] || { title: 'Page', icon: '📄', description: 'This page is under construction.' });
</script>

<svelte:head>
	<title>SCCL — {info.title}</title>
</svelte:head>

<section class="stub-page">
	<div class="stub-container">
		<span class="stub-icon">{info.icon}</span>
		<h1 class="stub-title">{info.title}</h1>
		<div class="stub-divider"></div>
		<p class="stub-desc">{info.description}</p>
		<a href="/" class="stub-back">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
			Back to Homepage
		</a>
	</div>
</section>

<style>
	.stub-page {
		min-height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		background: var(--light-gray, #f4f5f7);
	}
	.stub-container {
		max-width: 600px;
		text-align: center;
		background: #fff;
		padding: 3rem 2.5rem;
		border-radius: 16px;
		border: 1px solid #e2e5ea;
		box-shadow: 0 4px 24px rgba(0,0,0,0.06);
	}
	.stub-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
	}
	.stub-title {
		font-size: 1.75rem;
		font-weight: 800;
		color: #0a2e1c;
		margin-bottom: 0.75rem;
		letter-spacing: -0.02em;
	}
	.stub-divider {
		width: 3rem;
		height: 3px;
		background: #c9a227;
		border-radius: 2px;
		margin: 0 auto 1.5rem;
	}
	.stub-desc {
		color: #4b5563;
		font-size: 0.95rem;
		line-height: 1.7;
		margin-bottom: 2rem;
	}
	.stub-back {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #0a2e1c;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		padding: 0.6rem 1.25rem;
		border: 1px solid #e2e5ea;
		border-radius: 8px;
		transition: all 0.2s;
	}
	.stub-back:hover {
		background: #0a2e1c;
		color: #fff;
		border-color: #0a2e1c;
	}
</style>
