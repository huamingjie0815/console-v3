<script lang="ts" generics="T extends any">
	import { ErrorCode } from '$lib/types/base';
	import type { IResp } from '$lib/utils/request';
	export let resp: IResp<T>;
</script>

<div>
	{#if resp.code === ErrorCode.NoAuthorized}
		<div class=" text-center text-sm text-slate-400">无权限</div>
	{:else if resp.code === ErrorCode.InternalError}
		<div class=" text-center text-sm text-slate-400">{resp.message}</div>
	{:else}
		<slot data={resp.data}></slot>
	{/if}
</div>
