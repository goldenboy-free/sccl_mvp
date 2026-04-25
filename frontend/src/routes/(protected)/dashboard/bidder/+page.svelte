<script lang="ts">
	import { onMount } from 'svelte';
	import { getTenders, getBidsByUser, submitBid, type Tender, type Bid } from '$lib/api';
	import { auth } from '$lib/stores/auth';

	let tenders = $state<Tender[]>([]);
	let myBids = $state<Bid[]>([]);
	let loading = $state(true);
	let bidAmount = $state('');
	let selectedTender = $state<Tender | null>(null);
	let errorMsg = $state('');
	let successMsg = $state('');
	let submitting = $state(false);

	$effect(() => {
		if (successMsg) {
			const t = setTimeout(() => successMsg = '', 4000);
			return () => clearTimeout(t);
		}
	});

	async function loadData() {
		loading = true;
		try {
			const [tData, bData] = await Promise.all([
				getTenders(),
				$auth.user ? getBidsByUser($auth.user.id.toString()) : Promise.resolve([])
			]);
			tenders = tData;
			myBids = bData;
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}

	onMount(() => { loadData(); });

	async function handleBid(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';

		if (!selectedTender || !bidAmount) {
			errorMsg = 'Please provide a bid amount.';
			return;
		}

		submitting = true;
		try {
			await submitBid(selectedTender.id.toString(), bidAmount);
			successMsg = `Bid of ₹${Number(bidAmount).toLocaleString('en-IN')} submitted for "${selectedTender.title}"!`;
			selectedTender = null;
			bidAmount = '';
			await loadData();
		} catch (err: any) {
			errorMsg = err.message || 'Failed to submit bid.';
		} finally {
			submitting = false;
		}
	}

	function getStatusColor(status: string): string {
		switch(status) {
			case 'accepted': return 'badge-success';
			case 'rejected': return 'badge-danger';
			default: return 'badge-warning';
		}
	}

	function closingIn(dateStr: string): string {
		const diff = new Date(dateStr).getTime() - Date.now();
		if (diff < 0) return 'Closed';
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		if (days === 0) return 'Today';
		if (days === 1) return 'Tomorrow';
		return `${days} days`;
	}
</script>

<div class="bidder-dash">
	<!-- Page Header -->
	<div class="page-header">
		<div>
			<h1 class="page-title">Bidder Dashboard</h1>
			<p class="page-subtitle">View active tenders and manage your bids</p>
		</div>
	</div>

	{#if loading}
		<div class="skeleton-grid">
			{#each Array(3) as _}
				<div class="skeleton-card"><div class="skeleton-line w60"></div><div class="skeleton-line w40"></div><div class="skeleton-line w80"></div></div>
			{/each}
		</div>
	{:else}
		<!-- KPI Cards -->
		<div class="kpi-row">
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(201,162,39,0.12); color: #c9a227;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">{tenders.length}</span>
					<span class="kpi-label">Active Tenders</span>
				</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(59,130,246,0.1); color: #3b82f6;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">{myBids.length}</span>
					<span class="kpi-label">Bids Placed</span>
				</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">{myBids.filter(b => b.status === 'accepted').length}</span>
					<span class="kpi-label">Accepted</span>
				</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-icon" style="background: rgba(249,115,22,0.1); color: #f97316;">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<div class="kpi-data">
					<span class="kpi-value">{myBids.filter(b => b.status === 'pending').length}</span>
					<span class="kpi-label">Pending</span>
				</div>
			</div>
		</div>

		{#if successMsg}
			<div class="toast-success">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
				{successMsg}
			</div>
		{/if}

		<div class="content-grid">
			<!-- Active Tenders -->
			<div class="panel">
				<div class="panel-head">
					<h2 class="panel-title">Available Tenders</h2>
					<span class="panel-badge">{tenders.length}</span>
				</div>
				<div class="panel-body">
					{#if tenders.length === 0}
						<div class="empty-state">
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
							<p>No active tenders available.</p>
						</div>
					{:else}
						<div class="tender-stack">
							{#each tenders as tender, i}
								<div class="t-card" style="animation-delay: {i * 0.05}s">
									<div class="t-card-top">
										<div class="t-id">#{tender.id}</div>
										<span class="t-closing">{closingIn(tender.closing_date)}</span>
									</div>
									<h4 class="t-title">{tender.title}</h4>
									<p class="t-desc">{tender.description}</p>
									<div class="t-footer">
										<span class="t-date">Closes: {new Date(tender.closing_date).toLocaleDateString('en-IN')}</span>
										<button class="bid-btn" onclick={() => { selectedTender = tender; successMsg=''; errorMsg=''; }}>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
											Place Bid
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- My Bids -->
			<div class="panel">
				<div class="panel-head">
					<h2 class="panel-title">My Bids</h2>
					<span class="panel-badge">{myBids.length}</span>
				</div>
				<div class="panel-body">
					{#if myBids.length === 0}
						<div class="empty-state">
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
							<p>You haven't placed any bids yet.</p>
						</div>
					{:else}
						<div class="table-wrap">
							<table class="dtable">
								<thead>
									<tr>
										<th>Tender</th>
										<th>Amount</th>
										<th>Status</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{#each myBids as bid}
										<tr>
											<td class="td-id">#{bid.tender_id}</td>
											<td class="td-amount">₹{Number(bid.amount).toLocaleString('en-IN')}</td>
											<td><span class="badge {getStatusColor(bid.status)}">{bid.status}</span></td>
											<td class="td-date">{new Date(bid.created_at).toLocaleDateString('en-IN')}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Bid Modal -->
	{#if selectedTender}
		<div class="modal-overlay" onclick={() => selectedTender = null}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="modal" role="dialog" onclick={(e) => e.stopPropagation()}>
				<div class="modal-head">
					<h3>Submit Bid</h3>
					<button class="modal-close" onclick={() => selectedTender = null}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</button>
				</div>

				<div class="modal-tender-info">
					<span class="modal-tid">Tender #{selectedTender.id}</span>
					<p class="modal-ttitle">{selectedTender.title}</p>
				</div>

				{#if errorMsg}<div class="form-error">{errorMsg}</div>{/if}

				<form onsubmit={handleBid}>
					<div class="field">
						<label for="bid-amount">Bid Amount (₹)</label>
						<div class="input-group">
							<span class="input-prefix">₹</span>
							<input type="number" id="bid-amount" bind:value={bidAmount} min="1" step="0.01" required placeholder="Enter your bid amount" />
						</div>
					</div>
					<div class="modal-actions">
						<button type="button" class="btn-cancel" onclick={() => selectedTender = null}>Cancel</button>
						<button type="submit" class="btn-submit" disabled={submitting}>
							{submitting ? 'Submitting...' : 'Submit Bid'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.bidder-dash { display: flex; flex-direction: column; gap: 1.5rem; }

	/* Page Header */
	.page-header { margin-bottom: 0.5rem; }
	.page-title { font-size: 1.75rem; font-weight: 800; color: #0a2e1c; letter-spacing: -0.02em; }
	.page-subtitle { color: #6b7280; font-size: 0.95rem; margin-top: 0.25rem; }

	/* KPI Cards */
	.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
	.kpi-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: all 0.25s;
	}
	.kpi-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
	.kpi-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.kpi-data { display: flex; flex-direction: column; }
	.kpi-value { font-size: 1.5rem; font-weight: 800; color: #0a2e1c; line-height: 1; }
	.kpi-label { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.25rem; }

	/* Toast */
	.toast-success {
		display: flex; align-items: center; gap: 0.5rem;
		background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;
		padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.85rem; font-weight: 500;
		animation: slideIn 0.3s ease;
	}
	@keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

	/* Content Grid */
	.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

	/* Panels */
	.panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; }
	.panel-head {
		display: flex; justify-content: space-between; align-items: center;
		padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; background: #fafbfc;
	}
	.panel-title { font-size: 1rem; font-weight: 700; color: #0a2e1c; }
	.panel-badge {
		background: rgba(201,162,39,0.12); color: #92700c;
		padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700;
	}
	.panel-body { padding: 1.25rem; }

	/* Tender Cards */
	.tender-stack { display: flex; flex-direction: column; gap: 0.75rem; }
	.t-card {
		padding: 1rem; border: 1px solid #f3f4f6; border-radius: 10px;
		transition: all 0.2s; animation: fadeUp 0.3s ease both;
	}
	.t-card:hover { border-color: #c9a227; box-shadow: 0 2px 12px rgba(201,162,39,0.08); }
	@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
	.t-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
	.t-id { font-size: 0.7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
	.t-closing { font-size: 0.7rem; font-weight: 600; color: #f97316; background: rgba(249,115,22,0.08); padding: 0.15rem 0.5rem; border-radius: 999px; }
	.t-title { font-size: 0.95rem; font-weight: 700; color: #1a1d21; margin-bottom: 0.35rem; line-height: 1.3; }
	.t-desc { font-size: 0.8rem; color: #6b7280; line-height: 1.5; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.t-footer { display: flex; justify-content: space-between; align-items: center; }
	.t-date { font-size: 0.75rem; color: #9ca3af; }
	.bid-btn {
		display: inline-flex; align-items: center; gap: 0.35rem;
		background: #0a2e1c; color: #fff; border: none; padding: 0.45rem 0.85rem;
		border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
	}
	.bid-btn:hover { background: #c9a227; color: #0a2e1c; transform: translateY(-1px); }

	/* Table */
	.table-wrap { overflow-x: auto; }
	.dtable { width: 100%; border-collapse: collapse; }
	.dtable th { font-size: 0.7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; text-align: left; padding: 0.65rem 0.75rem; border-bottom: 1px solid #f3f4f6; }
	.dtable td { padding: 0.75rem; border-bottom: 1px solid #f9fafb; font-size: 0.85rem; }
	.dtable tr:hover { background: #fafbfc; }
	.td-id { font-weight: 600; color: #6b7280; }
	.td-amount { font-weight: 700; color: #0a2e1c; }
	.td-date { color: #9ca3af; font-size: 0.8rem; }
	.badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
	.badge-warning { background: #fef3c7; color: #92400e; }
	.badge-success { background: #d1fae5; color: #065f46; }
	.badge-danger { background: #fee2e2; color: #991b1b; }

	/* Empty States */
	.empty-state { text-align: center; padding: 2rem 1rem; color: #9ca3af; }
	.empty-state p { margin-top: 0.75rem; font-size: 0.9rem; }

	/* Skeleton */
	.skeleton-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
	.skeleton-card { background: #fff; border-radius: 12px; padding: 1.5rem; border: 1px solid #e5e7eb; }
	.skeleton-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200%; animation: shimmer 1.5s infinite; margin-bottom: 0.75rem; }
	.w40 { width: 40%; } .w60 { width: 60%; } .w80 { width: 80%; }
	@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

	/* Modal */
	.modal-overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
		display: flex; align-items: center; justify-content: center; z-index: 100;
		animation: fadeIn 0.2s ease;
	}
	@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
	.modal {
		background: #fff; border-radius: 16px; width: 100%; max-width: 420px;
		padding: 1.5rem; box-shadow: 0 24px 64px rgba(0,0,0,0.2);
		animation: modalUp 0.3s ease;
	}
	@keyframes modalUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
	.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
	.modal-head h3 { font-size: 1.1rem; font-weight: 700; color: #0a2e1c; }
	.modal-close { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.25rem; border-radius: 6px; transition: all 0.2s; }
	.modal-close:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
	.modal-tender-info { background: #f9fafb; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; }
	.modal-tid { font-size: 0.7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
	.modal-ttitle { font-size: 0.9rem; font-weight: 600; color: #1a1d21; margin-top: 0.25rem; }
	.form-error { background: #fee2e2; color: #991b1b; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.8rem; margin-bottom: 0.75rem; }
	.field { margin-bottom: 1rem; }
	.field label { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
	.input-group { display: flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
	.input-group:focus-within { border-color: #c9a227; box-shadow: 0 0 0 3px rgba(201,162,39,0.1); }
	.input-prefix { padding: 0 0.75rem; background: #f9fafb; color: #6b7280; font-weight: 600; border-right: 1px solid #e5e7eb; font-size: 0.9rem; line-height: 2.5rem; }
	.input-group input { flex: 1; border: none; padding: 0 0.75rem; font-size: 0.9rem; height: 2.5rem; outline: none; background: transparent; }
	.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.25rem; }
	.btn-cancel { padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #6b7280; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
	.btn-cancel:hover { background: #f9fafb; }
	.btn-submit { padding: 0.55rem 1.25rem; border-radius: 8px; border: none; background: #0a2e1c; color: #fff; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
	.btn-submit:hover { background: #c9a227; color: #0a2e1c; }
	.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

	@media (max-width: 1024px) {
		.kpi-row { grid-template-columns: repeat(2, 1fr); }
		.content-grid { grid-template-columns: 1fr; }
	}
	@media (max-width: 640px) {
		.kpi-row { grid-template-columns: 1fr; }
	}
</style>
