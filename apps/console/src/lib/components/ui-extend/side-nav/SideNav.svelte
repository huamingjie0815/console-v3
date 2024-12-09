<script lang="ts" context="module">
	import type { SideNavItemProps } from './SideNavItem.svelte';

	export type SideNavProps = {
		menus: SideNavItemProps[];
		active: string;
	};
</script>

<script lang="ts">
	import SideNavGroup from './SideNavGroup.svelte';
	import SideNavItem from './SideNavItem.svelte';

	export let menus: SideNavProps['menus'] = [];
	export let active: SideNavProps['active'] = '';
</script>

<div class="relative m-0 box-border h-full border-r  p-1 flex flex-col">
	<ul class="overflow-y-scroll flex-1 text-[14px]">
		{#each menus as menu}
			{#if !menu.children}
				<SideNavItem {...menu} {active} />
			{:else}
				<SideNavGroup
					url={menu.url}
					icon={menu.icon}
					items={menu.children}
					label={menu.label}
					{active}
				/>
			{/if}
		{/each}
	</ul>
</div>
