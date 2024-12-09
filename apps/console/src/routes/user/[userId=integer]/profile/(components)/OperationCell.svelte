<script lang="ts">
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as AlertDialog from '@repo/ui/components/ui/alert-dialog/index.js';
	import { goto } from '$app/navigation';
	import type { IInviteUser } from '$lib/types/base';
	import { page } from '$app/stores';
	import pageReq from '$lib/utils/page-request';
	import msg from '$lib/utils/message';

	export let row: IInviteUser;

	const onAccept = async (accept: boolean) => {
		try {
			const resp = await pageReq.post<{
				result: boolean;
			}>(`/user/${$page.params.userId}/profile/invite`, {
				orgId: row.orgId,
				inviteId: row.id,
				accept
			});
			msg.info(accept ? '已加入' : '已拒绝')
			location.reload()
		} catch (err: any) {
			msg.error('系统异常:' + err.message);
		}
	};
</script>

{#if row.result === 1}
	<Button size="sm" disabled>已接受</Button>
{:else if row.expire}
	<Button variant="ghost" disabled size="sm">已过期</Button>
{:else}
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<Button builders={[builder]} size="sm">处理</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>是否接受邀请？</AlertDialog.Title>
				<AlertDialog.Description>
					<div>组织ID: {row.orgId}</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => onAccept(false)}>拒绝</AlertDialog.Cancel>
				<AlertDialog.Action on:click={() => onAccept(true)}>接受</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
