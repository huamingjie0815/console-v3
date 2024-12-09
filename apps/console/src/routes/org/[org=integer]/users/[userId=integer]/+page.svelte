<script lang="ts">
	import { page } from '$app/stores';
	import ErrorBoundary from '$lib/components/ui-extend/error-boundary/ErrorBoundary.svelte';
	import Loading from '$lib/components/ui-extend/loading/Loading.svelte';
	import * as Breadcrumb from "@repo/ui/components/ui/breadcrumb/index.js";
	import UserDetail from '../(components)/UserDetail.svelte';
	import UserPermission from '../(components)/UserPermission.svelte';
	import UserRole from '../(components)/UserRole.svelte';

	export let data;
</script>

{#await data.userDetailResp}
	<Loading />
{:then resp}
	<Breadcrumb.Root class="mb-4">
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href={`/org/${$page.params.org}/users`}>用户列表</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>用户详情</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<ErrorBoundary {resp} let:data>
		<UserDetail detail={data} />
		<UserRole roles={data?.roles} />
		<UserPermission title="权限白名单" permissions={data?.allowPermissions} type={'allow'} />
		<UserPermission title="权限黑名单" permissions={data?.denyPermissions} type={'deny'} />
	</ErrorBoundary>
{/await}
