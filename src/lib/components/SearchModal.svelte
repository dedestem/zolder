<script lang="ts">
	import { writable } from "svelte/store";

	export let open = false;
	export let onClose = () => {};

	let query = "";
	let results = writable<{ id: number; name: string; box_id: number }[]>([]);

	async function search() {
		if (!query) {
			results.set([]);
			return;
		}
		const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
		const data = await res.json();
		results.set(data);
	}

	function closeModal() {
		query = "";
		results.set([]);
		onClose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="blanket" on:click={closeModal}></div>
	<div class="modal">
		<button class="close-btn" on:click={closeModal}>×</button>
		<!-- svelte-ignore a11y_autofocus -->
		<input type="text" placeholder="Zoek item..." bind:value={query} on:input={search} autofocus />
		<ul>
			{#each $results as item (item.id)}
				<li>{item.name} — Doos #{item.box_id}</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.blanket {
		position: fixed;
		inset: 0;
		background-color: var(--token-color-blanket-normal);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--token-color-surface-default-normal);
		color: var(--token-color-text-default-normal);
		padding: var(--token-space-6);
		border-radius: var(--token-space-2);
		width: 400px;
		max-width: 90%;
		font-family: var(--token-font-main);
		z-index: 1001;
	}

	.close-btn {
		position: absolute;
		top: var(--token-space-4);
		right: var(--token-space-4);
		font-size: 1.5rem;
		background: none;
		border: none;
		color: var(--token-color-text-default-secondary);
		cursor: pointer;
	}

	input {
		width: 100%;
		padding: var(--token-space-2);
		margin-bottom: var(--token-space-4);
		background: var(--token-color-surface-overlay-normal);
		color: var(--token-color-text-default-normal);
		border: none;
		border-radius: var(--token-space-1);
		font-family: var(--token-font-main);
	}

	input:focus {
		outline: 2px solid var(--token-color-focusring);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: var(--token-space-2);
		font-family: var(--token-font-mono);
	}
</style>
