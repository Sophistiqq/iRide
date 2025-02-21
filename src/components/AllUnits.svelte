<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpDown, Loader2, RefreshCcwIcon } from "lucide-svelte";
  import DeviceDetails from "./DeviceDetails.svelte";
  //import { data } from "./fakedata";
  export const API_URL = import.meta.env.VITE_SERVER_API_URL;
  interface Location {
    id: string;
    device_id: string;
    latitude: number;
    longitude: number;
    timestamp: string;
  }
  const { searchquery } = $props();
  // State
  let history: Location[] = $state([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Pagination
  let currentPage = $state(1);
  let itemsPerPage = $state(10);
  let totalItems = $state(0);

  // Sorting
  let sortField = $state<keyof Location>("timestamp");
  let sortDirection = $state<"asc" | "desc">("desc");

  // Computed values
  let totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
  let paginatedHistory = $derived(getPaginatedData());

  onMount(() => {
    getHistoryAllUnits();
    console.log(API_URL);
  });

  async function getHistoryAllUnits() {
    try {
      loading = true;
      error = null;
      const res = await fetch(`${API_URL}/unit-history`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      history = data.locations.map((location: Location) => ({
        ...location,
        timestamp: new Date(location.timestamp).toLocaleString(),
      }));
      totalItems = history.length;
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  }
  // Update the effect to reset pagination when search changes
  $effect(() => {
    if (searchquery !== undefined) {
      const filteredHistory = history.filter((unit) =>
        unit.device_id.toLowerCase().includes(searchquery.toLowerCase()),
      );
      totalItems = filteredHistory.length;
      // Reset to first page when search changes
      currentPage = 1;
    } else {
      totalItems = history.length;
    }
  });

  function getPaginatedData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // First, filter the data based on search query
    let filteredData = searchquery
      ? history.filter((unit) =>
          unit.device_id.toLowerCase().includes(searchquery.toLowerCase()),
        )
      : history;

    // Then sort the filtered data
    let sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

    return sortedData.slice(startIndex, endIndex);
  }

  function handleSort(field: keyof Location) {
    if (field === sortField) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortDirection = "asc";
    }
  }

  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function openInMaps(lat: number, lng: number) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  }

  let detailsModal = $state(false);
</script>

<div class="all-units">
  <header class="header">
    <p><b>All Units</b></p>
    <div class="pagination-controls">
      <span class="pagination-info">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
          currentPage * itemsPerPage,
          totalItems,
        )} of {totalItems} entries
      </span>
      <button
        onclick={getHistoryAllUnits}
        disabled={loading}
        class="refresh-button"
        title="Refresh data"
      >
        <RefreshCcwIcon size="20" class="animate-spin" />
      </button>

      <select bind:value={itemsPerPage} onchange={() => (currentPage = 1)}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  </header>

  {#if loading}
    <div class="loading">
      <Loader2 class="animate-spin" />
      <span>Loading data...</span>
    </div>
  {:else if error}
    <div class="error">
      <p>Error: {error}</p>
      <button onclick={getHistoryAllUnits} class="retry-button"> Retry </button>
    </div>
  {:else if history.length === 0}
    <p class="no-data">No data available</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <button
                class="sort-button"
                onclick={() => handleSort("device_id")}
              >
                Device ID
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th>Last Location</th>
            <th>
              <button
                class="sort-button"
                onclick={() => handleSort("timestamp")}
              >
                Last Update
                <ArrowUpDown size={16} />
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedHistory as unit}
            <tr>
              <td>{unit.device_id}</td>
              <td>
                <div class="coordinates">
                  <span
                    >{unit.latitude.toFixed(6)}, {unit.longitude.toFixed(
                      6,
                    )}</span
                  >
                  <div class="coordinate-actions">
                    <button
                      class="icon-button"
                      onclick={() => openInMaps(unit.latitude, unit.longitude)}
                      title="Open in Google Maps"
                    >
                      Map
                    </button>
                  </div>
                </div>
              </td>
              <td>{unit.timestamp}</td>
              <td>
                <div class="actions">
                  <button
                    class="action-button"
                    onclick={() => (detailsModal = true)}>Details</button
                  >
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button
        class="page-button"
        disabled={currentPage === 1}
        onclick={() => handlePageChange(1)}
      >
        First
      </button>
      <button
        class="page-button"
        disabled={currentPage === 1}
        onclick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>

      {#each Array(totalPages) as _, i}
        {#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
          <button
            class="page-button"
            class:active={currentPage === i + 1}
            onclick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        {:else if i + 1 === currentPage - 2 || i + 1 === currentPage + 2}
          <span class="ellipsis">...</span>
        {/if}
      {/each}

      <button
        class="page-button"
        disabled={currentPage === totalPages}
        onclick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
      <button
        class="page-button"
        disabled={currentPage === totalPages}
        onclick={() => handlePageChange(totalPages)}
      >
        Last
      </button>
    </div>
  {/if}
</div>

{#if detailsModal}
  <div class="modal">
    <DeviceDetails />
  </div>
{/if}

<style lang="scss">
  .all-units {
    width: 100%;
    background-color: var(--background);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .pagination-controls {
    display: flex;
    gap: 1rem;
    align-items: center;

    select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
    }
  }

  .loading,
  .error,
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .retry-button {
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
      background-color: var(--primary-hover);
    }
  }

  .table-container {
    overflow-x: auto;
    overflow-y: auto;
    height: 60vh;
    background-color: white;
    border-radius: 0.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .table-container {
      height: 50svh;
    }
    .pagination-info {
      display: none;
    }

    .pagination {
      font-size: 0.75rem;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #e7e7ea;
      font-weight: 600;
    }

    tr:hover {
      background-color: #d7d7da;
    }
  }

  .sort-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-weight: 600;
    color: inherit;
  }

  .coordinates {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .coordinate-actions {
      display: flex;
      gap: 0.25rem;
    }
  }

  .icon-button {
    padding: 0.25rem 0.5rem;
    background-color: #f0f0f0;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.25rem 0.75rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
      background-color: var(--primary-hover);
    }
  }

  .pagination {
    display: flex;
    gap: 0.25rem;
    justify-content: center;
    margin-top: 1rem;

    .page-button {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      cursor: pointer;

      &:hover:not(:disabled) {
        background-color: var(--primary-hover);
        color: var(--text);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.active {
        background-color: var(--primary);
        color: white;
        border-color: var(--primary);
      }
    }

    .ellipsis {
      padding: 0.5rem 0.75rem;
    }
  }
  .refresh-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    &:active {
      transform: scale(0.9);
    }
  }
  .modal {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
</style>
