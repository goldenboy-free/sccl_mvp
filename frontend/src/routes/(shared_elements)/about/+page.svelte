<script lang="ts">
	import PreConstruction from '$lib/assets/preconstruction.png';
	import AboutImage from '$lib/assets/aboutContent2.png';
	import AboutImage1 from '$lib/assets/aboutContent3.png';
	import AboutImage2 from '$lib/assets/aboutContent4.png';
	import AboutInfo from '$lib/components/AboutInfo.svelte';
	import { type AboutSectionContent } from '$lib/types/aboutPageTypes.types';

	const aboutSectionIntroContent: AboutSectionContent[] = [
		{
			image: PreConstruction,
			imageAlt: '',
			reverse: false,
			imageText1: 'The Spirit of Singareni...',
			imageText2: 'One Family One Vision One Mission',
			description: [
				'The Singareni Collieries Company Limited (SCCL) is a Government coal mining company jointly owned by the Government of Telangana and Government of India on a 51:49 equity basis. ',
				'The Singareni coal reserves stretch across 350 Km of the Pranahita – Godavari Valley of Telangana with a proven geological reserves aggregating to whopping 8791 million tonnes. SCCL is currently operating 17 opencast and 22 underground mines in 6 districts of Telangana with a manpower around 42,000.'
			],
			width: 700,
			height: 180
		},
		{
			image: AboutImage,
			imageAlt: '',
			reverse: true,
			imageText1: 'Pioneer in technology upgradation',
			description: [
				`While historically technology has been a critical factor in SCCL's ability to reduce environmental impacts and occupational hazards, the need to constantly increase productivity and cut costs has demanded that the company goes in for phased mechanization and adapts state-of-the-art technologies.`,
				`SCCL pioneered mechanization of coal mines in India by adopting coal drilling machines as far back as in 1937. In 1950 Shuttle Cars, Gathering Arm Loaders, Conveyors and Coal Plough Equipment were introduced. Later in a path breaking move to replace arduous manual labour, Road Headers, Load Haul Dumpers and Side Dump Loaders were gradually brought in.`,
				`A combination of modern machines in Open Cast Mining like Walking Draglines, Shovels and High Capacity Dumpers were introduced in 1975. In-pit Crushing and Conveyor technology for Over Burden removal and coal extraction was commissioned for the first time in Ramagundam Open Cast Mine with German assistance in 1994.`,
				`In 2002, Surface Miner Technology which not only facilitates cost reduction but also contributes to eco friendly mining, was introduced for the first time. Longwall technology in Under Ground Mining in 1983 and also Blasting Gallery (BG) Technology in 1989 were other notable introductions. Today, 1 No. Longwall , 5 Continuous Miners and 2 Nos. of Bolter Miners are working in SCCL.`,
				`Already the mechanization of Under Ground Mining has seen the commissioning of 107 Side Discharge Loaders and 10 Load Haul Dumpers that have enhanced safety and productivity`,
				`Almost all Under Ground Mines are having man-riding systems (chairlift and railcar) that have improved transportation inside the mines`,
				`Manual loading and carrying of coal is phased out in SCCL since 2019-20`
			],
			width: 800,
			height: 250
		}
	] as const;

	const aboutSectionRow2 = [
		`In a state that is fast emerging as the IT hub of the country and hosts one of the Asia's largest Technology Parks, it was but natural that IT entered the realm of mining as well. And SCCL made a head start in harnessing the benefits of IT by developing proprietary software for integrated Open Cast and Under Ground Mine Management Systems.`,
		`From automating the Personnel Records to Material Management Systems, many new measures were initiated in the IT sphere to improve productivity. To stay in tune with the online world, and keep customers and other stakeholders informed about the developments in SCCL, the company launched its website www.scclmines.com.`,
		`Initiatives that have cemented SCCL's strength in IT are Video Conferencing, Integrated Mine Management Applications and e-procurement. Digitization of mine plans by Minex Software was yet another major initiative. This software supports core areas of geological data management, opencast and underground mine design and scheduling.`,
		`Other IT initiatives that are on the anvil or are being implemented on an experimental basis include the use of Satellite based communication systems for monitoring Heavy Earth Moving Machinery using Global Positioning Systems and Biometric based Attendance Monitoring Systems. A dedicated cross-functional team forms the core of the Software Development Group to provide in-house software solutions and the company is all set to become an ERP based company in the coming years.`
	] as const;

	const aboutSectionRow3: AboutSectionContent[] = [
		{
			image: AboutImage1,
			imageAlt: '',
			imageText1: '',
			description: [
				`While the benefits of coal are countless, Coal Mining is an inherently environment damaging and degrading activity. Realizing this, SCCL has launched a number of 'eco-friendly practices' to mitigate the damage to environment and improve the quality of life. In all mining areas extensive green belts have been developed, and monitoring of air and water quality is done on a regular basis to assess the impact of mining on the environment and corrective steps are being implemented immediately. Opencast Mines are being restored to pre-mining conditions.`
			],
			reverse: false,
			width: 700,
			height: 165
		},
		{
			image: AboutImage2,
			imageAlt: '',
			imageText1: 'We Care',
			description: [
				`To encourage plantation and social forestry, free saplings are supplied to all the employees before the onset of monsoon. To reduce air pollution and also meet the social obligations of SCCL, the company supplies free LPG to its employees. SCCL is perhaps the only PSU to have introduced 'environment' as part of the curriculum in all its schools. In another innovative move, company has also introduced Eco Samman Awards to motivate employees who contribute to all round improvement of the environment.`,
				`A number of other key initiatives taken in the last four years include setting up of Sewage Treatment Plants, Effluent Treatment Plants, Bio-engineering of Over Burdens, Clonal Plantations, Medicinal Plantations and development of Eco-parks for which the company was conferred the Golden Peacock Award from the Institute of Directors in 2005 and became the first Coal Company in the country to bag this prestigious honour. The company also bagged the "National Fly Ash Utilization Award” in 2005 for its unique contributions towards Fly Ash Utilization. SCCL has for the first time also brought out a book titled "Eco-friendly Coal Mining - The Singareni Approach" highlighting the various innovative practices initiated at SCCL for environmentally sustainable coal mining.`
			],
			reverse: true,
			width: 750,
			height: 175
		}
	];
</script>

<svelte:head>
	<title>Singareni Collieries Company - About Page</title>
</svelte:head>

<main class="fullSection">
	<section>
    <h2 class="about__heading">About</h2>
		<p class="italic bold">
			Since 1889, a spark of enterprise has evolved into a force in modern mining.
		</p>
		<p class="italic bold">.... fuelling growth over a century.</p>
	</section>
	<section class="aboutPage__row-2">
		{#each aboutSectionIntroContent as content}
			<AboutInfo
				{...content}
			/>
		{/each}

		<section class="aboutPage__row">
			<h2 class="aboutPage__row__heading">From Heritage to Hi-Tech</h2>
			<section class="aboutPage__row__content">
				{#each aboutSectionRow2 as content}
					<p class="medium">{content}</p>
				{/each}
			</section>
		</section>

		<section class="aboutPage__row">
			<h2 class="aboutPage__row__heading">Responsible Mining. Planned Restoration</h2>
            {#each aboutSectionRow3 as content}
                <AboutInfo {...content} />
            {/each}
		</section>

        <section class="aboutPage__row">
            <h2 class="aboutPage__row__heading">SCCL's HR Planning Initiatives</h2>
            <section class="aboutPage__row__content">
                <p class="medium">
                    The Company's HR Planning Initiative, with an annual spend of over Rs. 14 Crores, aims at Training and Development of all its human assets. With a well established HR Department and 10 Vocational Training Centers and the Nargundkar Institute of Management at Ramagundam (a full fledged training institute), imparting of in-house training and skill upgradation is a constant activity at SCCL.
                </p>
            </section>
        </section>
	</section>
</main>

<style>
	.fullSection {
		flex-grow: 1;
		padding: 0.5rem;
	}

    .about__heading {
        font-size: 1.9rem;
        width: 100%;
        display: flex;
        justify-content: center;
        padding-block: 0.4rem;
        padding-inline: 0.9rem;
    }

	.italic {
		font-style: italic;
	}

	.aboutPage__row-2 {
		display: grid;
		gap: 1.2rem;
	}

	.aboutPage__row {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 0.6rem;
	}

	.aboutPage__row__heading {
		width: 100%;
		display: flex;
		justify-content: center;
        font-size: 1.9rem;
        padding-block: 0.5rem;
        padding-inline: 1rem;
	}

	.aboutPage__row__content {
		display: flex;
		gap: 0.39rem;
		flex-direction: column;
        padding: 0.6rem;
	}

    .bold {
        font-weight: bold;
    }
</style>
