<script lang="ts" context="module">
	export interface ITransferData<T> {
		key: string;
		name: string;
		description: string;
		checked?: boolean;
		origin?: T;
		disabled?: boolean;
	}
</script>

<script lang="ts" generics="T extends any">
	import LoadingButton from '../loading/LoadingButton.svelte';

	import { twMerge } from 'tailwind-merge';
	import { createEventDispatcher } from 'svelte';
	import Empty from '../empty/Empty.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import Label from '@repo/ui/components/ui/label/label.svelte';

	type $$TransferData = ITransferData<T>;
	const boxCls = twMerge('border border-gray-200 rounded mt-1');
	const boxWarpCls = twMerge('w-3/4 flex-grow');
	const ulCls = twMerge('max-h-[400px] min-h-[240px] overflow-y-auto mt-1 px-3');
	const dispatch = createEventDispatcher<{
		change: {
			checked: $$TransferData[];
		};
		loadMore: {};
	}>();

	export let allData: {
		title: string;
		data: $$TransferData[];
	} = {
		title: '所有数据',
		data: []
	};
	export let checkedData: {
		title: string;
		data: $$TransferData[];
	} = {
		title: '已选数据',
		data: []
	};
	export let showLoadMore: boolean = false;
	export let loading: boolean = false;
	let full: $$TransferData[];
	let checked: $$TransferData[];

	$: {
		checked = checkedData.data.map((item) => item);
		full = allData.data.map((item) => {
			return {
				...item,
				checked: checked.some((c) => c.key === item.key)
			};
		});
	}

	function inputCheckedChange(item: $$TransferData, target: EventTarget | null) {
		const { checked } = target as HTMLInputElement;
		if (checked) {
			addChecked(item);
		} else {
			cancelChecked(item);
		}
	}
	function addChecked(item: $$TransferData) {
		checked.push(item);
		onChange(checked);
	}
	function cancelChecked(item: $$TransferData) {
		onChange(checked.filter((data) => data.key !== item.key));
	}

	function selectAll() {
		onChange(
			full.map((item) => ({
				...item,
				checked: true
			}))
		);
	}

	function clearAll() {
		onChange(checked.filter((data) => data.disabled));
	}

	function onChange(checked: $$TransferData[]) {
		dispatch('change', {
			checked
		});
	}

	function onLoadMore() {
		dispatch('loadMore', {});
	}

	console.log(showLoadMore);
</script>

<div class="flex items-center justify-between">
	<div class={boxWarpCls}>
		<div class={boxCls}>
			<div class=" mb-1 flex items-center border-b border-solid p-2 text-sm">
				<span class="flex-1">{allData.title}</span>
				<Button variant="link" size="sm" class="h-5" on:click={selectAll}>全选</Button>
			</div>
			<ul class={ulCls}>
				{#if full.length === 0}
					<Empty />
				{:else}
					{#each full as item (item.key)}
						<li class="flex h-9 items-center">
							<input
								type="checkbox"
								checked={item.checked}
								disabled={item.disabled}
								class=" mr-2 cursor-pointer"
								on:change={(e) => inputCheckedChange(item, e.target)}
							/>
							<Label class="mr-2">{item.name}</Label>
							<span class="text-sm text-muted-foreground"
								>{item.description ? `${item.description}` : ''}</span
							>
						</li>
					{/each}
					{#if showLoadMore}
						<li class="py-2 text-center opacity-40">
							<LoadingButton
								on:click={onLoadMore}
								variant="ghost"
								class="w-full text-[13px] font-normal"
								{loading}>加载更多</LoadingButton
							>
						</li>
					{/if}
				{/if}
			</ul>
		</div>
	</div>
	<div class="mx-3 mt-3 text-center">
		<Button size="sm" variant="outline"><Icon icon="lucide:chevron-right" /></Button>
	</div>
	<div class={boxWarpCls}>
		<div class={boxCls}>
			<div class=" mb-1 flex items-center border-b border-solid p-2 text-sm">
				<span class="flex-1">{checkedData.title}</span>
				<Button variant="link" size="sm" class="h-5" on:click={clearAll}>清空</Button>
			</div>
			<ul class={ulCls}>
				{#if checked.length === 0}
					<Empty />
				{:else}
					{#each checked as item (item.key)}
						<div class="flex items-center">
							<div class="flex-1">
								<Label class="mr-2">{item.name}</Label>
								<span class="text-sm text-muted-foreground"
									>{item.description ? `${item.description}` : ''}</span
								>
							</div>
							<Button
								size="icon"
								variant="link"
								class="text-muted-foreground hover:text-destructive"
								disabled={item.disabled}
								on:click={() => cancelChecked(item)}
							>
								<Icon icon="lucide:trash" />
							</Button>
						</div>
					{/each}
				{/if}
			</ul>
		</div>
	</div>
</div>
