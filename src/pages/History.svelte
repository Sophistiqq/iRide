<script lang="ts">
  import { Search, Calendar } from "lucide-svelte";
  import AllUnits from "../components/AllUnits.svelte";
  type Tab = "all" | "route" | "location";
  type DateRange =
    | "today"
    | "yesterday"
    | "last-week"
    | "last-month"
    | "custom";

  interface DateRangeOption {
    value: DateRange;
    label: string;
  }
  // State management using proper Svelte 5 runes
  let activetab = $state<Tab>("all");
  let searchquery = $state("");
  let selecteddaterange = $state<DateRange>("today");
  let customstartdate = $state<string>(""); // Changed to string for date input compatibility
  let customenddate = $state<string>(""); // Changed to string for date input compatibility

  // Date range options
  const daterangeoptions: DateRangeOption[] = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last-week", label: "Last week" },
    { value: "last-month", label: "Last month" },
    { value: "custom", label: "Custom range" },
  ];

  // Tab configuration
  const tabs = [
    { id: "all" as const, label: "All units" },
    { id: "route" as const, label: "Route history" },
    { id: "location" as const, label: "Location history" },
  ];

  function handlesearch() {
    console.log("Searching for:", searchquery);
  }

  function handledaterangechange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selecteddaterange = target.value as DateRange;
  }

  function handletabclick(tab: Tab) {
    activetab = tab;
  }

  // Handle custom date changes
  function handlecustomdatechange() {
    if (customstartdate && customenddate) {
      console.log("Custom date range:", {
        start: customstartdate,
        end: customenddate,
      });
    }
  }
</script>

<div class="container">
  <div class="header">
    <h2 class="title">Unit History</h2>
    <p class="description">View the unit's logged location and route.</p>
  </div>

  <header class="controls-container">
    <div class="tabs">
      {#each tabs as tab}
        <button
          class="tab-button"
          class:active={activetab === tab.id}
          onclick={() => handletabclick(tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <div class="controls">
      <div class="search">
        <div class="search-bar">
          <Search size={20} class="search-icon" />
          <input
            type="text"
            placeholder="Search a unit..."
            bind:value={searchquery}
            onkeydown={(e) => e.key === "Enter" && handlesearch()}
          />
        </div>
      </div>

      <div class="date-picker">
        <div class="select-wrapper">
          <Calendar size={20} class="calendar-icon" />
          <select
            bind:value={selecteddaterange}
            onchange={handledaterangechange}
            class="date-select"
          >
            {#each daterangeoptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        {#if selecteddaterange === "custom"}
          <div class="custom-date-inputs">
            <input
              type="date"
              bind:value={customstartdate}
              onchange={handlecustomdatechange}
              class="date-input"
            />
            <span class="date-separator">to</span>
            <input
              type="date"
              bind:value={customenddate}
              onchange={handlecustomdatechange}
              class="date-input"
            />
          </div>
        {/if}
      </div>
    </div>
  </header>

  <div class="content">
    {#if activetab === "all"}
      <AllUnits {searchquery} />
    {:else if activetab === "route"}
      <p>Showing route history</p>
    {:else}
      <p>Showing location history</p>
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    min-height: 100vh;
    background-color: var(--background);
    padding-inline: 1rem;
  }

  .header {
    .title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .description {
      color: #666;
    }
  }

  .controls-container {
    padding-block: 1rem;
    border-radius: 0.5rem;
  }

  .tabs {
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;

    .tab-button {
      padding: 0.75rem 1.25rem;
      border: none;
      color: #666;
      cursor: pointer;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background-color: #e9ecef;
      }

      &.active {
        background-color: var(--accent);
        color: white;
      }
    }
  }

  .controls {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    .search {
      flex: 1;
      display: flex;
      gap: 0.75rem;

      .search-bar {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        background-color: white;
        transition: border-color 0.2s ease;

        &:focus-within {
          border-color: var(--accent);
        }

        input {
          flex: 1;
          border: none;
          padding: 0.25rem;
          font-size: 0.975rem;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }

  .date-picker {
    min-width: 200px;

    .select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background-color: white;

      .date-select {
        flex: 1;
        border: none;
        padding: 0.25rem;
        appearance: none;
        background-color: transparent;
        font-size: 0.975rem;
        cursor: pointer;

        &:focus {
          outline: none;
        }
      }
    }
  }

  .custom-date-inputs {
    position: absolute;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.75rem;
    background-color: white;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    .date-input {
      padding: 0.5rem;
      border: none;
      font-size: 0.875rem;

      &:focus {
        outline: none;
        border-color: var(--accent);
      }
    }

    .date-separator {
      color: #94a3b8;
      font-size: 0.875rem;
    }
  }

  .content {
    background-color: white;
    border-radius: 0.5rem;
  }
</style>
