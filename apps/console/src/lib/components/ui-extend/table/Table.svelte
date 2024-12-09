<script lang="ts" context="module">
	import { type IAnyObject, type IPagination } from '$lib/types/base';

	export type TableColumn<RecordType> = {
		title: string;
		class?: string;
		render?: (row: RecordType, rowIndex?: number, colIndex?: number) => string | number; // 自定义， 可以是html，但必须是字符串类型
		value?: (row: RecordType, rowIndex?: number, colIndex?: number) => string | number | undefined;
		renderComponent?: {
			component?: any;
			props?: any;
		}; // svelte component
	};

	export type TableColumns<RecordType> = TableColumn<RecordType>[];
	export type TablePagination = IPagination & {
		onPageChange: (currentPage: number) => void;
	};
</script>

<script lang="ts" generics="RecordType extends IAnyObject">
	import * as Table from '@repo/ui/components/ui/table';
	import * as Pagination from '@repo/ui/components/ui/pagination';
	import Icon from '@iconify/svelte';
	import Empty from '../empty/Empty.svelte';

	export let dataSource: RecordType[] = [];
	export let columns: TableColumns<RecordType> = [];
	export let pagination: TablePagination | undefined = undefined;
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each columns as column}
					<Table.Head class={column.class}>
						<span>{column.title}</span>
					</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if dataSource && dataSource.length}
				{#each dataSource as row, rowIndex}
					<Table.Row>
						{#each columns as column, colIndex}
							<Table.Cell class={column.class}>
								{#if column.renderComponent}
									<svelte:component
										this={column.renderComponent.component}
										{...column.renderComponent.props || {}}
										{row}
									/>
								{:else if column.render}
									{column.render(row, rowIndex, colIndex)}
								{:else}
									{column.value ? column.value(row, rowIndex, colIndex) : ''}
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length}>
						<Empty />
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
	{#if pagination}
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
							<Pagination.Link
								class="h-6 w-6 text-[12px]"
								{page}
								isActive={currentPage == page.value}
							>
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
	{/if}
</div>
