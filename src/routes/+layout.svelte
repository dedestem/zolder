<script lang="ts">
	import { ThemeProvider, Toaster, ConnectivityCheck, ThemeMenu } from "@davidnet/svelte-ui";
</script>

<ThemeProvider />
<Toaster />
<ConnectivityCheck />
<ThemeMenu/>
<slot />
