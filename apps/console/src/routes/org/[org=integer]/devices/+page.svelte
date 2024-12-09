<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';
	export let data;
    let chart: echarts.ECharts



	onMount(() => {
		chart = echarts.init(document.getElementById('test'));
        // 绘制图表
		chart.setOption({
			title: {
				text: 'ECharts 入门示例'
			},
			tooltip: {},
			xAxis: {
				data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
			},
			yAxis: {},
			series: [
				{
					name: '销量',
					type: 'bar',
					data: [5, 20, 36, 10, 10, 20]
				}
			]
		});
	});
</script>

<div>
	<div id="test" class="w-[300px] h-[200px]"></div>
</div>
