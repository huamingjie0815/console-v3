<script lang="ts">
	import Icon from '@iconify/svelte';
	export let alt = '';
</script>

<div class=" flex h-full w-full items-center justify-center">
	<Icon icon="lucide:loader-circle" class="animate-spin text-primary" />
	<span class="ml-1 text-secondary-foreground">{alt}</span>
</div>
