<script lang="ts">
	import ErrorBoundary from '$lib/components/ui-extend/error-boundary/ErrorBoundary.svelte';
	import Loading from '$lib/components/ui-extend/loading/Loading.svelte';
	import Table, { type TableColumns } from '$lib/components/ui-extend/table/Table.svelte';
	import Label from '@repo/ui/components/ui/label/label.svelte';
	import * as Breadcrumb from '@repo/ui/components/ui/breadcrumb/index.js';

	import type { IInviteUser } from '$lib/types/base.js';
	import { checkCode, formatTime } from '$lib/utils/common';
	import OperationCell from './(components)/OperationCell.svelte';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as AlertDialog from '@repo/ui/components/ui/alert-dialog/index.js';
	import * as Dialog from '@repo/ui/components/ui/dialog/index.js';
	import pageReq from '$lib/utils/page-request';
	import { page } from '$app/stores';
	import msg from '$lib/utils/message';
	import Input from '@repo/ui/components/ui/input/input.svelte';
	import { checkPhone } from '$lib/utils/common';

	export let data;
	let phone: string = '';
	let code: string = '';
	let getCoding: boolean = false;
	let counter = 60;
	let timer: any = null;
	let showDialog = false;

	const columns: TableColumns<IInviteUser> = [
		{
			title: 'ID',
			class: 'w-[100px]',
			value: (v) => v.id
		},
		{
			title: '组织ID',
			class: 'w-[100px]',
			value: (v) => v.orgId
		},
		{
			title: '邀请时间',
			class: 'w-[200px]',
			value: (v) => formatTime(v.createdAt)
		},
		{
			title: '是否失效',
			class: 'w-[100px]',
			value: (v) => (v.expire ? '是' : '否')
		},
		{
			title: '是否接受',
			class: 'w-[100px]',
			renderComponent: {
				component: OperationCell
			}
		}
	];

	async function getCode() {
		if (!checkPhone(phone)) {
			msg.error('请输入正确的手机号码');
			return;
		}
		try {
			await pageReq.post(`/code`, {
				phone
			});
			getCoding = true;
			countdown();
		} catch (error) {
			msg.error('获取验证码失败，请点击重新获取');
		}
	}
	async function countdown() {
		if (counter > 0) {
			counter--;
			timer = setTimeout(() => {
				console.log(counter);
				countdown();
			}, 1000);
		} else {
			getCoding = false;
			counter = 0;
			clearTimeout(timer);
		}
	}

	const onUnBind = async (phone: string) => {
		try {
			await pageReq.post(`/user/${$page.params.userId}/unbind`, {
				phone
			});
			location.reload();
		} catch (error) {
			msg.error('解除绑定手机号失败');
		}
	};

	const onBind = async () => {
		if (!checkCode(code)) {
			msg.error('验证码错误');
			return;
		}
		try {
			await pageReq.post(`/user/${$page.params.userId}/bind`, {
				code,
				phone
			});
			showDialog = false;
			location.reload()
		} catch (error) {
			msg.error('绑定手机号失败');
		}
	};
</script>

<div class="p-4">
	<Breadcrumb.Root class="mb-4">
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href={`/org`}>选择组织</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>我的账户</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
	{#await data.userDetailResp}
		<Loading />
	{:then resp}
		<ErrorBoundary {resp} let:data>
			<div class="card">
				<div class="card-title">基本信息</div>
				<div class="card-body">
					<div class="grid grid-cols-2 gap-2">
						<div><Label>名称: {data?.name}</Label></div>
						<div><Label>ID: {data?.id}</Label></div>
						<div>
							<Label>手机号码: {data?.phone}</Label>
							{#if data?.phone}
								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="link" class=" font-normal"
											>解除绑定</Button
										>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>请确认是否解除绑定当前手机号？</AlertDialog.Title>
											<AlertDialog.Description>
												<div>手机号: {data?.phone || '--'}</div>
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>取消</AlertDialog.Cancel>
											<AlertDialog.Action on:click={(e) => onUnBind(data?.phone)}
												>确认</AlertDialog.Action
											>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							{:else}
								<Button variant="link" class=" font-normal" on:click={() => (showDialog = true)}
									>绑定手机</Button
								>
								<Dialog.Root bind:open={showDialog}>
									<Dialog.Content class="sm:max-w-[425px]">
										<Dialog.Header>
											<Dialog.Title>绑定手机</Dialog.Title>
											<Dialog.Description>绑定手机号后可以通过短信验证码登录</Dialog.Description>
										</Dialog.Header>
										<div class="grid gap-4">
											<div>
												<Input
													bind:value={phone}
													type="text"
													name="phone"
													required
													placeholder="请输入手机号码"
													class="bg-transparent"
													autocomplete="tel"
												/>
											</div>
											<div>
												<div class="relative">
													<Input
														type="text"
														name="code"
														required
														placeholder="6位验证码"
														class="bg-transparent"
														maxlength={6}
														bind:value={code}
													/>
													<button
														type="button"
														disabled={getCoding}
														on:click={getCode}
														class=" absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium"
													>
														{#if getCoding}
															<span>{counter}s后重新获取</span>
														{:else}
															<span>获取验证码</span>
														{/if}
													</button>
												</div>
											</div>
										</div>
										<Dialog.Footer>
											<Button on:click={onBind}>绑定</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
						</div>
						<!-- <div><Label>邮箱: {data?.email}</Label></div> -->
					</div>
				</div>
			</div>

			<div class="card mt-4">
				<div class="card-title">受邀信息</div>
				<div class="card-body">
					<Table {columns} dataSource={data?.invites} />
				</div>
			</div>
		</ErrorBoundary>
	{/await}
</div>
