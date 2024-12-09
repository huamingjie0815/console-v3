<script lang="ts">
	import Input from '@repo/ui/components/ui/input/input.svelte';
	import { checkPhone } from '$lib/utils/common';
	import msg from '$lib/utils/message';
	import pageReq from '$lib/utils/page-request';

	export let phone: string;
	let applying: boolean = false;
	let counter = 60;
	let timer: any = null;

	async function applyCode() {
		if (!checkPhone(phone)) {
			msg.error('请输入正确的手机号码');
			return;
		}
		try {
			await pageReq.post(`/code`, {
				phone
			});
			applying = true;
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
			applying = false;
			counter = 0;
			clearTimeout(timer);
		}
	}
</script>

<div class="relative">
	<Input
		type="text"
		name="code"
		required
		placeholder="6位验证码"
		class="bg-transparent"
		maxlength={6}
		{...$$restProps}
	/>
	<button
		type="button"
		disabled={applying}
		on:click={applyCode}
		class=" absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium"
	>
		{#if applying}
			<span>{counter}s后重新获取</span>
		{:else}
			<span>获取验证码</span>
		{/if}
	</button>
</div>
