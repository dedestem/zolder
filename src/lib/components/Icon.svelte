<script lang="ts">
    export let icon: string;
    export let size: string = "1rem";
    export let color: string = "var(--token-color-text)";
</script>

<span style="color: {color}; font-size: {size};" class="icon material-symbols-outlined" translate="no" aria-hidden="true">{icon}</span>