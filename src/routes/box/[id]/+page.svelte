<script lang="ts">
	import {
		Button,
		FlexWrapper,
		IconButton,
		LinkButton,
		Loader,
		Modal,
		Space,
		TextField,
		toast
	} from '@davidnet/svelte-ui';
	import { page } from '$app/state';
	import type { Box, BoxWithItems } from '$lib/types';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { formatDate } from '$lib/utils';
	import { goto } from '$app/navigation';

	let id: string | undefined;
	let error: string = 'Er ging iets fout.';
	let box: BoxWithItems | null = null;
	let Loading = true;
	let newitemname: string = '';
	let showDeleteBoxModal = false;

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
				icon: 'contextual_token_add',
				autoDismiss: 3000
			});
		} catch (error) {
			toast({
				title: 'Kon item niet toevoegen',
				desc: 'Netwerk Fout',
				icon: 'deployed_code_alert',
				appearance: 'danger',
				position: 'bottom-left'
			});
		}
	}

	async function DeleteBox() {
		if (!id) {
			return;
		}

		try {
			const response = await fetch(`/api/box/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorText = await response.text();
				toast({
					title: 'Kon doos niet verwijderen',
					desc: 'Error: ' + response.status + ' | ' + response.statusText,
					icon: 'deployed_code_alert',
					appearance: 'danger',
					position: 'bottom-left'
				});
				console.error('Error deleting box:', errorText);
				return;
			}

			toast({
				title: `Doos verwijderd.`,
				desc: `Doos #${id} is verwijderd.`,
				appearance: 'success',
				position: 'bottom-left',
				icon: 'delete_forever',
				autoDismiss: 7000
			});

			goto('/');
		} catch (error) {
			console.error('Network error:', error);
			toast({
				title: 'Kon doos niet verwijderen',
				desc: 'Netwerk Fout',
				icon: 'deployed_code_alert',
				appearance: 'danger',
				position: 'bottom-left'
			});
		}
	}

	async function DeleteItem(id: number, name: string) {
		try {
			const res = await fetch(`/api/item/${id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const errorText = await res.text();
				toast({
					title: 'Kon item niet verwijderen',
					desc: 'Error: ' + res.status + ' | ' + res.statusText,
					icon: 'deployed_code_alert',
					appearance: 'danger',
					position: 'bottom-left'
				});
				console.error('Error deleting item:', errorText);
				return;
			}

			const result = await res.json();
			console.log('Item deleted:', result);

			toast({
				title: `Item verwijderd.`,
				desc: `Item #${name} is verwijderd.`,
				appearance: 'info',
				position: 'bottom-left',
				icon: 'delete_forever',
				autoDismiss: 4000
			});
			if (box) {
				box.items = box.items.filter((item) => item.id !== id);
			}
		} catch (err) {
			toast({
				title: 'Kon item niet verwijderen',
				desc: 'Netwerk Fout',
				icon: 'deployed_code_alert',
				appearance: 'danger',
				position: 'bottom-left'
			});
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
		<div class="itemlist">
			{#each box.items as item}
				<div class="item">
					<strong>{item.name}</strong> — {formatDate(item.created_at)}
					<IconButton
						icon="delete_forever"
						appearance="danger"
						alt="delete item "
						onClick={() => {
							DeleteItem(item.id, item.name);
						}}
					/>
				</div>
			{/each}
		</div>
	{:else}
		<p>Deze doos is leeg.</p>
	{/if}

	<Space height="var(--token-space-6)" />
	<Button
		appearance="danger"
		onClick={() => {
			showDeleteBoxModal = true;
		}}
		iconbefore="delete_forever">Verwijder Doos</Button
	>
{:else}
	<Icon color="var(--token-color-text-danger)" icon="deployed_code_alert" size="10rem" />
	<Space height="var(--token-space-6)" />
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

{#if showDeleteBoxModal}
	<Modal
		title="Doos verwijderen?"
		titleIcon="delete_forever"
		desc="Weet je het zeker? De fysieke poster wordt ongeldig."
		hasCloseBtn
		on:close={() => (showDeleteBoxModal = false)}
		options={[
			{ appearance: 'danger', content: 'Doos verwijderen', onClick: DeleteBox },
			{ appearance: 'subtle', content: 'Annuleren', onClick: () => (showDeleteBoxModal = false) }
		]}
	/>
{/if}

<style>
	.item {
		background-color: var(--token-color-surface-sunken-normal);
		padding: 1rem 1rem;
		margin: 0px;
		border-radius: 20px;
	}

	.itemlist {
		display: flex;
		flex-direction: column;
		gap: var(--token-space-3);
	}
</style>
