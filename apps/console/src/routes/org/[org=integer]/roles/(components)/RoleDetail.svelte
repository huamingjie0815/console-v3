<script lang="ts">
	import Label from '@repo/ui/components/ui/label/label.svelte';
	import type { IRoleDetail } from '$lib/types/base';
	import { formatTime } from '$lib/utils/common';

	export let detail: IRoleDetail | undefined;
</script>

<div class="card">
	<div class="card-title">基本信息</div>
	<div class="card-body">
		<div class="grid grid-cols-2 gap-2">
			<div><Label>名称: {detail?.name}</Label></div>
			<div><Label>Key: {detail?.key}</Label></div>
			<div><Label>类型: {detail?.type}</Label></div>
			<div><Label>描述: {detail?.description}</Label></div>
			<div><Label>创建时间: {formatTime(detail?.created_at)}</Label></div>
		</div>
	</div>
</div>
