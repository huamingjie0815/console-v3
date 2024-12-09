<script lang="ts">
	import MainHeader from '$lib/components/ui-extend/main-header/MainHeader.svelte';

	import { page } from '$app/stores';

	export let data;

	let orgId: string | undefined;
	$: {
		orgId = $page.params.org;
	}
</script>

<div class="h-full flex-col">
	<MainHeader projectName={data.projectName} user={data.user} orgs={data.orgs} {orgId} />
	<div class="h-[calc(100%-2.75rem)]">
		<slot></slot>
	</div>
</div>
