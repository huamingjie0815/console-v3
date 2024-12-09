<script lang="ts">
	import * as Pagination from '@repo/ui/components/ui/pagination';
	import type { IPagination } from '$lib/types/base';
	import Icon from '@iconify/svelte';

	interface PaginationProps {
		pagination: IPagination & {
			onPageChange: (currentPage: number) => void;
		};
	}
	export let pagination: PaginationProps['pagination'];
</script>

<Pagination.Root
	class="mb-2 mt-2"
	count={pagination.total}
	perPage={pagination.pageSize}
	onPageChange={pagination.onPageChange}
	let:pages
	let:currentPage
>
	<Pagination.Content>
		<Pagination.Item class="h-6 w-6 text-[12px]">
			<Pagination.PrevButton class=" h-6 w-6 p-0 text-[12px]">
				<Icon class=" h-4 w-4" icon="lucide:chevron-left" />
			</Pagination.PrevButton>
		</Pagination.Item>
		{#each pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<Pagination.Item class="h-6 w-6 text-[12px]">
					<Pagination.Ellipsis />
				</Pagination.Item>
			{:else}
				<Pagination.Item class="h-6 w-6 text-[12px]">
					<Pagination.Link class="h-6 w-6 text-[12px]" {page} isActive={currentPage == page.value}>
						{page.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item class="h-6 w-6 text-[12px]">
			<Pagination.NextButton class=" h-6 w-6 p-0 text-[12px]">
				<Icon class=" h-4 w-4" icon="lucide:chevron-right" />
			</Pagination.NextButton>
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>
