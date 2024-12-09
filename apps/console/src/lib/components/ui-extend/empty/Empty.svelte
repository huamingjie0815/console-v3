<script lang="ts">
	import NoData from '../icons/Empty.svelte';
	export let content: string = '暂无数据';
</script>

<div class="flex flex-col items-center justify-center w-full">
	<NoData class=" text-[90px]"/>
	<p class=" text-muted-foreground">{content}</p>
</div>
