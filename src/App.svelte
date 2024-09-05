<script lang="ts">
    import {
        Header,
        SkipToContent,
    } from 'carbon-components-svelte';
    import {
        JSONEditor,
        Mode,
        type Content,
        type OnChangeStatus,
        type TextContent,
        type JSONContent
    } from 'svelte-jsoneditor';
    import {Pane, Splitpanes} from 'svelte-splitpanes';
    import Chart, {type ChartConfiguration} from 'chart.js/auto';
    import {onMount} from 'svelte';

    const defaultChartConfiguration: any = {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
        },

    };

    let isSideNavOpen = false;
    let content: Content = {
        json: defaultChartConfiguration,
    };
    let chartElement: HTMLDivElement | undefined = undefined;
    let chartCanvasElement: HTMLCanvasElement | undefined = undefined;
    let chart: Chart | undefined = undefined;

    onMount(() => {
        if (chartElement) {
            onChange(content, content, {contentErrors: null, patchResult: null});
        }
    });

    function onChange(updatedContent: Content, previousContent: Content, status: OnChangeStatus): void {
        content = updatedContent;
        if (status.contentErrors === null) {
            const chartConfig = getJSON() as ChartConfiguration;
            createChart(chartConfig);
        } else {
            destroyChart();
        }
    }

    function getJSON(): any {
        const jsonContent = content as JSONContent;
        if (jsonContent.json !== undefined) {
            return jsonContent.json
        }
        const textContent = content as TextContent;
        return JSON.parse(textContent.text);
    }

    function createChart(config: ChartConfiguration): void {
        if (chartElement === undefined) {
            return;
        }
        destroyChart();
        chartCanvasElement = document.createElement('canvas');
        chartElement.appendChild(chartCanvasElement);
        try {
            chart = new Chart(chartCanvasElement, config);
        } catch (e) {
            console.error(e);
            destroyChart();
        }

    }

    function destroyChart(): void {
        if (chart !== undefined) {
            chart.destroy();
            chart = undefined;
        }
        if (chartCanvasElement !== undefined) {
            chartCanvasElement.remove();
            chartCanvasElement = undefined;
        }
    }
</script>

<Header platformName="Chart.js Viewer" bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent/>
    </svelte:fragment>
</Header>

<div class="content">
    <Splitpanes>
        <Pane>
            <JSONEditor bind:content mode={Mode.text} onChange={onChange}/>
        </Pane>
        <Pane>
            <div bind:this={chartElement} class="chart"></div>
        </Pane>
    </Splitpanes>
</div>

<style>
    .content {
        margin-top: 3rem;
        height: calc(100% - 3rem);
        overflow: hidden;
    }

    .chart {
        width: 100%;
        height: 100%;
    }
</style>