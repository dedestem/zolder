<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import {
		ThemeProvider,
		Toaster,
		ConnectivityCheck,
		ThemeMenu,
		FlexWrapper,
		Space,
		IconButton,
		LinkIconButton
	} from '@davidnet/svelte-ui';
</script>

<ThemeProvider />
<Toaster />
<ConnectivityCheck />

<nav>
	<div style="justify-content: left;" class="nav-part">
		<a class="logo-btn" href="/">
			<Icon icon="inventory_2" />
			<Space width="var(--token-space-2)" />
			Zolder Opruimer
		</a>
	</div>
	<div style="justify-content: center;" class="nav-part">
		<div class="searchbar">
			<button on:click={() => {}}>Spullen Zoeker</button>
			<Icon icon="search" size="1.5rem" />
		</div>
	</div>
	<div style="justify-content: right;" class="nav-part">
		<IconButton
			icon="arrow_back"
			onClick={() => {
				history.back();
			}}
			alt="Terug"
		/>
		<LinkIconButton icon="new_label" alt="Labelmaker" appearance="subtle" href="/labelmaker/" />


		<ThemeMenu />
		<a href="https://davidnet.net">
			<img
				src="https://design.davidnet.net/images/logos/DNLogo.png"
				alt="Icon of davidnet that navigates to the davidnet website"
				height="30px"
			/>
		</a>
	</div>
</nav>

<main>
	<FlexWrapper
		direction="column"
		justifycontent="center"
		alignitems="center"
		height="100%"
		width="100%"
	>
		<slot />
	</FlexWrapper>
</main>

<style>
	nav {
		display: flex;
		height: 48px;
		background-color: var(--token-color-surface-raised-normal);
		padding: 4px 16px;
		margin: 0;
	}

	.logo-btn {
		display: flex;
		color: var(--token-color-text);
		text-decoration: none;
	}

	.searchbar {
		display: flex;
		align-items: center;
		background-color: var(--token-color-surface-sunken-normal);
		border-radius: 8px;
		padding: 8px;
		width: 100%;
	}

	.searchbar:hover,
	.searchbar button:hover {
		background-color: var(--token-color-surface-overlay-hover);
		cursor: text;
	}

	.searchbar button {
		border: none;
		background: transparent;
		color: var(--token-color-text);
		width: 100%;
	}

	.nav-part {
		flex: 1;
		display: flex;
		align-items: center;
	}

	main {
		height: calc((100vh - 56px) - 4rem);
		height: calc((100dvh - 56px) - 4rem);
		width: calc(100vw - 4rem);
		width: calc(100dvw - 4rem);
		padding: 2rem;
	}
</style>
