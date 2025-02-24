<script lang="ts">
  import { Search } from "lucide-svelte";
  import { writable, derived } from "svelte/store";
  import { MoreVertical } from "lucide-svelte";

  let users = writable([
    {
      name: "Lee Lorenzo",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "Urban",
      checked: false,
    },
    {
      name: "Roi Borromeo",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "San Rafael",
      checked: false,
    },
    {
      name: "John Mark Adriano",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "San Rafael",
      checked: false,
    },
    {
      name: "Edward Cruz",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "San Rafael",
      checked: false,
    },
    {
      name: "Dremelie Tambio",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "San Isidro",
      checked: false,
    },
    {
      name: "John Rodnie Basio",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "San Isidro",
      checked: false,
    },
    {
      name: "Janet Matias",
      plateNo: "1234",
      bodyNo: "12345",
      lastLocation: "Isabela",
      checked: false,
    },
  ]);

  let plateNos = derived(users, ($users) => [
    ...new Set($users.map((user) => user.bodyNo)),
  ]);
  let lastLocations = derived(users, ($users) => [
    ...new Set($users.map((user) => user.lastLocation)),
  ]);
</script>

<div class="container">
  <div class="header">
    <p>Unit Management</p>
    <p>Manage your team members and their units permission here.</p>
  </div>

  <div class="header-container">
    <h2>All units</h2>
    <div class="header-controls">
      <div class="search-bar">
        <Search size="16" />
        <input type="text" placeholder="Search" />
      </div>
      <select name="filter" id="filter" placeholder="Filter">
        <option value="" selected disabled>Filters</option>
        <option value="all" selected>All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  </div>
  <table>
    <thead>
      <tr class="table-container">
        <th>Select</th>
        <th>Device Name</th>
        <th>Plate No.</th>
        <th>Body No.</th>
        <th>Last Location</th>
        <th>Options</th>
      </tr>
    </thead>
    <tbody>
      {#each $users as user}
        <tr>
          <td><input type="checkbox" /></td>
          <td>{user.name}</td>
          <td>{user.plateNo}</td>
          <td>{user.bodyNo}</td>
          <td>{user.lastLocation}</td>
          <td>
            <button class="more-options">
              <MoreVertical size="14" />
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    width: 100%;
    background-color: var(--background);
    padding-inline: 1rem;
    height: 100svh;
  }

  .header {
    line-height: 0.5rem;
    margin-left: 2rem;
    margin-top: 2rem;
    line-height: 1.2rem;
    
  }
  .header > p {
    &:first-child {
      font-weight: bold;
      font-size: 1.8rem;
      margin-bottom:1rem;
    }
  }
  .header:nth-child(1) {
    font-size: 0.9rem;
    color: #666;
  }
  .header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 2rem;
    margin-top: 2rem;
  }

  .search-bar {
    border: 1px solid #ddd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background-color: #f8f8f8;
    input {
      border: none;
      background-color: transparent;
      margin-left: 8px;
      font-size: 14px;
      width: 150px;
      &:focus {
        outline: none;
      }
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    select {
      border: 1px solid black;
      border-radius: 0.3rem;
      padding: 0.25rem 0.5rem;
    }
  }
  select {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
  }

  table {
    width: 100%;
    margin-left: 2rem;
    margin-top: 2rem;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    tr {
      text-align: left;
    }
  }
  .more-options {
    background: none;
    border: none;
    cursor: pointer;
    text-align: center;
  }
  thead th {
    background: black;
    color: white;
    padding: 12px;
    text-align: left;
  }
  tbody tr {
    border-bottom: 1px solid #ddd;
    transition: 0.2s;
  }
  tbody tr:hover {
    background-color: #f8f9fa;
  }

  td {
    padding: 12px;
    text-align: left;
  }
</style>
