<script lang="ts">
	import {
		Button,
		FlexWrapper,
		LinkButton,
		Loader,
		Space,
		TextField,
		toast
	} from '@davidnet/svelte-ui';
	import { page } from '$app/state';
	import type { Box, BoxWithItems } from '$lib/types';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { formatDate } from '$lib/utils';

	let id: string | undefined;
	let error: string = 'Er ging iets fout.';
	let box: BoxWithItems | null = null;
	let Loading = true;
	let newitemname: string = '';

	onMount(async () => {
		id = page.params.id;
		Loading = true;
		box = null;

		if (!id) {
			return;
		}

		try {
			const res = await fetch(`/api/box/${id}`);
			if (!res.ok) {
				if (res.status == 404) {
					toast({
						title: 'Doos [' + id + '] bestaat niet!',
						desc: 'Zorg ervoor dat je een geldig ID hebt.',
						icon: 'deployed_code_alert',
						appearance: 'danger',
						position: 'bottom-left',
						autoDismiss: 5000
					});

					error = 'Doos [' + id + '] bestaat niet!';
					console.warn("Box doesn't exist.");
					return;
				}

				toast({
					title: 'Kon doos [' + id + '] niet ophalen',
					desc: 'Error: ' + res.status + ' | ' + res.statusText,
					icon: 'deployed_code_alert',
					appearance: 'danger',
					position: 'bottom-left'
				});

				error = 'Error: ' + res.status + ' | ' + res.statusText;
				console.error('Could not load box info: ' + res.status + ' | ' + res.statusText);
				return;
			}
			box = await res.json();
		} catch (e) {
			error = (e as Error).message;
		} finally {
			Loading = false;
		}
	});

	async function CreateItem() {
		const NewItemName = newitemname?.trim(); // Remove leading/trailing spaces

		if (!NewItemName) {
			console.error('Item name is required.');
			return;
		}

		if (!box) {
			console.error('Box is not loaded.');
			return;
		}

		try {
			const response = await fetch('/api/item', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					box_id: box.id,
					name: NewItemName
				})
			});

			if (!response.ok) {
				const error = await response.json();
				toast({
					title: 'Kon item niet toevoegen',
					desc: 'Error: ' + response.status + ' | ' + response.statusText,
					icon: 'deployed_code_alert',
					appearance: 'danger',
					position: 'bottom-left'
				});
				console.error('Failed to create item:', error);
				return;
			}

			const createdItem = await response.json();
			console.log('Created item:', createdItem);

			box.items = [...box.items, createdItem];

			newitemname = '';

			toast({
				title: `Item toegevoegd`,
				desc: `"${createdItem.name}" is toegevoegd aan doos #${box.id}.`,
				appearance: 'success',
				position: 'bottom-left',
				icon: "box_add",
				autoDismiss: 3000
			});
		} catch (error) {
			console.error('Error creating item:', error);
		}
	}
</script>

{#if id}
	<h1>Doos #{id}</h1>
{/if}
{#if Loading}
	<Loader />
{:else if box}
	<p>Ik ben gemaakt op {formatDate(box.created_at)}</p>

	<h2>Item toevoegen</h2>
	<FlexWrapper direction="row" gap="10px">
		<TextField
			type="text"
			placeholder="Item naam"
			bind:value={newitemname}
			label="Naam van nieuw item."
			onEnter={CreateItem}
		/>
		<Button appearance="primary" onClick={CreateItem} iconafter="box_add">Toevoegen</Button>
	</FlexWrapper>
	<Space height="var(--token-space-6)" />
	{#if box.items.length > 0}
		<h2>Items in doos:</h2>
		<ul>
			{#each box.items as item}
				<li>
					<strong>{item.name}</strong> — aangemaakt op {formatDate(item.created_at)}
					<Space height="var(--token-space-2)"/>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Deze doos is leeg.</p>
	{/if}
{:else}
	<Icon color="var(--token-color-text-danger)" icon="deployed_code_alert" size="10rem" />
	<span>{error}</span>
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
