<script lang="ts">
	import { page } from '$app/stores';
	import ErrorBoundary from '$lib/components/ui-extend/error-boundary/ErrorBoundary.svelte';
	import Loading from '$lib/components/ui-extend/loading/Loading.svelte';
	import Table, { type TableColumns } from '$lib/components/ui-extend/table/Table.svelte';
	import { buttonVariants } from '@repo/ui/components/ui/button';
	import Button from '@repo/ui/components/ui/button/button.svelte';
	import * as Dialog from '@repo/ui/components/ui/dialog';
	import Input from '@repo/ui/components/ui/input/input.svelte';
	import Label from '@repo/ui/components/ui/label/label.svelte';
	import type { IMqTTClient, IOrgSettings } from '$lib/types/base.js';
	import { formatTime } from '$lib/utils/common.js';
	import msg from '$lib/utils/message';
	import pageReq from '$lib/utils/page-request';
	import OperationCell from './(components)/OperationCell.svelte';

	export let data;
	let showEditNameDialog = false;
    let showEditClientDialog = false;
	let name: string = data.orgInfo.data?.name || '';
	let isEditSetting = false;
	let settings: IOrgSettings | undefined = data.orgInfo.data?.settings;
	let dataMode = data.orgInfo.data?.settings?.data_mode;
	let dataPushDuration = data.orgInfo.data?.settings?.data_push_duration;
	let mqttLimit = data.orgInfo.data?.settings?.connect_mqtt_limit;
	let orgId;
	$: orgId = data.orgInfo.data?.id;
	let clients: IMqTTClient[];
	$: clients = data.mqttClients.data || [];
	let limit: number;
	$: limit = data.orgInfo.data?.settings?.connect_mqtt_limit || 5;
    let editClient: IMqTTClient;
	let clientDescription = ''


	const onEditName = async () => {
		try {
			await pageReq.put(`/org/${$page.params.org}`, {
				name
			});
			showEditNameDialog = false;
			location.reload();
		} catch (error: any) {
			msg.error('更新组织名称失败:' + error.message);
		}
	};

	const saveSettings = async () => {
		try {
			const resp = await pageReq.put<IOrgSettings>(`/org/${$page.params.org}/setting/system`, {
				data_mode: dataMode,
				data_push_duration: Number(dataPushDuration),
				connect_mqtt_limit: Number(mqttLimit)
			} as IOrgSettings);
			console.log(resp)
			settings = resp.data;
			isEditSetting = false;
			msg.success('已修改系统设置');
		} catch (error: any) {
			msg.error('更新系统设置失败:' + error.message);
		}
	};

	const onRefreshMqttTable = async () => {
		try {
			const resp = await pageReq.get<IMqTTClient[]>(
				`/org/${$page.params.org}/setting/system/mqttClient`,
				{}
			);
			console.log(resp);
			clients = resp.data;
		} catch (error: any) {
			msg.error('新增MQTT客户端失败:' + error.message);
		}
	};

	const onCreateMqttClient = async () => {
		try {
			const resp = await pageReq.post(`/org/${$page.params.org}/setting/system/mqttClient`, {});
			onRefreshMqttTable();
		} catch (error: any) {
			msg.error('新增MQTT客户端失败:' + error.message);
		}
	};

	const onEditClient = (client: IMqTTClient) => {
        showEditClientDialog = true
        editClient = client
    };

    const onEditConfirm = async () => {
        if (!editClient?.client_id || !clientDescription) {
            return;
        }
		try {
			const resp = await pageReq.put(
				`/org/${$page.params.org}/setting/system/mqttClient/${editClient.client_id}/description`,
				{
                    description: clientDescription
                }
			);
            showEditClientDialog = false
			onRefreshMqttTable();
		} catch (error: any) {
			msg.error('修改MQTT客户端描述失败:' + error.message);
		}
    }

	const onResetClient = async (client: IMqTTClient) => {
		try {
			const resp = await pageReq.put(
				`/org/${$page.params.org}/setting/system/mqttClient/${client.client_id}/reset`,
				{}
			);
			onRefreshMqttTable();
		} catch (error: any) {
			msg.error('重置MQTT客户端失败:' + error.message);
		}
	};

	const onDeleteClient = async (client: IMqTTClient) => {
		try {
			const resp = await pageReq.del(
				`/org/${$page.params.org}/setting/system/mqttClient/${client.client_id}`,
				{}
			);
			onRefreshMqttTable();
		} catch (error: any) {
			msg.error('删除MQTT客户端失败:' + error.message);
		}
	};


	const columns: TableColumns<IMqTTClient> = [
		{
			title: 'ClientID',
			class: 'w-[100px]',
			value: (v) => v.client_id
		},
		{
			title: '描述',
			class: 'w-[200px]',
			value: (v) => v.description
		},
		{
			title: '用户名',
			class: 'w-[200px]',
			value: (v) => v.username
		},
		{
			title: '密码',
			class: 'w-[200px]',
			value: (v) => v.password
		},
		{
			title: '更新时间',
			class: 'w-[200px]',
			value: (v) => formatTime(v.updated_at)
		},
		{
			title: '操作',
			class: 'w-[250px] text-center',
			renderComponent: {
				component: OperationCell,
				props: {
					onEditClient,
					onResetClient,
					onDeleteClient
				}
			}
		}
	];
</script>

<div class="p-4">
	{#await data.orgInfo}
		<Loading />
	{:then resp}
		<ErrorBoundary {resp} let:data>
			<div class="card">
				<div class="card-title">基本信息</div>
				<div class="card-body">
					<div class="grid grid-cols-3 gap-2">
						<div>
							<Label>名称: {data?.name}</Label>
							<Button
								variant="link"
								class=" h-auto px-5 py-0 font-normal"
								on:click={() => (showEditNameDialog = true)}>编辑</Button
							>
							<Dialog.Root bind:open={showEditNameDialog}>
								<Dialog.Content class="sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title>编辑组织名称</Dialog.Title>
									</Dialog.Header>
									<div class="grid gap-4">
										<Input
											bind:value={name}
											type="text"
											name="name"
											required
											placeholder="请输入名称"
											class="bg-transparent"
										/>
									</div>
									<Dialog.Footer>
										<Button on:click={onEditName}>确定</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						</div>
						<div><Label>ID: {data?.id}</Label></div>
						<div><Label>当前状态: {data?.status}</Label></div>
						<div><Label>激活时间: {formatTime(data?.activated_at)}</Label></div>
						<div><Label>到期时间: {formatTime(data?.expired_at)}</Label></div>
					</div>
				</div>
			</div>
			<div class="card mt-2">
				<div class="card-title">
					<span class="flex-1">系统设置</span>
					{#if isEditSetting}
						<section>
							<Button size="sm" on:click={saveSettings}>保存</Button>
							<Button size="sm" variant="outline" on:click={() => (isEditSetting = false)}
								>取消</Button
							>
						</section>
					{:else}
						<Button size="sm" on:click={() => (isEditSetting = true)}>修改</Button>
					{/if}
				</div>
				<div class="card-body">
					<div class="grid grid-cols-3 gap-2">
						<div class="flex items-center gap-2">
							<Label>数据模式:</Label>
							<span>
								<span class="text-sm">{settings?.data_mode}</span>
							</span>
						</div>
						<div class="flex items-center gap-2">
							<Label>数据上报间隔:</Label>
							<span>
								{#if isEditSetting}
									<Input bind:value={dataPushDuration} class=" w-52" />
								{:else}
									<span class="text-sm">{settings?.data_push_duration}</span>
								{/if}
							</span>
						</div>
						<div class="flex items-center gap-2">
							<Label>MQTT限制数:</Label>
							{#if isEditSetting}
								<Input bind:value={mqttLimit} class=" w-52" />
							{:else}
								<span class="text-sm">{settings?.connect_mqtt_limit}</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	{/await}

	<div class="card mt-2">
		<div class="card-title">
			<span class="flex-1">MQTT客户端</span>
		</div>
		<div class="card-body">
			<div class="grid grid-cols-3 gap-2">
				<div>
					<Label>Host:</Label>
					<span class="text-sm">mqtts://post-cn-bl03topbv01.mqtt.aliyuncs.com</span>
				</div>
				<div>
					<Label>Port:</Label>
					<span class="text-sm">8883</span>
				</div>
				<div>
					<Label>Topic:</Label>
					<span class="text-sm">{`org/${orgId}`}</span>
				</div>
				<div>
					<Label>Qos:</Label>
					<span class="text-sm">1</span>
				</div>
				<div>
					<Label>cleanSession:</Label>
					<span class="text-sm">true</span>
				</div>
			</div>
		</div>
		<div class="card-body">
			<Button size="sm" on:click={onCreateMqttClient} class="mb-2" disabled={clients.length > limit}
				>新增</Button
			>
			{#await data.mqttClients}
				<Loading />
			{:then resp}
				<ErrorBoundary {resp}>
					<Table {columns} dataSource={clients} />
				</ErrorBoundary>
			{/await}
			<Dialog.Root bind:open={showEditClientDialog}>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>修改客户端描述</Dialog.Title>
					</Dialog.Header>
					<div class="grid gap-4">
						<Input
							bind:value={clientDescription}
							type="text"
							name="description"
							placeholder="请输入描述信息"
							class="bg-transparent"
						/>
					</div>
					<Dialog.Footer>
						<Button on:click={onEditConfirm}>确定</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
</div>
