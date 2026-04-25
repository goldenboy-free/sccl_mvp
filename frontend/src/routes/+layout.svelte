<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/css/style.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="pageStyle">
	{@render children()}
</section>

<style>
	.pageStyle {
		height: 100dvh;
		display: flex;
		flex-direction: column;
	}
</style>
