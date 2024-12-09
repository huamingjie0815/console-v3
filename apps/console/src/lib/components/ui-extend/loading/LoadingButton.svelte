<script lang="ts">
	import { Button } from '@repo/ui/components/ui/button';
	import Icon from '@iconify/svelte';

	export let loading: boolean = false;
</script>

<Button disabled={loading} {...$$restProps} on:click on:keydown>
	{#if loading}
		<Icon icon="lucide:loader-circle" class="mr-1 animate-spin" />
	{/if}
	<slot></slot>
</Button>
