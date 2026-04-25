<script lang="ts">
	import { onMount } from 'svelte';
	import { getTenders, getBidsByUser, submitBid, type Tender, type Bid } from '$lib/api';
	import { auth } from '$lib/stores/auth';

	let tenders = $state<Tender[]>([]);
	let myBids = $state<Bid[]>([]);
	let loading = $state(true);
	let bidAmount = $state('');
	let selectedTenderId = $state<string | null>(null);
	let errorMsg = $state('');
	let successMsg = $state('');

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

	onMount(() => {
		loadData();
	});

	async function handleBid(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';

		if (!selectedTenderId || !bidAmount) {
			errorMsg = 'Please provide a bid amount.';
			return;
		}

		try {
			await submitBid({
				tender_id: parseInt(selectedTenderId),
				amount: parseFloat(bidAmount)
			});
			successMsg = 'Bid submitted successfully!';
			selectedTenderId = null;
			bidAmount = '';
			await loadData();
		} catch (err: any) {
			errorMsg = err.message || 'Failed to submit bid.';
		}
	}
</script>

<div class="dashboard-content">
	<div class="header-section">
		<h1 class="portal-title">Bidder Dashboard</h1>
		<p class="portal-tagline">View active tenders and manage your bids</p>
	</div>

	{#if loading}
		<p>Loading your dashboard...</p>
	{:else}
		<div class="grid-layout">
			<!-- Active Tenders -->
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">Active Tenders</h2>
				</div>
				<div class="card-body">
					{#if tenders.length === 0}
						<p>No active tenders available.</p>
					{:else}
						<div class="tender-list">
							{#each tenders as tender}
								<div class="tender-item">
									<div class="tender-info">
										<h4>{tender.title}</h4>
										<p>{tender.description}</p>
										<small>Closes: {new Date(tender.closing_date).toLocaleDateString()}</small>
									</div>
									<div class="tender-actions">
										<button 
											class="btn-primary btn-sm" 
											onclick={() => { selectedTenderId = tender.id.toString(); successMsg=''; errorMsg=''; }}
										>
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
			<div class="card">
				<div class="card-header">
					<h2 class="card-title">My Recent Bids</h2>
				</div>
				<div class="card-body">
					{#if myBids.length === 0}
						<p>You have not placed any bids yet.</p>
					{:else}
						<table class="data-table">
							<thead>
								<tr>
									<th>Tender ID</th>
									<th>Amount (₹)</th>
									<th>Status</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{#each myBids as bid}
									<tr>
										<td>#{bid.tender_id}</td>
										<td>₹{Number(bid.amount).toLocaleString('en-IN')}</td>
										<td><span class="status-badge {bid.status}">{bid.status}</span></td>
										<td>{new Date(bid.created_at).toLocaleDateString()}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Bid Modal (Simple Inline Form for now) -->
	{#if selectedTenderId}
		<div class="modal-backdrop">
			<div class="modal-card">
				<h3>Submit Bid for Tender #{selectedTenderId}</h3>
				
				{#if errorMsg}
					<div class="error-banner">{errorMsg}</div>
				{/if}
				{#if successMsg}
					<div class="success-banner">{successMsg}</div>
				{/if}

				<form onsubmit={handleBid}>
					<div class="field-group">
						<label for="amount" class="field-label">Bid Amount (₹)</label>
						<input type="number" id="amount" class="form-input" bind:value={bidAmount} min="1" step="0.01" required />
					</div>
					<div class="action-group mt-4">
						<button type="submit" class="btn-primary">Submit Bid</button>
						<button type="button" class="btn-secondary" onclick={() => selectedTenderId = null}>Cancel</button>
					</div>
				</form>
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
	.header-section {
		margin-bottom: var(--spacing-lg);
	}
	.grid-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-xl);
	}
	@media (min-width: 1024px) {
		.grid-layout {
			grid-template-columns: 1fr 1fr;
		}
	}
	.card {
		background: var(--bg-color);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		overflow: hidden;
		border: 1px solid var(--border-color);
	}
	.card-header {
		padding: var(--spacing-md) var(--spacing-lg);
		border-bottom: 1px solid var(--border-color);
		background-color: var(--bg-light);
	}
	.card-body {
		padding: var(--spacing-lg);
	}
	.tender-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}
	.tender-item {
		padding: var(--spacing-md);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-light);
	}
	.tender-info h4 { margin: 0 0 4px 0; color: var(--primary-color); }
	.tender-info p { margin: 0 0 8px 0; font-size: 14px; color: var(--text-light); }
	.tender-info small { color: var(--text-lighter); }
	
	.data-table {
		width: 100%;
		border-collapse: collapse;
	}
	.data-table th, .data-table td {
		padding: var(--spacing-sm);
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}
	.data-table th {
		font-weight: 600;
		color: var(--text-light);
		background: var(--bg-light);
	}
	.status-badge {
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
	}
	.status-badge.pending { background: #fef08a; color: #854d0e; }
	.status-badge.accepted { background: #bbf7d0; color: #166534; }
	.status-badge.rejected { background: #fecaca; color: #991b1b; }

	.modal-backdrop {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	.modal-card {
		background: var(--bg-color);
		padding: var(--spacing-xl);
		border-radius: var(--radius-lg);
		width: 100%;
		max-width: 400px;
		box-shadow: var(--shadow-xl);
	}
	.mt-4 { margin-top: var(--spacing-lg); }
	.success-banner {
		background: #bbf7d0; color: #166534;
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		margin-bottom: var(--spacing-md);
		font-size: 14px;
	}
	.error-banner {
		background: #fecaca; color: #991b1b;
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		margin-bottom: var(--spacing-md);
		font-size: 14px;
	}
</style>
