<script lang="ts">
	import Label from '@repo/ui/components/ui/label/label.svelte';
	import type { IUser } from '$lib/types/base';

	export let detail: IUser | undefined;
</script>

<div class="card">
	<div class="card-title">基本信息</div>
	<div class="card-body">
		<div class="grid grid-cols-2 gap-2">
			<div><Label>名称: {detail?.name}</Label></div>
			<div><Label>ID: {detail?.id}</Label></div>
			<div><Label>手机号码: {detail?.phone}</Label></div>
			<!-- <div><Label>邮箱: {detail?.email}</Label></div> -->
		</div>
	</div>
</div>
