<script lang="ts">
    import FusionCharts from "fusioncharts";

    import Charts from "fusioncharts/fusioncharts.charts";

    import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
    import { Bus, CircleOff, LoaderPinwheel, LucideNotepadTextDashed, MoveUpRight } from "lucide-svelte";

    import SvelteFC, { fcRoot } from "svelte-fusioncharts";

    fcRoot(FusionCharts, Charts, FusionTheme);

    const barData = [
        { label: "January", value: "11290" },
        { label: "February", value: "11360" },
        { label: "March", value: "12280" },
        { label: "April", value: "12540" },
        { label: "May", value: "14815" },
        { label: "June", value: "14950" },
        { label: "July", value: "15230" },
        { label: "August", value: "16330" },
        { label: "September", value: "16630" },
        { label: "October", value: "17930" },
        { label: "November", value: "18630" },
        { label: "December", value: "18901" },
    ];

    //Create your configuration object
    const chartConfigs = {
        type: "column2d", //Select the chart type
        width: 300, //Set the width of the chart
        height: 300, //Set the height of the chart
        dataFormat: "json", //Set the input dataFormat to json
        dataSource: {
            chart: {
                caption: "Monthly Production", //Set the caption to your chart
                subCaption: "Bus ", //Set a sub-caption to your chart
                xAxisName: "Month", //Assign a relevant name to your x-axis
                yAxisName: "Total Operational Buses",
                theme: "fusion", //Apply a theme to your chart
            },
            //Include chartData from STEP 2
            data: barData,
        },
    };

    const pieData = {
        chart: {
            caption: "Recommended Portfolio Split",
            subcaption: "For a net-worth of $1M",
            showvalues: "1",
            showpercentintooltip: "0",
            numberprefix: "$",
            enablemultislicing: "1",
            theme: "candy",
        },
        data: [
            {
                label: "Equity",
                value: "300000",
            },
            {
                label: "Debt",
                value: "230000",
            },
            {
                label: "Bullion",
                value: "180000",
            },
            {
                label: "Real-estate",
                value: "270000",
            },
            {
                label: "Insurance",
                value: "20000",
            },
        ],
    };

    const pieConfigs = {
        type: "pie2d",
        width: 300,
        height: 300,
        dataFormat: "json",
        dataSource: pieData,
    };

    const lineData = {
        chart: {
            caption: "Reach of Social Media Platforms amoung Adults",
            yaxisname: "% of Adults on this platform",
            subcaption: "2018-2023",
            showhovereffect: "1",
            numbersuffix: "%",
            drawcrossline: "1",
            plottooltext: "<b>$dataValue</b> of Adults were on $seriesName",
            theme: "candy",
        },
        categories: [
            {
                category: [
                    {
                        label: "2018",
                    },
                    {
                        label: "2019",
                    },
                    {
                        label: "2021",
                    },
                    {
                        label: "2023",
                    },
                ],
            },
        ],
        dataset: [
            {
                seriesname: "Facebook",
                data: [
                    {
                        value: "68",
                    },
                    {
                        value: "69",
                    },
                    {
                        value: "69",
                    },
                    {
                        value: "68",
                    },
                ],
            },
            {
                seriesname: "Instagram",
                data: [
                    {
                        value: "35",
                    },
                    {
                        value: "37",
                    },
                    {
                        value: "40",
                    },
                    {
                        value: "47",
                    },
                ],
            },
            {
                seriesname: "LinkedIn",
                data: [
                    {
                        value: "25",
                    },
                    {
                        value: "27",
                    },
                    {
                        value: "28",
                    },
                    {
                        value: "30",
                    },
                ],
            },
            {
                seriesname: "Twitter",
                data: [
                    {
                        value: "24",
                    },
                    {
                        value: "22",
                    },
                    {
                        value: "23",
                    },
                    {
                        value: "22",
                    },
                ],
            },
        ],
    };

    const lineConfigs = {
        type: "msline",
        width: 300,
        height: 300,
        dataFormat: "json",
        dataSource: lineData,
    };

    const stackedData = {
        chart: {
            caption: "Total Sales by Products",
            subcaption: "ACME Inc.",
            numberprefix: "$",
            numbersuffix: "M",
            showvalues: "0",
            showsum: "1",
            legendbgalpha: "0",
            plottooltext:
                "Type: $label{br}<b>Location: $seriesName</b>{br}Sales: $dataValue</div>",
            stack100percent: "1",
            theme: "candy",
        },
        categories: [
            {
                category: [
                    {
                        label: "Hardware",
                    },
                    {
                        label: "Software",
                    },
                    {
                        label: "Services",
                    },
                ],
            },
        ],
        dataset: [
            {
                seriesname: "West",
                data: [
                    {
                        value: "4.5",
                    },
                    {
                        value: "2.8",
                    },
                    {
                        value: "5",
                    },
                ],
            },
            {
                seriesname: "Central",
                data: [
                    {
                        value: "6",
                    },
                    {
                        value: "3",
                    },
                    {
                        value: "1",
                    },
                ],
            },
            {
                seriesname: "East",
                data: [
                    {
                        value: "2.5",
                    },
                    {
                        value: "4.4",
                    },
                    {
                        value: "2",
                    },
                ],
            },
        ],
    };

    const stackedConfigs = {
        type: "stackedcolumn2d",
        width: 300,
        height: 300,
        dataFormat: "json",
        dataSource: stackedData,
    };
</script>

<div class="container">
    <h1>Dashboard</h1>
    <div class="overview">

        <div class="active-units-container">
            <div class="text-icon">
                <h4>Active Units</h4>
                <Bus color="Green"/>
            </div>
            <h3>18,417</h3>
            <p>
                <span>97.44% <MoveUpRight size="16"/></span>
                of total registered
            </p>
        </div>
        <div class="active-units-container">
            <div class="text-icon">
                <h4>Inactive Units</h4>
                <Bus color="red"/>
            </div>
            <h3>484</h3>
            <p>
                <span>2.56% <MoveUpRight size="16"/></span>
                of total registered
            </p>
        </div>
        <div class="active-units-container">
            <div class="text-icon">
                <h4>Total Registered</h4>
                <Bus color="blue"/>
            </div>
            <h3>18,901</h3>
            <p>
                <span>100%</span>
            </p>
        </div>

    </div>
    <div class="chart-container">
        <SvelteFC {...chartConfigs} />
        <SvelteFC {...pieConfigs} />
        <SvelteFC {...lineConfigs} />
    </div>
    <SvelteFC {...stackedConfigs} />
</div>

<style>
    .container {
        width: 100%;
        background-color: var(--background);
        padding-inline: 1rem;
        height: 100svh;
    }
    .chart-container {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        padding-block: 2rem;
    }
    .overview {
        display: flex;
        gap: 1rem;
    }
    .active-units-container {
        border: 1px solid black;
        width: 20%;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .text-icon  {
            display: flex;
            justify-content: space-between;
        }
        p span {
            color:green;
        }
    }
    
    
</style>
