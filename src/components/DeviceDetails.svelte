<script lang="ts">
  import { Loader } from "lucide-svelte";
  import { onMount } from "svelte";

  let SERVER_URL = import.meta.env.VITE_SERVER_API_URL;
  let { selectedUnit } = $props();
  let loading = $state(true);
  let unitHistory: any = $state([]);

  // Calendar related variables
  let currentMonth = $state(new Date().getMonth());
  let currentYear = $state(new Date().getFullYear());
  let selectedDate = $state(new Date());
  let calendarDays: any = $state([]);
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // History display
  let filteredHistory: any = $state([]);

  onMount(() => {
    getUnitDetails();
    generateCalendarDays();
  });

  async function getUnitDetails() {
    loading = true;
    try {
      const res = await fetch(`${SERVER_URL}/get-unit-details`, {
        method: "POST",
        body: JSON.stringify({ device_id: selectedUnit.device_id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // Find the selected device in the devices array
      const selectedDevice = data.devices.find(
        (device: any) => device._id === selectedUnit.device_id,
      );

      if (selectedDevice) {
        // Update selectedUnit with additional device details
        selectedUnit = {
          ...selectedUnit,
          device_name: selectedDevice.device_name,
          body_number: selectedDevice.body_number,
          // Add the most recent location data to selectedUnit
          ...(selectedDevice.logs.length > 0 && {
            latitude: selectedDevice.logs[0].latitude,
            longitude: selectedDevice.logs[0].longitude,
            timestamp: selectedDevice.logs[0].timestamp,
          }),
        };

        // Set unit history from the logs array
        unitHistory = selectedDevice.logs.sort(
          (a: any, b: any) => b.timestamp - a.timestamp,
        );
      } else {
        unitHistory = [];
      }

      // Initialize with today's history
      filterHistoryByDate(selectedDate);
    } catch (error) {
      console.error("Error fetching unit details:", error);
      unitHistory = [];
    } finally {
      loading = false;
    }
  }

  function generateCalendarDays() {
    calendarDays = [];

    // First day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const monthLength = lastDay.getDate();

    // Previous month days to display
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    // Generate array of days
    let day = 1;
    for (let i = 0; i < 6; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          // Previous month days
          week.push({
            day: prevMonthLastDay - (startingDay - j - 1),
            currentMonth: false,
            date: new Date(
              currentYear,
              currentMonth - 1,
              prevMonthLastDay - (startingDay - j - 1),
            ),
          });
        } else if (day > monthLength) {
          // Next month days
          week.push({
            day: day - monthLength,
            currentMonth: false,
            date: new Date(currentYear, currentMonth + 1, day - monthLength),
          });
          day++;
        } else {
          // Current month days
          week.push({
            day: day,
            currentMonth: true,
            date: new Date(currentYear, currentMonth, day),
          });
          day++;
        }
      }
      calendarDays.push(week);
      if (day > monthLength) break;
    }
  }

  function changeMonth(increment: number) {
    currentMonth += increment;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendarDays();
  }

  function selectDate(date: Date) {
    selectedDate = date;
    filterHistoryByDate(date);
  }

  function filterHistoryByDate(date: string | number | Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    filteredHistory = unitHistory.filter((entry: any) => {
      const entryTime = new Date(Number(entry.timestamp));
      return entryTime >= startOfDay && entryTime <= endOfDay;
    });
  }

  function formatTime(timestamp: any) {
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(timestamp: any) {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString();
  }

  function getRelativeTimeAgo(timestamp: any) {
    const now = Date.now();
    const then = Number(timestamp);
    const diffMs = now - then;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? "yesterday" : `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "just now";
    }
  }

  function isToday(date: {
    getDate: () => number;
    getMonth: () => number;
    getFullYear: () => number;
  }) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isSameDate(
    date1: Date,
    date2: { getDate: () => any; getMonth: () => any; getFullYear: () => any },
  ) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    // Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
</script>

<div class="container">
  {#if loading}
    <div class="loader">
      <Loader size={50} />
    </div>
  {:else}
    <div class="details-container">
      <div class="header">
        <h2 class="title">
          {selectedUnit.body_number || "Unit"} Details
        </h2>
        <span class="device-name">
          {selectedUnit.device_name}
        </span>
      </div>

      <div class="content-grid">
        <!-- Calendar Section -->
        <div class="calendar-section">
          <h3 class="section-title">Select Date</h3>
          <div class="calendar">
            <div class="calendar-header">
              <button class="calendar-nav-btn" onclick={() => changeMonth(-1)}
                >&lt;</button
              >
              <div class="calendar-title">
                {monthNames[currentMonth]}
                {currentYear}
              </div>
              <button class="calendar-nav-btn" onclick={() => changeMonth(1)}
                >&gt;</button
              >
            </div>

            <div class="calendar-grid">
              <!-- Day names -->
              {#each dayNames as name}
                <div class="calendar-day-name">{name}</div>
              {/each}

              <!-- Calendar days -->
              {#each calendarDays as week}
                {#each week as day}
                  <button
                    class="calendar-day {day.currentMonth
                      ? 'current-month'
                      : 'other-month'} 
                           {isToday(day.date) ? 'today' : ''} 
                           {isSameDate(selectedDate, day.date)
                      ? 'selected'
                      : ''}"
                    onclick={() => selectDate(day.date)}
                  >
                    {day.day}
                  </button>
                {/each}
              {/each}
            </div>
          </div>
        </div>

        <!-- Location History Section -->
        <div class="history-section">
          <div class="history-header">
            <h3 class="section-title">Location Timeline</h3>
            <span class="date-display">
              {selectedDate.toLocaleDateString()}
            </span>
          </div>

          {#if filteredHistory.length > 0}
            <div class="timeline">
              {#each filteredHistory as entry, i}
                <div class="timeline-entry">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="time-container">
                      <span class="time">{formatTime(entry.timestamp)}</span>
                      <span class="time-ago"
                        >{getRelativeTimeAgo(entry.timestamp)}</span
                      >
                    </div>
                    <div class="location-info">
                      <div class="coordinates">
                        <span>Lat: {entry.latitude.toFixed(6)}</span>
                        <span>Lng: {entry.longitude.toFixed(6)}</span>
                      </div>
                      {#if i > 0}
                        {#if calculateDistance(filteredHistory[i - 1].latitude, filteredHistory[i - 1].longitude, entry.latitude, entry.longitude) > 0.01}
                          <p class="movement">
                            Moved {calculateDistance(
                              filteredHistory[i - 1].latitude,
                              filteredHistory[i - 1].longitude,
                              entry.latitude,
                              entry.longitude,
                            ).toFixed(3)} km
                          </p>
                        {/if}
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-state">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                ></path>
              </svg>
              <p>No location data for this date</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Device Summary -->
      <div class="device-summary">
        <h3 class="section-title">Device Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Device ID</span>
            <span class="summary-value">{selectedUnit.device_id}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Last Updated</span>
            <span class="summary-value"
              >{selectedUnit.timestamp
                ? formatDate(selectedUnit.timestamp) +
                  " " +
                  formatTime(selectedUnit.timestamp)
                : "N/A"}</span
            >
          </div>
          <div class="summary-item">
            <span class="summary-label">Current Location</span>
            <span class="summary-value"
              >{selectedUnit.latitude?.toFixed(6)}, {selectedUnit.longitude?.toFixed(
                6,
              )}</span
            >
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Records</span>
            <span class="summary-value">{unitHistory.length}</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    width: 90%;
    height: 90%;
    background-color: var(--background);
    overflow: hidden;
  }

  .loader {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .details-container {
    padding: 24px;
    height: 100%;
    overflow: auto;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  .device-name {
    margin-left: 8px;
    padding: 4px 12px;
    background-color: #f1f1f1;
    border-radius: 16px;
    font-size: 14px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .calendar-section,
  .history-section,
  .device-summary {
    background-color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .section-title {
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
  }

  /* Calendar Styles */
  .calendar {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .calendar-title {
    font-weight: 500;
  }

  .calendar-nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .calendar-nav-btn:hover {
    background-color: #f1f1f1;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 8px;
  }

  .calendar-day-name {
    text-align: center;
    font-size: 12px;
    color: #666;
    padding: 4px;
    font-weight: 500;
  }

  .calendar-day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    cursor: pointer;
    background-color: white;
    border: none;
    border-radius: 4px;
  }

  .calendar-day:hover {
    background-color: #f1f1f1;
  }

  .current-month {
    color: #333;
  }

  .other-month {
    color: #ccc;
  }

  .today {
    background-color: #e6f7ff;
  }

  .selected {
    background-color: #1890ff;
    color: white;
  }

  .selected:hover {
    background-color: #40a9ff;
  }

  /* History Timeline */
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .date-display {
    font-size: 14px;
    color: #666;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;
    margin-top: 16px;
  }

  .timeline-entry {
    position: relative;
    padding-left: 24px;
    border-left: 2px solid #1890ff;
    padding-bottom: 16px;
  }

  .timeline-marker {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #1890ff;
    border-radius: 50%;
    left: -7px;
    top: 6px;
  }

  .time-container {
    display: flex;
    justify-content: space-between;
  }

  .time {
    font-weight: 500;
  }

  .time-ago {
    font-size: 12px;
    color: #666;
  }

  .location-info {
    margin-top: 8px;
    font-size: 14px;
  }

  .coordinates {
    display: flex;
    gap: 8px;
    color: #333;
  }

  .movement {
    margin-top: 4px;
    margin-bottom: 0;
    color: #0066cc;
    font-size: 13px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
    color: #666;
  }

  .empty-state p {
    margin-top: 16px;
  }

  /* Device Summary */
  .device-summary {
    margin-top: 24px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .summary-item {
    display: flex;
    flex-direction: column;
  }

  .summary-label {
    font-size: 12px;
    color: #666;
  }

  .summary-value {
    margin-top: 4px;
  }
</style>
