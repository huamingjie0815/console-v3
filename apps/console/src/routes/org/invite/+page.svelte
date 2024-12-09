<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ErrorBoundary from '$lib/components/ui-extend/error-boundary/ErrorBoundary.svelte';
	import Loading from '$lib/components/ui-extend/loading/Loading.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import msg from '$lib/utils/message.js';
	import pageReq from '$lib/utils/page-request.js';

	export let data;

	const onAccept = async (accept: boolean) => {
		try {
			const orgId = $page.url.searchParams.get('orgId');
			const inviteId = $page.url.searchParams.get('inviteId');
			const resp = await pageReq.post<{
				result: boolean;
			}>(`/org/invite`, {
				inviteId,
				orgId,
				accept
			});
			msg.success('已邀请')
			if (accept && resp.data?.result) {
				goto(`/org/${orgId}`);
			} else {
				goto('/org');
			}
		} catch (err: any) {
			msg.error('系统异常:' + err.message);
		}
	};
</script>

<div class=" absolute left-1/2 top-1/3 flex -translate-x-1/2 flex-col items-center p-3">
	{#if data.error}
		<p class="mb-4">{data.error}</p>
		<Button on:click={() => goto(`/`)}>返回</Button>
	{:else if data.inviteDetail}
		{#if data.inviteDetail.result === 0}
			<p class="mb-4">{`是否接受 OrgId: ${data.inviteDetail.orgId} 的邀请？`}</p>
			<div class="flex flex-row items-center gap-3">
				<Button on:click={() => onAccept(true)}>接受</Button>
				<Button variant="outline" on:click={() => onAccept(false)}>拒绝</Button>
			</div>
		{:else if !data.inviteDetail.expire || data.inviteDetail.result === 1}
			<p class="mb-4">邀请链接已失效，可能已过期，或已接受（拒绝）邀请</p>
			<Button on:click={() => goto(`/`)}>返回</Button>
		{/if}
	{/if}
</div>
