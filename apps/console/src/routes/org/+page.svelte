<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Select,
		SelectTrigger,
		SelectValue,
		SelectContent,
		SelectItem
	} from '@repo/ui/components/ui/select';
	export let data;

	$: orgs = data.orgs || [];

	const onSelectedChange = (v: any) => {
		if (v) {
			goto(`/org/${v.value}`);
		}
	};
</script>

<div class=" relative h-full w-full bg-accent">
	<div class=" absolute left-1/2 top-1/3 -translate-x-1/2">
		<div class=" p-6 text-center text-[24px] font-bold text-foreground">您好 {data.user?.name}</div>
		{#if orgs.length}
			<div>
				<Select {onSelectedChange}>
					<SelectTrigger class=" m-auto w-[400px] bg-white">
						<SelectValue placeholder="请选择一个组织" />
					</SelectTrigger>
					<SelectContent>
						{#each orgs as org}
							<SelectItem value={org.id} label={org.name}>{org.name}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>
		{:else}
			<p class="text-secondary-foreground">抱歉，您当前不属于任何组织</p>
		{/if}
	</div>
</div>
