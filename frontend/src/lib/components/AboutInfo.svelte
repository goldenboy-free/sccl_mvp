<script lang="ts">
	import { type AboutSectionContent } from '$lib/types/aboutPageTypes.types';

    type Props = AboutSectionContent
	const props: Props = $props();
</script>

<section
	class="aboutInfo"
	class:aboutSection={!props.reverse}
	class:aboutSection__reverse={props.reverse}
>
	<section class="aboutSection__imageSection" class:aboutSection__col2={props.reverse}>
		<img
			src={props.image}
			alt={props.imageAlt}
			class="aboutSectionImages"
			width={props.width}
			height={props.height}
		/>
		<section class="aboutSection__imageSection__content">
			<p class="small">{props.imageText1}</p>
			<p class="small">{props.imageText2}</p>
		</section>
	</section>
	<section
		class="medium aboutSection__content"
		class:aboutSection__content__two={props.description.length > 1}
		class:aboutSection__col1={props.reverse}
	>
		{#each props.description as information}
			<p>
				{information}
			</p>
		{/each}
	</section>
</section>

<style>
    .aboutInfo {
		display: grid;
		padding: 0.6rem;
		gap: 0.3rem;
		align-items: center;
	}

	.aboutSection {
		grid-template-columns: 0.25fr 0.75fr;
	}

	.aboutSection__reverse {
		grid-template-columns: 0.75fr 0.25fr;
	}

	.aboutSection__imageSection {
		padding: 0.35rem;
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
	}

	.aboutSection__imageSection__content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.18rem;
	}

	.aboutSection__col1 {
		grid-row-start: 1;
		grid-column-start: 1;
		grid-column-end: 2;
	}

	.aboutSection__col2 {
		grid-column-start: 2;
		grid-column-end: 3;
	}

	.aboutSection__content__two {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.aboutSectionImages {
		object-fit: contain;
        aspect-ratio: 1 / 1;
	}
</style>