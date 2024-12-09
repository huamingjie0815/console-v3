<script lang="ts">
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as AlertDialog from '@repo/ui/components/ui/alert-dialog/index.js';
	import type { IMqTTClient } from '$lib/types/base';
	import { page } from '$app/stores';

	export let row: IMqTTClient;
	export let onDeleteClient: (client: IMqTTClient) => void;
	export let onEditClient: (client: IMqTTClient) => void
	export let onResetClient: (client: IMqTTClient) => void

	const onEdit = () => {
		onEditClient && onEditClient(row)
	};
	const onReset = () => {
		onResetClient && onResetClient(row)
	}
	const onDelete = () => {
		onDeleteClient && onDeleteClient(row);
	};
</script>

<Button variant="link" size="sm" class=" link font-normal" on:click={onEdit}>修改描述</Button>
<Button variant="link" size="sm" class=" link font-normal" on:click={onReset}>重置</Button>
<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="link" size="sm" class="font-normal text-destructive"
			>删除</Button
		>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>确认删除此客户端？</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>取消</AlertDialog.Cancel>
			<AlertDialog.Action on:click={onDelete}>确认</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
