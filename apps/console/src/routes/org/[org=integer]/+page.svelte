<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	$: {
		if (data.menus && data.menus.length) {
			goto(data.menus?.[0]?.url);
		}
	}
</script>

{#if !data.menus || data.menus.length <= 0}
	<p>请联系管理员添加权限</p>
{/if}
