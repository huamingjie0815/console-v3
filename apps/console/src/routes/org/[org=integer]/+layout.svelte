<script lang="ts">
	import { page } from '$app/stores';
	import SideNav from '$lib/components/ui-extend/side-nav/SideNav.svelte';

	export let data;

	$: active = $page.url.pathname || '/';

</script>

<div class="h-full flex flex-row">
	<div class="h-full w-40">
		<SideNav menus={data.menus} {active} />
	</div>

	<div class="h-full flex-1 p-4 overflow-y-scroll">
		<slot></slot>
	</div>
</div>
