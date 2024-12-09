<script lang="ts" context="module">
	export type SideNavItemProps = {
		label: string;
		url: string;
		icon?: string;
		children?: SideNavItemProps[];
	};
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { twMerge } from 'tailwind-merge';
	export let url: SideNavItemProps['url'] = '';
	export let label: SideNavItemProps['label'] = '';
	export let icon: SideNavItemProps['icon'] = '';
	export let active: string = '';

	let activated = false;
	$: {
		activated = active?.indexOf(url) > -1;
	}
</script>

<li class="box-border h-8 list-none leading-8">
	<a class="text-inherit no-underline" href={url} data-sveltekit-preload-data="off">
		<div
			class={twMerge(
				'ease-[cube-bezier(0.215, 0.61, 0.355, 1)] m-1 flex flex-row items-center gap-2 rounded pl-2 text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer hover:bg-accent',
				activated ? ' text-foreground cursor-pointer font-bold' : ''
			)}
		>
			{#if icon}
				<span class="size-4 h-4 leading-4"><Icon {icon} /></span>
			{/if}
			<span class="flex-auto overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
		</div>
	</a>
</li>
