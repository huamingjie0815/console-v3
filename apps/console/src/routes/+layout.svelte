<script lang="ts">
	import '../app.css';
	import { addCollection } from '@iconify/svelte';
	import { icons } from '@iconify-json/lucide';
	import { Toaster } from '@repo/ui/components/ui/sonner';
	import { setMode } from 'mode-watcher';
	setMode('light');
	addCollection(icons);
</script>

<slot></slot>
<Toaster />
