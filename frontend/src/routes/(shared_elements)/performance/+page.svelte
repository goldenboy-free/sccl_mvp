<script lang="ts">
</script>

<svelte:head>
    <title>Singareni Collieries Company - Performance Page</title>
</svelte:head>

<main class="fullPage">
	<h2 class="performancePage__heading">Performance</h2>
	<section>
		<section class="section__row1">
			<h3 class="section__heading">Production</h3>
			<section class="section__table__container">
				<table>
					<thead>
						<tr class="white">
							<td colspan="12" class="center"><strong>PERFORMANCE OF SCCL AT A GLANCE</strong></td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="colName">&nbsp;</td>
							<td class="colName center bolder">2015-16</td>
							<td class="colName center bolder">2016-17</td>
							<td class="colName center bolder">2017-18</td>
							<td class="colName center bolder">2018-19</td>
							<td class="colName center bolder">2019-20</td>
							<td class="colName center bolder">2020-21</td>
							<td class="colName center bolder">2021-22</td>
							<td class="colName center bolder">2022-23</td>
							<td class="colName center bolder">2023-24</td>
							<td class="colName center bolder">2024-25</td>
							<td class="colName center bolder">2025-26</td>
						</tr>
						<tr>
							<td class="rowName center" width="22%"
								><strong>Coal Production (Mill.Tons)</strong></td
							>
							<td class="center filled"> 61.34</td>
							<td class="center notFilled"> 60.38</td>
							<td class="center filled">62.01</td>
							<td class="center notFilled">64.40</td>
							<td class="center filled">64.02</td>
							<td class="center notFilled">50.58</td>
							<td class="center filled">65.02</td>
							<td class="center notFilled">67.14</td>
							<td class="center filled">70.02</td>
							<td class="center notFilled">69.01</td>
							<td class="center filled">58.00</td>
						</tr>
						<tr>
							<td class="rowName center" width="22%"
								><strong>Coal despatches (Mill.Tons)</strong></td
							>
							<td class="center filled"> 60.84</td>
							<td class="center notFilled"> 58.68</td>
							<td class="center filled">64.62</td>
							<td class="center notFilled">67.67</td>
							<td class="center filled">62.45</td>
							<td class="center notFilled">48.51</td>
							<td class="center filled">65.53</td>
							<td class="center notFilled">66.69</td>
							<td class="center filled">69.86</td>
							<td class="center notFilled">65.23</td>
							<td class="center filled">62.07</td>
						</tr>
						<tr>
							<td class="rowName center" width="22%"
								><strong>Productivity(overall OMS)(T)</strong></td
							>
							<td class="center filled"> 4.75</td>
							<td class="center notFilled"> 4.74</td>
							<td class="center filled">4.88</td>
							<td class="center notFilled">6.23</td>
							<td class="center filled">6.39</td>
							<td class="center notFilled">5.62</td>
							<td class="center filled">6.09</td>
							<td class="center notFilled">5.33</td>
							<td class="center filled">5.41</td>
							<td class="center notFilled">5.79</td>
							<td class="center filled">7.56</td>
						</tr>
						<tr>
							<td class="rowName center" width="22%"><strong>OB Removal(Mill.Cu.Mtr)</strong></td>
							<td class="center filled"> 315.00</td>
							<td class="center notFilled"> 310.76</td>
							<td class="center filled">392.75</td>
							<td class="center notFilled">377.15</td>
							<td class="center filled">353.43</td>
							<td class="center notFilled">322.00</td>
							<td class="center filled">383.39</td>
							<td class="center notFilled">410.11</td>
							<td class="center filled">417.34</td>
							<td class="center notFilled">391.93</td>
							<td class="center filled">367.90</td>
						</tr>
						<tr>
							<td class="rowName center" width="22%"
								><strong>Manpower (as on 31st March of that financial year ending)</strong></td
							>
							<td class="center filled">56,282 </td>
							<td class="center notFilled">58,491 </td>
							<td class="center filled">54043</td>
							<td class="center notFilled">48942</td>
							<td class="center filled">46021</td>
							<td class="center notFilled">43895</td>
							<td class="center filled">43672</td>
							<td class="center notFilled">42733</td>
							<td class="center filled">41837</td>
							<td class="center notFilled">40716</td>
							<td class="center notFilled">40335</td>
						</tr>
					</tbody>
				</table>
			</section>
			<a
				href="https://scclmines.com/TestFold/ScclPerf/46.pdf"
				class="performancePage__link"
                target="_blank"
				>View Provisional Production and Dispatches Performance of SCCL up to January 2026</a
			>
		</section>
		<section>
			<h3 class="section__heading">Financial</h3>
			<p class="report-notice">📄 Financial reports will be available for download soon.</p>
		</section>
	</section>
</main>

<style>
	.fullPage {
		flex-grow: 1;
	}

	.performancePage__heading {
		font-size: 1.9rem;
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 0.8rem 0.5rem;
	}

	.section__heading {
		font-size: 1.35rem;
		padding-block: 0.75rem;
		padding-inline: 0.6rem;
	}

	.white {
		background-color: #fafafa;
	}

	.bolder {
		font-weight: 800;
	}

	.center {
		text-align: center;
		padding: 0.5rem;
	}

	.notFilled {
		background-color: #dbead7;
	}

	.filled {
		background-color: #bcd8b4;
	}

	.rowName {
		background-color: #f8efcd;
	}

	.colName {
		background-color: #ebebeb;
	}

	.section__row1 {
		padding: 0.3rem 0.54rem;
	}

	.section__table__container {
		padding-inline: 1.15rem;
		padding-block: 1.4rem;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.performancePage__link {
		padding: 0.4rem 0.7rem;
		outline: 0.1rem solid #1a1a1a;
		border-radius: 0.4rem;
	}

	.report-notice {
		padding: 0.75rem 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		color: #6b7280;
		font-size: 0.9rem;
		margin: 0.5rem 1.15rem;
	}
</style>
