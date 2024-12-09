<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import * as Card from '@repo/ui/components/ui/card/index.js';
	import { Input } from '@repo/ui/components/ui/input/index.js';
	import { Label } from '@repo/ui/components/ui/label/index.js';
	import msg from '$lib/utils/message';
	import Icon from '@iconify/svelte';
	import type { ActionData } from './$types';
	import { Button } from '$lib/components/ui-extend/loading';
	import Checkbox from '@repo/ui/components/ui/checkbox/checkbox.svelte';
	import * as Tabs from '@repo/ui/components/ui/tabs';
	import { checkPhone, checkPwd } from '$lib/utils/common';
	import CaptchaInput from '$lib/components/ui-extend/captcha-input/CaptchaInput.svelte';

	export let form: ActionData;

	let phone: string = '';
	let password: string = '';
	let code: string = '';
	let showPwd: boolean = false;
	let loading: boolean = false;
	let phoneError: boolean = false;
	let passwordError: boolean = false

	const showPassword = () => {
		showPwd = !showPwd;
	};

	const onBlurPhone = () => {
		phoneError = !!phone && !checkPhone(phone);
	};

	const onBlurPass = () => {
		passwordError = !!password && !checkPwd(password)
	}
</script>

<div class="relative h-full w-full bg-[url('/bg-image.png')] bg-cover">
	<Card.Root class=" absolute left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2">
		<Card.Header>
			<Card.Title class="text-2xl">登录</Card.Title>
			<!-- <Card.Description>请输入手机号码登录您的账号</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<Tabs.Root value="password" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="password">密码登录</Tabs.Trigger>
					<Tabs.Trigger value="code">免密登录</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content class="mt-4" value="password">
					<form
						method="POST"
						novalidate
						action="?/password"
						use:enhance={() => {
							loading = true;
							return async ({ result }) => {
								loading = false;
								if (result.type === 'redirect') {
									msg.success('登录成功');
									goto(result.location);
								} else {
									await applyAction(result);
								}
							};
						}}
					>
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
									on:blur={onBlurPhone}
								/>
								{#if phoneError}
									<span class="mt-2 text-xs text-red-400">请输入正确的手机号码</span>
								{/if}
							</div>
							<div>
								<div class="relative">
									{#if showPwd}
										<Input
											type="text"
											name="password"
											bind:value={password}
											required
											placeholder="请输入密码"
											class="bg-transparent"
											autocomplete="new-password"
											on:blur={onBlurPass}
										/>
									{:else}
										<Input
											type="password"
											name="password"
											bind:value={password}
											required
											placeholder="请输入密码"
											class="bg-transparent"
											autocomplete="new-password"
											on:blur={onBlurPass}
										/>
									{/if}
									<button type="button" on:click={showPassword} class=" absolute right-3 top-2.5">
										{#if showPwd}
											<Icon icon="lucide:eye" />
										{:else}
											<Icon icon="lucide:eye-off" />
										{/if}
									</button>
								</div>
								{#if passwordError}
									<span class="mt-1 text-xs text-red-400"
										>密码至少6位，需要包含大小写英文字母和数字</span
									>
								{/if}
							</div>
						</div>
						<div class="mt-12 grid gap-4">
							<Button type="submit" class="w-full" {loading}>登录</Button>
							<div>
								<div class="flex items-center space-x-2">
									<Checkbox id="terms" aria-labelledby="terms-label" />
									<Label
										id="terms-label"
										for="terms"
										class="text-[12px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										我已阅读并同意 服务条款 和 隐私协议
									</Label>
								</div>
							</div>

							{#if form?.verifyError}
								<span class="mt-1 block text-xs text-red-400">验证失败，请重新登录</span>
							{/if}
							{#if form?.loginError}
								<span class="mt-1 block text-xs text-red-400">服务异常，登录失败</span>
							{/if}
						</div>
					</form>
				</Tabs.Content>
				<Tabs.Content class="mt-4" value="code">
					<form
						method="POST"
						novalidate
						action="?/code"
						use:enhance={() => {
							loading = true;
							return async ({ result }) => {
								loading = false;
								if (result.type === 'redirect') {
									msg.success('登录成功');
									goto(result.location);
								} else {
									await applyAction(result);
								}
							};
						}}
					>
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
									on:blur={onBlurPhone}
								/>
								{#if phoneError}
									<span class="mt-2 text-xs text-red-400">请输入正确的手机号码</span>
								{/if}
							</div>
							<div>
								<CaptchaInput {phone} bind:value={code} />
							</div>
						</div>
						<div class="mt-12 grid gap-4">
							<Button type="submit" class="w-full" {loading}>登录</Button>
							<div>
								<div class="flex items-center space-x-2">
									<Checkbox id="terms" aria-labelledby="terms-label" />
									<Label
										id="terms-label"
										for="terms"
										class="text-[12px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										我已阅读并同意 服务条款 和 隐私协议
									</Label>
								</div>
							</div>

							{#if form?.verifyError}
								<span class="mt-1 block text-xs text-red-400">验证失败，请重新登录</span>
							{/if}
							{#if form?.loginError}
								<span class="mt-1 block text-xs text-red-400">服务异常，登录失败</span>
							{/if}
						</div>
					</form>
				</Tabs.Content>
			</Tabs.Root>
		</Card.Content>
	</Card.Root>
</div>
