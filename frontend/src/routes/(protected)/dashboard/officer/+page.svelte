<script lang="ts">
	import { onMount } from 'svelte';
	import { getTenders, getAuditLogs, type Tender, type AuditEntry } from '$lib/api';
	// Ideally we would import createTender, but we need to add it to api.ts if it's not there.
	// Since api.ts doesn't export createTender yet, let's fetch it via request or add it.
	import { request } from '$lib/api';

	let tenders = $state<Tender[]>([]);
	let audits = $state<AuditEntry[]>([]);
	let loading = $state(true);

	// New Tender Form State
	let title = $state('');
	let description = $state('');
	let opening_date = $state('');
	let closing_date = $state('');
	let errorMsg = $state('');
	let successMsg = $state('');

	async function loadData() {
		loading = true;
		try {
			const [tData, aData] = await Promise.all([
				getTenders(),
				getAuditLogs().catch(() => [])
			]);
			tenders = tData;
			audits = aData;
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadData();
	});

	async function handleCreateTender(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';

		try {
			await request('/tenders/', {
				method: 'POST',
				body: JSON.stringify({ title, description, opening_date, closing_date })
			});
			successMsg = 'Tender created successfully!';
			title = ''; description = ''; opening_date = ''; closing_date = '';
			await loadData();
		} catch (err: any) {
			errorMsg = err.message || 'Failed to create tender.';
		}
	}
</script>

<div class="dashboard-content">
	<div class="header-section">
		<h1 class="portal-title">Officer Dashboard</h1>
		<p class="portal-tagline">Manage tenders and monitor system activity</p>
	</div>

	{#if loading}
		<p>Loading dashboard...</p>
	{:else}
		<!-- Create Tender Section -->
		<div class="card mb-4">
			<div class="card-header">
				<h2 class="card-title">Create New Tender</h2>
			</div>
			<div class="card-body">
				{#if errorMsg} <div class="error-banner">{errorMsg}</div> {/if}
				{#if successMsg} <div class="success-banner">{successMsg}</div> {/if}

				<form onsubmit={handleCreateTender} class="tender-form">
					<div class="field-group">
						<label for="title" class="field-label">Title</label>
						<input type="text" id="title" class="form-input" bind:value={title} required />
					</div>
					<div class="field-group">
						<label for="desc" class="field-label">Description</label>
						<textarea id="desc" class="form-input" bind:value={description} rows="2" required></textarea>
					</div>
					<div class="date-row">
						<div class="field-group">
							<label for="od" class="field-label">Opening Date</label>
							<input type="date" id="od" class="form-input" bind:value={opening_date} required />
						</div>
						<div class="field-group">
							<label for="cd" class="field-label">Closing Date</label>
							<input type="date" id="cd" class="form-input" bind:value={closing_date} required />
						</div>
					</div>
					<button type="submit" class="btn-primary">Publish Tender</button>
				</form>
			</div>
		</div>

		<div class="grid-layout">
			<!-- Tenders List -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">All Tenders</h2>
				</div>
				<div class="card-body">
					{#if tenders.length === 0}
						<p>No tenders found.</p>
					{:else}
						<div class="tender-list">
							{#each tenders as tender}
								<div class="tender-item">
									<div class="tender-info">
										<h4>{tender.title}</h4>
										<small>ID: #{tender.id} | Closes: {new Date(tender.closing_date).toLocaleDateString()}</small>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Audit Logs -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">Recent Activity (Audit)</h2>
				</div>
				<div class="card-body">
					{#if audits.length === 0}
						<p>No activity logged.</p>
					{:else}
						<ul class="audit-list">
							{#each audits.slice(0, 10) as audit}
								<li class="audit-item">
									<span class="audit-action">{audit.action}</span>
									<span class="audit-user">by {audit.username || 'System'}</span>
									<span class="audit-time">{new Date(audit.created_at).toLocaleString()}</span>
									{#if audit.details}
										<div class="audit-details">{audit.details}</div>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}
	.header-section { margin-bottom: var(--spacing-md); }
	.mb-4 { margin-bottom: var(--spacing-xl); }

	.grid-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-xl);
	}
	@media (min-width: 1024px) {
		.grid-layout { grid-template-columns: 1fr 1fr; }
	}

	.card {
		background: var(--bg-color);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		border: 1px solid var(--border-color);
		overflow: hidden;
	}
	.card-header {
		padding: var(--spacing-md) var(--spacing-lg);
		border-bottom: 1px solid var(--border-color);
		background-color: var(--bg-light);
	}
	.card-body { padding: var(--spacing-lg); }

	.tender-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}
	.date-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-md);
	}

	.tender-list { display: flex; flex-direction: column; gap: var(--spacing-md); }
	.tender-item {
		padding: var(--spacing-md);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-light);
	}
	.tender-info h4 { margin: 0 0 4px 0; color: var(--primary-color); }
	.tender-info small { color: var(--text-lighter); }

	.audit-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	.audit-item {
		padding: var(--spacing-sm) 0;
		border-bottom: 1px solid var(--border-color);
		font-size: 14px;
	}
	.audit-item:last-child { border-bottom: none; }
	.audit-action { font-weight: 600; color: var(--text-color); margin-right: 8px; }
	.audit-user { color: var(--text-light); margin-right: 8px; }
	.audit-time { color: var(--text-lighter); font-size: 12px; }
	.audit-details { color: var(--text-light); margin-top: 4px; font-style: italic; }

	.success-banner {
		background: #bbf7d0; color: #166534;
		padding: var(--spacing-sm); border-radius: var(--radius-md); margin-bottom: var(--spacing-md); font-size: 14px;
	}
	.error-banner {
		background: #fecaca; color: #991b1b;
		padding: var(--spacing-sm); border-radius: var(--radius-md); margin-bottom: var(--spacing-md); font-size: 14px;
	}
</style>
