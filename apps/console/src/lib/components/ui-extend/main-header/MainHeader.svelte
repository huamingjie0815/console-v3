<script lang="ts" context="module">
	export interface SettingMenu {
		label: string;
		icon?: string;
		fn: (e: CustomEvent<MouseEvent>) => void;
	}
</script>

<script lang="ts">
	import * as Avatar from '@repo/ui/components/ui/avatar';
	import * as DropdownMenu from '@repo/ui/components/ui/dropdown-menu';
	import type { IOrg, IUser } from '$lib/types/base';
	import { goto } from '$app/navigation';
	import msg from '$lib/utils/message';
	import Separator from '@repo/ui/components/ui/separator/separator.svelte';
	import pageReq from '$lib/utils/page-request';

	export let projectName: string = '';
	export let user: IUser | undefined;
	// export let settings: SettingMenu[] = [];
	export let orgs: IOrg[] = [];
	export let orgId: string | undefined;

	const homeUrl: string = '/';
	let selected: any = undefined;
	$: initialName = user?.name?.slice(0, 1) || '';
	$: if (orgId) {
		const selectedOrg = orgs.find((o) => o.id === orgId);
		selected = selectedOrg
			? {
					label: selectedOrg.name,
					value: selectedOrg.id
				}
			: undefined;
	}

	const onLogout = async () => {
		try {
			await pageReq.get('/logout');
			goto('/login');
		} catch (error) {
			msg.error('发生异常，退出失败');
		}
	}

	const onProfile = () => {
		goto(`/user/${user?.id}/profile`)
	}

	const onChangeOrg = () => {
		goto(`/org`)
	}
</script>

<div class=" relative flex min-h-11 items-center justify-between border-b shadow-sm">
	<a href={homeUrl} class="flex w-40 flex-row gap-2 pl-[10px] p-1" data-sveltekit-preload-data="off">
		<img class="h-6 w-6" src="/logo.png" alt="logo" />
		<span class="text-base font-semibold">{projectName}</span>
	</a>

	<div class="flex flex-1 px-2">
		<!-- {#if orgId}
			<Select {onSelectedChange} {selected}>
				<SelectTrigger class=" h-[26px] w-[120px] text-[12px]">
					<SelectValue placeholder="切换组织" />
				</SelectTrigger>
				<SelectContent>
					{#each orgs as org}
						<SelectItem class="h-[24px] text-[12px]" value={org.id} label={org.name}
							>{org.name}</SelectItem
						>
					{/each}
				</SelectContent>
			</Select>
		{/if} -->
	</div>
	<Separator orientation="vertical" />
	<div class="flex justify-end px-4 p-1">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root class="h-6 w-6" title={user?.name}>
					<!-- <Avatar.Image src="https://github.com/shadcn.png" alt={initialName} /> -->
					<Avatar.Fallback class=" bg-primary bg-opacity-20">{initialName}</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-[200px]">
				<DropdownMenu.Label class="font-normal">
					<div class="flex flex-col space-y-1">
						<p class="text-sm font-medium leading-none">{user?.name}</p>
						<p class="text-xs leading-none text-muted-foreground">{user?.phone}</p>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item on:click={onProfile}>我的账户</DropdownMenu.Item>
					<DropdownMenu.Item on:click={onChangeOrg}>切换组织</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={onLogout}>退出登录</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
