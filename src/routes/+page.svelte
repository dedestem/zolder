<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, LinkButton, Modal, Space, toast } from '@davidnet/svelte-ui';
	import type { Box } from '$lib/types';
	import { formatDate } from '$lib/utils';

	let boxes: Box[] = [];

	function sortBoxes() {
		// Sorteer boxes in oplopende volgorde met id.
		boxes = boxes.sort((a, b) => a.id - b.id);
	}

	onMount(async () => {
		const res = await fetch('/api/boxes');
		if (!res.ok) {
			toast({
				title: 'Kon dozen niet ophalen',
				desc: 'Error: ' + res.status + ' | ' + res.statusText,
				icon: 'deployed_code_alert',
				appearance: 'danger',
				position: 'bottom-left'
			});
			console.error("Could not load boxes: " + res.status + " | " + res.statusText);
			return;
		}

		boxes = await res.json();
		sortBoxes();
	});

	let showAddBoxModal = false;
	async function AddBox() {
		showAddBoxModal = false;

		const res = await fetch('/api/box/', {
			method: 'POST'
		});

		if (res.ok) {
			const newBox: Box = await res.json();
			boxes = [...boxes, newBox];
			sortBoxes();
			toast({
				title: 'Doos toegevoegd',
				desc: 'Doos ' + newBox.id + ' is succesvol aangemaakt.',
				icon: 'package_2',
				appearance: 'success',
				position: 'bottom-left',
				autoDismiss: 3000
			});
		} else {
			toast({
				title: 'Doos niet toegevoegd',
				desc: 'Error: ' + res.status + ' | ' + res.statusText,
				icon: 'deployed_code_alert',
				appearance: 'danger',
				position: 'bottom-left'
			});
			console.error("Could not create box: " + res.status + " | " + res.statusText)
		}
	}
</script>

<h1 class="title">Zolder Opruimer</h1>
<p>Vind spullen op de zolder via de zoekbalk hierboven.</p>
<Space height="var(--token-space-6)" />

<h1>Alle dozen</h1>

{#if boxes.length === 0}
	<p>Kon geen dozen vinden.</p>
{:else}
	<div class="grid">
		{#each boxes as box}
			<div class="box">
				<div class="box-id">{box.id}</div>
				<div class="box-date">Aangemaakt: <br />{formatDate(box.created_at)}</div>
				<LinkButton appearance="subtle" href="/box/{box.id}/">Open</LinkButton>
			</div>
		{/each}
	</div>
{/if}

<Space height="var(--token-space-4)" />

<Button
	onClick={() => {
		showAddBoxModal = true;
	}}
	appearance="primary"
	iconbefore="box_add"
>
	Doos toevoegen
</Button>

{#if showAddBoxModal}
	<Modal
		title="Doos toevoegen"
		titleIcon="box_add"
		desc="Weet je zeker dat je een doos wil toevoegen?"
		hasCloseBtn
		on:close={() => (showAddBoxModal = false)}
		options={[
			{ appearance: 'primary', content: 'Doos toevoegen', onClick: AddBox },
			{ appearance: 'subtle', content: 'Annuleren', onClick: () => (showAddBoxModal = false) }
		]}
	/>
{/if}

<style>
	.title {
		font-size: 5rem;
		margin-bottom: 0px;
	}

	.grid {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.box {
		padding: 1rem;
		border: 1px solid var(--token-color-text-default-tertiary);
		border-radius: 8px;
		background: var(--token-color-surface-raised-normal);
		text-align: center;
		height: 8rem;
		width: 8rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.box-id {
		font-size: 3rem;
		font-weight: bold;
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	.box-date {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--token-color-text-default-disabled);
	}
</style>
