<script lang="ts">
	import { page } from '$app/stores';
	import ErrorBoundary from '$lib/components/ui-extend/error-boundary/ErrorBoundary.svelte';
	import Loading from '$lib/components/ui-extend/loading/Loading.svelte';
	import * as Breadcrumb from "@repo/ui/components/ui/breadcrumb/index.js";
	import RoleDetail from '../(components)/RoleDetail.svelte';
	import RolePermission from '../(components)/RolePermission.svelte';
	import RoleUser from '../(components)/RoleUser.svelte';

	export let data;
</script>

{#await data.roleDetailResp}
	<Loading />
{:then resp}
	<Breadcrumb.Root class="mb-4">
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href={`/org/${$page.params.org}/roles`}>角色列表</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>角色详情</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<ErrorBoundary {resp} let:data>
		<RoleDetail detail={data} />
		<RolePermission permissions={data?.permissions} title="权限信息" />
		<RoleUser users={data?.users} />
	</ErrorBoundary>
{/await}
