<script lang="ts">
	import { onMount } from 'svelte';
	import { getTenders, getAuditLogs, createTender, type Tender, type AuditEntry } from '$lib/api';

	let tenders = $state<Tender[]>([]);
	let audits = $state<AuditEntry[]>([]);
	let loading = $state(true);

	let title = $state('');
	let description = $state('');
	let opening_date = $state('');
	let closing_date = $state('');
	let errorMsg = $state('');
	let successMsg = $state('');
	let submitting = $state(false);
	let showForm = $state(false);

	$effect(() => {
		if (successMsg) {
			const t = setTimeout(() => successMsg = '', 4000);
			return () => clearTimeout(t);
		}
	});

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

	onMount(() => { loadData(); });

	async function handleCreateTender(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';
		submitting = true;

		try {
			await createTender({ title, description, opening_date, closing_date });
			successMsg = `Tender "${title}" published successfully!`;
			title = ''; description = ''; opening_date = ''; closing_date = '';
			showForm = false;
			await loadData();
		} catch (err: any) {
			errorMsg = err.message || 'Failed to create tender.';
		} finally {
			submitting = false;
		}
	}

	function timeAgo(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'Just now';
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		return `${Math.floor(hrs / 24)}d ago`;
	}
</script>

<div class="officer-dash">
	<!-- Page Header -->
	<div class="page-header">
		<div>
			<h1 class="page-title">Officer Dashboard</h1>
			<p class="page-subtitle">Manage tenders and monitor system activity</p>
		</div>
		<button class="create-btn" onclick={() => { showForm = !showForm; errorMsg = ''; }}>
			{#if showForm}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
				Cancel
			{:else}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
				New Tender
			{/if}
		</button>
	</div>

	{#if loading}
		<div class="skeleton-grid">
			{#each Array(4) as _}
				<div class="skeleton-card"><div class="skeleton-line w60"></div><div class="skeleton-line w40"></div></div>
			{/each}
		</div>
	{:else}
		<!-- KPI Cards -->
		<div class="kpi-row">
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(201,162,39,0.12); color: #c9a227;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">{tenders.length}</span>
					<span class="kpi-label">Published Tenders</span>
				</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(59,130,246,0.1); color: #3b82f6;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">—</span>
					<span class="kpi-label">Total Bids Received</span>
				</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">{audits.length}</span>
					<span class="kpi-label">Audit Events</span>
				</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(168,85,247,0.1); color: #a855f7;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">Active</span>
					<span class="kpi-label">System Status</span>
				</div>
			</div>
		</div>

		{#if successMsg}
			<div class="toast-success">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				{successMsg}
			</div>
		{/if}

		<!-- Create Tender Form (Collapsible) -->
		{#if showForm}
			<div class="panel form-panel">
				<div class="panel-head">
					<h2 class="panel-title">Publish New Tender</h2>
				</div>
				<div class="panel-body">
					{#if errorMsg}<div class="form-error">{errorMsg}</div>{/if}
					<form onsubmit={handleCreateTender} class="create-form">
						<div class="form-row">
							<div class="field full">
								<label for="t-title">Tender Title</label>
								<input type="text" id="t-title" bind:value={title} required placeholder="e.g., Supply of Heavy Earth Moving Machinery" />
							</div>
						</div>
						<div class="form-row">
							<div class="field full">
								<label for="t-desc">Description</label>
								<textarea id="t-desc" bind:value={description} rows="3" required placeholder="Detailed scope of work and specifications..."></textarea>
							</div>
						</div>
						<div class="form-row two-col">
							<div class="field">
								<label for="t-open">Opening Date</label>
								<input type="date" id="t-open" bind:value={opening_date} required />
							</div>
							<div class="field">
								<label for="t-close">Closing Date</label>
								<input type="date" id="t-close" bind:value={closing_date} required />
							</div>
						</div>
						<div class="form-actions">
							<button type="submit" class="btn-publish" disabled={submitting}>
								{submitting ? 'Publishing...' : 'Publish Tender'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}

		<div class="content-grid">
			<!-- Tenders List -->
			<div class="panel">
				<div class="panel-head">
					<h2 class="panel-title">All Tenders</h2>
					<span class="panel-badge">{tenders.length}</span>
				</div>
				<div class="panel-body">
					{#if tenders.length === 0}
						<div class="empty-state">
							<p>No tenders published yet.</p>
						</div>
					{:else}
						<div class="tender-stack">
							{#each tenders as tender, i}
								<div class="t-row" style="animation-delay: {i * 0.04}s">
									<div class="t-row-left">
										<div class="t-row-icon">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
										</div>
										<div>
											<h4 class="t-row-title">{tender.title}</h4>
											<span class="t-row-meta">ID #{tender.id} · Closes {new Date(tender.closing_date).toLocaleDateString('en-IN')}</span>
										</div>
									</div>
									<span class="t-status-pill">Active</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Audit Timeline -->
			<div class="panel">
				<div class="panel-head">
					<h2 class="panel-title">Activity Feed</h2>
					<span class="panel-badge">{audits.length}</span>
				</div>
				<div class="panel-body">
					{#if audits.length === 0}
						<div class="empty-state"><p>No activity recorded yet.</p></div>
					{:else}
						<div class="timeline">
							{#each audits.slice(0, 12) as audit, i}
								<div class="timeline-item" style="animation-delay: {i * 0.04}s">
									<div class="timeline-dot"></div>
									<div class="timeline-content">
										<div class="timeline-top">
											<span class="timeline-action">{audit.action}</span>
											<span class="timeline-time">{timeAgo(audit.created_at)}</span>
										</div>
										{#if audit.details}
											<p class="timeline-detail">{audit.details}</p>
										{/if}
										<span class="timeline-user">{audit.username || 'System'}</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.officer-dash { display: flex; flex-direction: column; gap: 1.25rem; }

	.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem; }
	.page-title { font-size: 1.5rem; font-weight: 700; color: #1a1d21; }
	.page-subtitle { color: #6b7280; font-size: 0.9rem; margin-top: 0.2rem; }
	.create-btn {
		display: inline-flex; align-items: center; gap: 0.4rem;
		background: #0a2e1c; color: #fff; border: none; padding: 0.5rem 1rem;
		border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
	}
	.create-btn:hover { background: #174a30; }

	/* KPI */
	.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
	.kpi-card {
		background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 1rem;
		display: flex; align-items: center; gap: 0.75rem;
	}
	.kpi-icon { width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.kpi-data { display: flex; flex-direction: column; }
	.kpi-value { font-size: 1.35rem; font-weight: 700; color: #1a1d21; line-height: 1; }
	.kpi-label { font-size: 0.75rem; color: #6b7280; margin-top: 0.2rem; }

	/* Toast */
	.toast-success {
		display: flex; align-items: center; gap: 0.5rem;
		background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;
		padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500;
	}

	.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

	.panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
	.form-panel { }
	.panel-head { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #eee; }
	.panel-title { font-size: 0.95rem; font-weight: 600; color: #1a1d21; }
	.panel-badge { background: #f3f4f6; color: #374151; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
	.panel-body { padding: 1rem; }

	/* Form */
	.create-form { display: flex; flex-direction: column; gap: 0.75rem; }
	.form-row { display: flex; gap: 0.75rem; }
	.form-row.two-col { display: grid; grid-template-columns: 1fr 1fr; }
	.field { display: flex; flex-direction: column; gap: 0.3rem; }
	.field.full { flex: 1; }
	.field label { font-size: 0.8rem; font-weight: 600; color: #374151; }
	.field input, .field textarea {
		border: 1px solid #d1d5db; border-radius: 4px; padding: 0.5rem 0.6rem;
		font-size: 0.875rem; font-family: inherit; outline: none; background: #fff;
	}
	.field input:focus, .field textarea:focus {
		border-color: #0a2e1c; box-shadow: 0 0 0 2px rgba(10,46,28,0.1);
	}
	.form-error { background: #fee2e2; color: #991b1b; padding: 0.5rem 0.75rem; border-radius: 4px; font-size: 0.8rem; margin-bottom: 0.5rem; }
	.form-actions { display: flex; justify-content: flex-end; }
	.btn-publish {
		padding: 0.5rem 1.25rem; border-radius: 6px; border: none;
		background: #0a2e1c; color: #fff; font-size: 0.85rem; font-weight: 600;
		cursor: pointer;
	}
	.btn-publish:hover { background: #174a30; }
	.btn-publish:disabled { opacity: 0.5; cursor: not-allowed; }

	/* Tender Rows */
	.tender-stack { display: flex; flex-direction: column; gap: 0.35rem; }
	.t-row {
		display: flex; justify-content: space-between; align-items: center;
		padding: 0.7rem 0.75rem; border-bottom: 1px solid #f3f4f6;
	}
	.t-row:last-child { border-bottom: none; }
	.t-row:hover { background: #fafbfc; }
	.t-row-left { display: flex; align-items: center; gap: 0.6rem; }
	.t-row-icon { width: 28px; height: 28px; border-radius: 4px; background: #f3f4f6; color: #6b7280; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.t-row-title { font-size: 0.875rem; font-weight: 600; color: #1a1d21; }
	.t-row-meta { font-size: 0.75rem; color: #9ca3af; }
	.t-status-pill { font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 4px; background: #d1fae5; color: #065f46; }

	/* Timeline */
	.timeline { display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 1rem; }
	.timeline::before { content: ''; position: absolute; left: 4px; top: 4px; bottom: 4px; width: 1px; background: #e5e7eb; }
	.timeline-item { position: relative; padding: 0.5rem 0; }
	.timeline-dot { position: absolute; left: -1rem; top: 0.7rem; width: 8px; height: 8px; border-radius: 50%; background: #9ca3af; border: 2px solid #fff; }
	.timeline-content { padding-left: 0.5rem; }
	.timeline-top { display: flex; justify-content: space-between; align-items: center; }
	.timeline-action { font-size: 0.85rem; font-weight: 600; color: #1a1d21; }
	.timeline-time { font-size: 0.7rem; color: #9ca3af; }
	.timeline-detail { font-size: 0.8rem; color: #6b7280; margin-top: 0.15rem; }
	.timeline-user { font-size: 0.7rem; color: #9ca3af; margin-top: 0.15rem; display: block; }

	/* Empty & Skeleton */
	.empty-state { text-align: center; padding: 2rem; color: #9ca3af; }
	.skeleton-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
	.skeleton-card { background: #fff; border-radius: 6px; padding: 1.25rem; border: 1px solid #e5e7eb; }
	.skeleton-line { height: 10px; border-radius: 3px; background: #f3f4f6; margin-bottom: 0.6rem; }
	.w40 { width: 40%; } .w60 { width: 60%; }

	@media (max-width: 1024px) {
		.kpi-row { grid-template-columns: repeat(2, 1fr); }
		.content-grid { grid-template-columns: 1fr; }
	}
	@media (max-width: 640px) {
		.kpi-row { grid-template-columns: 1fr; }
		.page-header { flex-direction: column; gap: 0.75rem; }
	}
</style>
