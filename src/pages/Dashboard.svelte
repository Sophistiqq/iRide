<script lang="ts">
  import FusionCharts from "fusioncharts";
  import Charts from "fusioncharts/fusioncharts.charts";
  import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
  import { Bus, CircleAlert, Cpu, Microchip, TrafficCone } from "lucide-svelte";

  import SvelteFC, { fcRoot } from "svelte-fusioncharts";

  fcRoot(FusionCharts, Charts, FusionTheme);

  // Monthly production data
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

  // Chart configurations
  const chartConfigs = {
    type: "column2d",
    width: "100%",
    height: 300,
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Monthly Production",
        subCaption: "Bus Fleet",
        xAxisName: "Month",
        yAxisName: "Total Operational Buses",
        theme: "fusion",
        bgColor: "#FFFFFF",
        showBorder: "0",
        showCanvasBorder: "0",
        plotBorderAlpha: "10",
        usePlotGradientColor: "1",
        plotFillAlpha: "95",
        showValues: "1",
        showAlternateHGridColor: "0",
        divLineColor: "#CCCCCC",
        showToolTip: "1",
        toolTipBgColor: "#484E69",
        toolTipPadding: "5",
        toolTipBorderRadius: "2",
        toolTipBorderThickness: "1",
        toolTipBorderColor: "#484E69",
        toolTipBorderAlpha: "30",
      },
      data: barData,
    },
  };

  // Pie chart data & config
  const pieData = {
    chart: {
      caption: "Fleet Status",
      subcaption: "Active vs Inactive",
      showvalues: "1",
      showpercentintooltip: "0",
      enablemultislicing: "1",
      theme: "fusion",
      useDataPlotColorForLabels: "1",
      bgColor: "#FFFFFF",
      showBorder: "0",
      plotBorderAlpha: "10",
    },
    data: [
      {
        label: "Active",
        value: "18345",
        color: "#4CAF50",
      },
      {
        label: "Inactive",
        value: "556",
        color: "#FF5252",
      },
    ],
  };

  const pieConfigs = {
    type: "pie2d",
    width: "100%",
    height: 300,
    dataFormat: "json",
    dataSource: pieData,
  };

  // Line chart data & config
  const lineData = {
    chart: {
      caption: "Daily Performance Metrics",
      yaxisname: "Usage (%)",
      subcaption: "Last 7 Days",
      showhovereffect: "1",
      numbersuffix: "%",
      drawcrossline: "1",
      theme: "fusion",
      bgColor: "#FFFFFF",
      showBorder: "0",
    },
    categories: [
      {
        category: [
          { label: "Mon" },
          { label: "Tue" },
          { label: "Wed" },
          { label: "Thu" },
          { label: "Fri" },
          { label: "Sat" },
          { label: "Sun" },
        ],
      },
    ],
    dataset: [
      {
        seriesname: "On-Time Rate",
        color: "#3F51B5",
        data: [
          { value: "92" },
          { value: "88" },
          { value: "90" },
          { value: "91" },
          { value: "94" },
          { value: "95" },
          { value: "93" },
        ],
      },
      {
        seriesname: "Fuel Efficiency",
        color: "#4CAF50",
        data: [
          { value: "87" },
          { value: "85" },
          { value: "88" },
          { value: "86" },
          { value: "89" },
          { value: "90" },
          { value: "91" },
        ],
      },
      {
        seriesname: "Capacity Utilization",
        color: "#FF9800",
        data: [
          { value: "75" },
          { value: "78" },
          { value: "82" },
          { value: "79" },
          { value: "85" },
          { value: "71" },
          { value: "68" },
        ],
      },
    ],
  };

  const lineConfigs = {
    type: "msline",
    width: "100%",
    height: 300,
    dataFormat: "json",
    dataSource: lineData,
  };

  // Server status data
  let serverStatus = {
    SystemUptime: 211,
    RAM: 20,
    RecentLogs: 604,
    ActiveSessions: 849,
    ServerName: "iTrack",
    ServerIp: "10.0.0.1",
    CPUUsage: 70,
    NetworkTraffic: 35,
    LoggedinUsers: 853,
    AccessLogs: 18901,
    ScheduledMaintenance: "May 15, 2025",
    RecentAlerts: 583,
    IncidentReports: 47,
    ErrorLogs: 3,
    totalUnits: 18901,
    activeUnits: 18345,
  };

  // Alerts data
  const recentAlerts = [
    {
      id: 1,
      title: "Low Fuel Warning",
      unit: "Bus #2453",
      time: "10:23 AM",
      severity: "high",
    },
    {
      id: 2,
      title: "Maintenance Due",
      unit: "Bus #1872",
      time: "Yesterday",
      severity: "medium",
    },
    {
      id: 3,
      title: "Route Delay",
      unit: "Bus #3124",
      time: "09:15 AM",
      severity: "low",
    },
    {
      id: 4,
      title: "GPS Signal Lost",
      unit: "Bus #4209",
      time: "08:30 AM",
      severity: "medium",
    },
  ];

  // Calculate percentages
  const activePercentage = (
    (serverStatus.activeUnits / serverStatus.totalUnits) *
    100
  ).toFixed(1);
  const inactivePercentage = (100 - parseFloat(activePercentage)).toFixed(1);

  // Progress bar component
  function getProgressColor(value) {
    if (value > 80) return "var(--danger-color)";
    if (value > 60) return "var(--warning-color)";
    return "var(--success-color)";
  }
</script>

<div class="app-container">
  <!-- Main Content -->
  <main class="main-content">
    <header class="main-header">
      <h1>Bus Fleet Management Dashboard</h1>
    </header>

    <div class="content-area">
      <!-- Stats Overview -->
      <section class="stats-cards">
        <div class="card stat-card">
          <div class="card-content">
            <div class="stat-header">
              <div>
                <h3>Active Units</h3>
                <p class="stat-value">{serverStatus.activeUnits}</p>
              </div>
              <div class="stat-icon active">
                <Bus size={24} />
              </div>
            </div>
            <div class="stat-footer">
              <span class="percentage positive">{activePercentage}%</span>
              <span class="description">of total fleet</span>
            </div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-content">
            <div class="stat-header">
              <div>
                <h3>Inactive Units</h3>
                <p class="stat-value">
                  {serverStatus.totalUnits - serverStatus.activeUnits}
                </p>
              </div>
              <div class="stat-icon inactive">
                <Bus size={24} />
              </div>
            </div>
            <div class="stat-footer">
              <span class="percentage negative">{inactivePercentage}%</span>
              <span class="description">of total fleet</span>
            </div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-content">
            <div class="stat-header">
              <div>
                <h3>Total Fleet</h3>
                <p class="stat-value">{serverStatus.totalUnits}</p>
              </div>
              <div class="stat-icon total">
                <Bus size={24} />
              </div>
            </div>
            <div class="stat-footer">
              <span class="percentage">100%</span>
              <span class="description">registered vehicles</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <div class="chart-container card">
          <h3>Monthly Bus Operations</h3>
          <SvelteFC {...chartConfigs} />
        </div>

        <div class="chart-row">
          <div class="chart-container card">
            <h3>Fleet Status</h3>
            <SvelteFC {...pieConfigs} />
          </div>

          <div class="chart-container card">
            <h3>Performance Metrics</h3>
            <SvelteFC {...lineConfigs} />
          </div>
        </div>
      </section>

      <!-- Server Status & Alerts Section -->
      <section class="dashboard-bottom">
        <div class="card server-status">
          <h3>Server Status</h3>

          <div class="status-item">
            <div class="status-label">
              <Cpu size={16} />
              <span>CPU Usage</span>
            </div>
            <div class="progress-container">
              <div
                class="progress-bar"
                style="width: {serverStatus.CPUUsage}%; background-color: {getProgressColor(
                  serverStatus.CPUUsage,
                )}"
              ></div>
            </div>
            <span class="progress-value">{serverStatus.CPUUsage}%</span>
          </div>

          <div class="status-item">
            <div class="status-label">
              <Microchip size={16} />
              <span>RAM Usage</span>
            </div>
            <div class="progress-container">
              <div
                class="progress-bar"
                style="width: 50%; background-color: {getProgressColor(50)}"
              ></div>
            </div>
            <span class="progress-value">50%</span>
          </div>

          <div class="status-item">
            <div class="status-label">
              <TrafficCone size={16} />
              <span>Network Traffic</span>
            </div>
            <div class="progress-container">
              <div
                class="progress-bar"
                style="width: {serverStatus.NetworkTraffic}%; background-color: {getProgressColor(
                  serverStatus.NetworkTraffic,
                )}"
              ></div>
            </div>
            <span class="progress-value">{serverStatus.NetworkTraffic}%</span>
          </div>

          <div class="server-details">
            <div class="detail-item">
              <span class="detail-label">Server Name:</span>
              <span class="detail-value">{serverStatus.ServerName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Server IP:</span>
              <span class="detail-value">{serverStatus.ServerIp}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Uptime:</span>
              <span class="detail-value">{serverStatus.SystemUptime} hours</span
              >
            </div>
            <div class="detail-item">
              <span class="detail-label">Active Users:</span>
              <span class="detail-value">{serverStatus.LoggedinUsers}</span>
            </div>
          </div>
        </div>

        <div class="card recent-alerts">
          <h3>Recent Alerts</h3>

          <div class="alerts-list">
            {#each recentAlerts as alert}
              <div
                class="alert-item"
                class:high={alert.severity === "high"}
                class:medium={alert.severity === "medium"}
                class:low={alert.severity === "low"}
              >
                <div class="alert-icon">
                  <CircleAlert size={20} />
                </div>
                <div class="alert-content">
                  <h4>{alert.title}</h4>
                  <div class="alert-details">
                    <span>{alert.unit}</span>
                    <span class="alert-time">{alert.time}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <button class="view-all">View All Alerts</button>
        </div>
      </section>
    </div>
  </main>
</div>

<style>
  :root {
    --sidebar-width: max-width;
    --sidebar-collapsed-width: max-width;
    --transition-speed: 0.3s;
  }

  .app-container {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    font-family: "Inter", "Segoe UI", Roboto, sans-serif;
  }

  /* Main Content Styles */
  .main-content {
    flex: 1;
    overflow-y: auto;
  }

  .main-header {
    height: 64px;
    padding: 0 2rem;
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .main-header h1 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .content-area {
    padding: 1.5rem;
  }

  /* Cards & Stats Styles */
  .card {
    background-color: var(--background);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding: 1rem 1rem 0;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card .card-content {
    padding: 1rem;
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 0.25rem;
  }

  .stat-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .stat-icon.active {
    background-color: var(--accent);
  }

  .stat-icon.inactive {
    background-color: var(--secondary);
  }

  .stat-icon.total {
    background-color: var(--primary);
  }

  .stat-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .percentage {
    font-weight: 600;
  }

  .positive {
    color: var(--accent);
  }

  .negative {
    color: var(--secondary);
  }

  .description {
    color: var(--border);
    font-size: 0.875rem;
  }

  /* Charts Styles */
  .charts-section {
    margin-bottom: 1.5rem;
  }

  .chart-container {
    width: 100%;
  }

  .chart-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 1rem;
  }

  /* Server Status & Alerts */
  .dashboard-bottom {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .server-status,
  .recent-alerts {
    padding: 1rem;
  }

  .status-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .status-label {
    width: 120px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .progress-container {
    flex: 1;
    height: 0.5rem;
    background-color: var(--border);
    border-radius: 1rem;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    border-radius: 1rem;
  }

  .progress-value {
    width: 40px;
    text-align: right;
    font-size: 0.875rem;
  }

  .server-details {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .detail-item {
    display: flex;
    margin-bottom: 0.5rem;
  }

  .detail-label {
    width: 120px;
    color: var(--border);
    font-size: 0.875rem;
  }

  .alerts-list {
    margin-bottom: 1rem;
  }

  .alert-item {
    display: flex;
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    background-color: var(--secondary);
    background-color: var(--secondary-hover);
  }

  .alert-item.high {
    border-left-color: firebrick;
  }

  .alert-item.medium {
    border-left-color: var(--secondary);
  }

  .alert-item.low {
    border-left-color: var(--accent);
  }

  .alert-icon {
    display: flex;
    align-items: flex-start;
    margin-right: 0.75rem;
    color: var(--warning-color);
  }

  .alert-item.high .alert-icon {
    color: var(--danger-color);
  }

  .alert-item.low .alert-icon {
    color: var(--success-color);
  }

  .alert-content {
    flex: 1;
  }

  .alert-content h4 {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .alert-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-light);
  }

  .view-all {
    width: 100%;
    padding: 0.75rem;
    background-color: transparent;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-color);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .view-all:hover {
    background-color: var(--hover-color);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      height: 100%;
    }

    .main-content {
      margin-left: var(--sidebar-collapsed-width);
    }

    .chart-row {
      grid-template-columns: 1fr;
    }

    .dashboard-bottom {
      grid-template-columns: 1fr;
    }
  }
</style>
