<script lang="ts">
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as AlertDialog from '@repo/ui/components/ui/alert-dialog/index.js';
	import type { IInviteUser } from '$lib/types/base';

	export let row: IInviteUser;
	export let onDeleteInvite: (row: IInviteUser) => void;

	const onDelete = () => {
		onDeleteInvite && onDeleteInvite(row);
	};
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="link" size="sm" class="font-normal text-destructive"
			>删除</Button
		>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>删除此邀请</AlertDialog.Title>
			<AlertDialog.Description>
				<div>手机号: {row.phone}</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>取消</AlertDialog.Cancel>
			<AlertDialog.Action on:click={onDelete}>确认</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
