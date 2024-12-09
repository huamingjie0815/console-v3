<script lang="ts">
	import MainHeader from '$lib/components/ui-extend/main-header/MainHeader.svelte';

	import { page } from '$app/stores';

	export let data;

	let orgId: string | undefined;
	$: {
		orgId = $page.params.org;
	}
</script>

<div class="flex h-full flex-col">
	<MainHeader projectName={data.projectName} user={data.user} orgs={data.orgs} {orgId} />
	<div class=" flex-1">
		<slot></slot>
	</div>
</div>
