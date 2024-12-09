<script lang="ts">
	import type { SideNavItemProps } from './SideNavItem.svelte';
	import Icon from '@iconify/svelte';
	import { twMerge } from 'tailwind-merge';
	import { slide } from 'svelte/transition';
	import SideNavItem from './SideNavItem.svelte';

	export let url: SideNavItemProps['url'] = '';
	export let label: SideNavItemProps['label'] = '';
	export let icon: SideNavItemProps['icon'] = '';
	export let items: SideNavItemProps[] = [];
	export let active: string = '';

	$: href = !url ? 'javascript:void(0)' : url;
	let open: boolean = false;
	const onClick = (e: any) => {
		open = !open;
	};
	let activated = false;
	$: {
		activated = (url && active?.indexOf(url) > -1) || !!items?.find((item) => active?.indexOf(item.url) > -1);
		open = activated;
	}
</script>

<li class="box-border h-8 list-none leading-8">
	<a on:click={onClick} {href} class="text-inherit no-underline">
		<div
			class="ease-[cube-bezier(0.215, 0.61, 0.355, 1)] m-1 flex flex-row items-center gap-2 rounded pl-2 text-muted-foreground transition-colors hover:cursor-pointer hover:bg-accent hover:text-foreground"
		>
			{#if icon}
				<span class="size-4 h-4 leading-4"><Icon {icon} /></span>
			{/if}
			<span class="flex-auto overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
			<span
				class={twMerge(
					'size-4 h-4 leading-4',
					open ? 'rotate-90 transition-transform' : 'transition-transform'
				)}
			>
				<Icon icon="lucide:chevron-right" />
			</span>
		</div>
	</a>
</li>
{#if open}
	<li class="pb-1 pl-2 pt-1" transition:slide>
		{#each items as item}
			<SideNavItem {...item} {active} />
		{/each}
	</li>
{/if}
