<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Forbidden from '$lib/components/ui-extend/icons/Forbidden.svelte';
	import InternalError from '$lib/components/ui-extend/icons/InternalError.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import { HttpCode } from '$lib/types/base';

	const onBackSelectOrg = () => {
		goto(`/`);
	};

</script>

<div class="absolute left-1/2 top-1/4 flex -translate-x-1/2 flex-col items-center">
	{#if $page.status === HttpCode.Forbidden}
		<Forbidden class="text-[128px]" />
		<h1 class=" mb-4 text-[18px] text-slate-600">无权限访问</h1>
		<Button on:click={onBackSelectOrg}>重新选择组织</Button>
	{:else if $page.status === HttpCode.InternalError}
		<InternalError class="text-[128px]" />
		<h1 class=" mb-4 text-[18px] text-slate-600">系统内部错误</h1>
		<Button on:click={() => goto('/')}>返回首页</Button>
	{/if}
</div>
