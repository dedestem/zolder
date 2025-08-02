<script lang="ts">
	import { Button, FlexWrapper, LinkButton, Loader, Space, toast } from '@davidnet/svelte-ui';
	import { page } from '$app/state';
	import type { Box } from '$lib/types';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { formatDate } from '$lib/utils';

	let id: string | undefined;
	let error: string = "Er ging iets fout.";
	let box: Box | null = null;
	let Loading = true;

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

				error = 'Error: ' + res.status + ' | ' + res.statusText
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
</script>

{#if id}
	<h1>Doos #{id}</h1>
{/if}
{#if Loading}
	<Loader />
{:else if box}
	<p>Ja geladen!</p>
	<p>Ik ben gemaakt op {formatDate(box.created_at)}</p>
	
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
			}}>
			Terug
		</Button>
	</FlexWrapper>
{/if}
