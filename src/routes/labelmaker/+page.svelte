<script lang="ts">
	import { labels } from '$lib/stores/labels';
	import type { Label } from '$lib/types';
	import { Button, FlexWrapper, IconButton, LinkButton, Space } from '@davidnet/svelte-ui';

	async function DeleteLabel(id: number) {
		labels.update((current) => current.filter((label) => label.id !== id));
	}
	
	async function PrintLabels() {

	}
</script>

{#if $labels.length}
	<div class="labels">
		{#each $labels as label (label.id)}
			<div class="label">
				Doos #{label.id}

				<IconButton
					icon="delete_forever"
					appearance="danger"
					alt="Verwijder label van print lijst."
					onClick={() => {
						DeleteLabel(label.id);
					}}
				/>
			</div>
		{/each}
	</div>
	<Button appearance="primary" onClick={PrintLabels} iconbefore="print">Print labels</Button>
{:else}
	<h1>Geen labels in de labelmaker.</h1>
	<p>Voeg labels toe door op "Maak label" te klikken bij dozen.</p>
	<Space height="var(--token-space-6)" />
	<FlexWrapper direction="row" gap="10px">
		<LinkButton href="/" appearance="primary">Home</LinkButton>
		<Button
			appearance="subtle"
			onClick={() => {
				history.back();
			}}
		>
			Terug
		</Button>
	</FlexWrapper>
{/if}

<style>
	.label {
		display: flex;
		flex-direction: row;
		background-color: var(--token-color-surface-sunken-normal);
		padding: 1rem 1rem;
		min-width: 16rem;
		margin: 0px;
		border-radius: 20px;
		align-items: center;
		justify-content: space-around;
	}

	.labels {
		display: flex;
		flex-direction: column;
		gap: var(--token-space-3);
		overflow-y: scroll;
		padding: 1rem;
	}
</style>
