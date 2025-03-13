<script lang="ts">
  import { Pencil, Plus, Search, Trash, ChevronDown } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import EditAccountModal from "../components/modals/EditAccountModal.svelte";

  // Filter Controls
  let active_filter = $state("all");
  function setActiveTab(filter: string) {
    active_filter = filter;
  }

  const filters = [
    { name: "all", label: "All", matches: () => true },
    {
      name: "active",
      label: "Active",
      matches: (c: any) => c.subscription.status === "active",
    },
    {
      name: "expired",
      label: "Expired",
      matches: (c: any) => c.subscription.status === "expired",
    },
    {
      name: "no-subscription",
      label: "No Subscription",
      matches: (c: any) => c.subscription.type === "none",
    },
  ];

  // Mock data
  const baseData = [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "ABC Logistics",
      email: "admin@abc.com",
      password_hash: "hashed_password",
      created_at: new Date(2023, 5, 15),
      avatar: "https://placehold.co/40",
      account_type: "Individual",
      subscription: {
        type: "bulk",
        status: "active",
        expires_at: new Date(2024, 11, 31),
        devices_allowed: 100,
      },
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "XYZ Logistics",
      email: "xyz@xyz.com",
      password_hash: "hashed_password",
      created_at: new Date(2023, 8, 22),
      avatar: "https://placehold.co/40",
      account_type: "Company",
      subscription: {
        type: "per-device",
        status: "expired",
        expires_at: new Date(2023, 11, 31),
        devices_allowed: 0,
      },
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Global Shipping",
      email: "contact@globalshipping.com",
      password_hash: "hashed_password",
      created_at: new Date(2024, 1, 5),
      avatar: "https://placehold.co/40",
      account_type: "Individual",
      subscription: {
        type: "bulk",
        status: "active",
        expires_at: new Date(2025, 1, 5),
        devices_allowed: 250,
      },
    },
    {
      _id: "507f1f77bcf86cd799439014",
      name: "Fast Delivery Co",
      email: "info@fastdelivery.com",
      password_hash: "hashed_password",
      created_at: new Date(2024, 0, 12),
      avatar: "https://placehold.co/40",
      account_type: "Individual",
      subscription: {
        type: "per-device",
        status: "active",
        expires_at: new Date(2024, 6, 12),
        devices_allowed: 0,
      },
    },
    {
      _id: "507f1f77bcf86cd799439015",
      name: "City Couriers",
      email: "dispatch@citycouriers.com",
      password_hash: "hashed_password",
      created_at: new Date(2023, 11, 8),
      avatar: "https://placehold.co/40",
      account_type: "Company",
      subscription: {
        type: "bulk",
        status: "expired",
        expires_at: new Date(2024, 2, 8),
        devices_allowed: 50,
      },
    },
    {
      _id: "507f1f77bcf86cd799439016",
      name: "iPick Center",
      email: "ipick@center.com",
      password_hash: "hashed_password",
      created_at: new Date(2023, 11, 8),
      avatar: "https://placehold.co/40",
      account_type: "Company",
      subscription: {
        type: "none",
        status: "expired",
        expires_at: new Date(2024, 2, 8),
        devices_allowed: 0,
      },
    },
  ];

  let data = [...baseData, ...baseData, ...baseData];

  // Search functionality
  let searchquery = $state("");

  // Pagination
  let itemsPerPage = $state(15);
  let currentPage = $state(1);

  function filteredData() {
    const filtered = data.filter(
      (company) =>
        filters.find((f) => f.name === active_filter)?.matches(company) &&
        (company.name.toLowerCase().includes(searchquery.toLowerCase()) ||
          company.email.toLowerCase().includes(searchquery.toLowerCase())),
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return {
      items: filtered.slice(start, end),
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }

  function nextPage() {
    if (currentPage < filteredData().totalPages) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  function getStatusColor(status: string, type: string) {
    if (status === "active") return "var(--accent)";
    if (status === "expired") return "var(--secondary)";
    if (type === "none") return "var(--border)";
    return "var(--border)";
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // EditAccountModal
  let show_modal = $state("");
  let selected_company: any = $state({});

  // Determine if we're on mobile
  let isMobile = $state(window.innerWidth < 768);

  function handleResize() {
    isMobile = window.innerWidth < 768;
  }

  // Call on mount
  import { onMount } from "svelte";

  onMount(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<div class="container" in:fade={{ duration: 200 }}>
  <!-- Header -->
  <header>
    <h1>Companies Management</h1>
    <button
      id="add-company-btn"
      onclick={() => {
        show_modal = "add";
      }}
    >
      <Plus size={20} color="#f8f9fa" />
      <span class="button-text">Add Account</span>
    </button>
  </header>

  <!-- Filter Controls -->
  <div class="controls">
    <div class="filters">
      {#each filters as { name, label }}
        <button
          class:active={active_filter === name}
          onclick={() => setActiveTab(name)}
        >
          {label}
        </button>
      {/each}
    </div>
    <div class="search">
      <Search size={18} />
      <input
        type="text"
        placeholder="Search by name or email"
        bind:value={searchquery}
      />
    </div>
  </div>

  <!-- Companies List -->
  <div class="companies-container">
    {#if isMobile}
      <!-- Mobile View with Accordion -->
      {#if filteredData().items.length === 0}
        <div class="empty-state">
          <p>No companies found matching your criteria</p>
        </div>
      {:else}
        <div class="accordion-list">
          {#each filteredData().items as company}
            <details class="accordion-item">
              <summary class="accordion-header">
                <div class="company-summary">
                  <img
                    src="https://avatar.iran.liara.run/public/boy/?size=40"
                    alt={company.name}
                  />
                  <div class="company-title">
                    <span class="company-name">{company.name}</span>
                    <div
                      class="subscription-pill"
                      style="background-color: {getStatusColor(
                        company.subscription.status,
                        company.subscription.type,
                      )};"
                    >
                      {company.subscription.type === "bulk"
                        ? "Bulk"
                        : company.subscription.type === "none"
                          ? "None"
                          : "Per-Device"}
                    </div>
                  </div>
                  <ChevronDown class="chevron-icon" size={18} />
                </div>
              </summary>
              <div class="accordion-content">
                <div class="company-detail">
                  <strong>Email:</strong>
                  {company.email}
                </div>
                <div class="company-detail">
                  <strong>Account Type:</strong>
                  {company.account_type}
                </div>
                <div class="company-detail">
                  <strong>Status:</strong>
                  {company.subscription.status}
                </div>
                <div class="company-detail">
                  <strong>Expires:</strong>
                  {formatDate(company.subscription.expires_at)}
                </div>
                <div class="company-detail">
                  <strong>Devices Allowed:</strong>
                  {company.subscription.devices_allowed}
                </div>
                <div class="company-actions">
                  <button
                    class="action-button edit-button"
                    onclick={() => {
                      selected_company = company;
                      show_modal = "edit";
                    }}
                  >
                    <Pencil size={16} color="green" />
                    <span>Edit</span>
                  </button>
                  <button
                    class="action-button delete-button"
                    onclick={() => {
                      selected_company = company;
                      show_modal = "delete";
                    }}
                  >
                    <Trash size={16} color="red" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </details>
          {/each}
        </div>
      {/if}
    {:else}
      <!-- Desktop View with Table -->
      <div class="table-container">
        <div class="table-header">
          <div>Name</div>
          <div>Email</div>
          <div>Subscription</div>
          <div>Type</div>
          <div>Actions</div>
        </div>
        <div class="table-contents">
          {#if filteredData().items.length === 0}
            <div class="empty-state">
              <p>No companies found matching your criteria</p>
            </div>
          {:else}
            {#each filteredData().items as company}
              <div class="table-row">
                <div class="name-cell">
                  <img
                    src="https://avatar.iran.liara.run/public/boy/?size=40"
                    alt={company.name}
                  />
                  <span>{company.name}</span>
                </div>
                <div class="email-cell">{company.email}</div>
                <div class="subscription-wrapper">
                  <div
                    class="subscription-pill"
                    style="background-color: {getStatusColor(
                      company.subscription.status,
                      company.subscription.type,
                    )};"
                  >
                    {company.subscription.type === "bulk"
                      ? "Bulk"
                      : company.subscription.type === "none"
                        ? "None"
                        : "Per-Device"}
                  </div>
                  <div class="tooltip">
                    <div class="tooltip-content">
                      <span>Status: {company.subscription.status}</span>
                      <span
                        >Expires: {formatDate(
                          company.subscription.expires_at,
                        )}</span
                      >
                      <span
                        >Devices: {company.subscription.devices_allowed}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="type-cell">{company.account_type}</div>
                <div class="table-actions">
                  <button
                    class="action-button edit-button"
                    onclick={() => {
                      selected_company = company;
                      show_modal = "edit";
                    }}
                    aria-label="Edit company"
                  >
                    <Pencil size={20} color="green" />
                  </button>
                  <button
                    class="action-button delete-button"
                    onclick={() => {
                      selected_company = company;
                      show_modal = "delete";
                    }}
                    aria-label="Delete company"
                  >
                    <Trash size={20} color="red" />
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    {/if}

    <!-- Pagination -->
    {#if filteredData().totalPages > 1}
      <div class="pagination">
        <button
          onclick={prevPage}
          disabled={currentPage === 1}
          class="pagination-button"
        >
          Previous
        </button>
        <span class="page-info">
          Page {currentPage} of {filteredData().totalPages}
        </span>
        <button
          onclick={nextPage}
          disabled={currentPage === filteredData().totalPages}
          class="pagination-button"
        >
          Next
        </button>
      </div>
    {/if}
  </div>
</div>

{#if show_modal !== ""}
  <div class="modal" transition:fly={{ y: 20, duration: 300 }}>
    {#if show_modal === "edit"}
      <EditAccountModal {selected_company} onClose={() => (show_modal = "")} />
    {/if}
  </div>
{/if}

<style lang="scss">
  :global(body) {
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }

  .container {
    width: 100%;
    height: 100vh;
    max-width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    border-bottom: 1px solid var(--border);
    background-color: var(--background);
    position: sticky;
    top: 0;
    z-index: 10;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    #add-company-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius);
      background-color: var(--primary);
      cursor: pointer;
      outline: none;
      border: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .button-text {
        color: var(--background);
        font-weight: 600;
        white-space: nowrap;
      }

      &:hover {
        background-color: var(--primary-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      &:active {
        background-color: var(--primary-active);
        transform: translateY(0);
      }
    }
  }

  .controls {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    align-items: center;
    background-color: var(--background);
    flex-wrap: wrap;
    gap: 1rem;
    position: sticky;
    top: 4.25rem;
    z-index: 9;

    .filters {
      display: flex;
      gap: 0.5rem;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scrollbar-width: thin;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: var(--border);
        border-radius: 4px;
      }

      button {
        display: flex;
        align-items: center;
        padding: 0.5rem 1.25rem;
        background-color: transparent;
        cursor: pointer;
        border-radius: var(--border-radius);
        outline: none;
        border: 1px solid var(--border);
        transition: all 0.2s ease;
        font-weight: 600;
        white-space: nowrap;

        &:hover {
          background-color: var(--border);
        }

        &:active {
          transform: scale(0.98);
        }

        &.active {
          background-color: var(--primary);
          color: var(--background);
          border-color: var(--primary);
        }
      }
    }

    .search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--border-radius);
      flex-shrink: 0;
      transition: all 0.2s ease;

      &:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
      }

      input {
        background: transparent;
        border: none;
        outline: none;
        min-width: 200px;
        color: var(--text);
        font-size: 0.95rem;
      }
    }
  }

  /* Common styles */
  .companies-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 1rem 1rem;
    overflow: hidden;
    background-color: var(--background);
    border-radius: var(--border-radius);
    border: 1px solid var(--border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  /* Subscription pill */
  .subscription-pill {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    color: var(--background);
    width: fit-content;
    font-weight: 600;
    font-size: 0.85rem;
  }

  /* Desktop Table styles */
  .table-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .table-header {
      display: flex;
      position: sticky;
      justify-content: space-between;
      background-color: var(--background-alt, #f8f9fa);
      height: 3rem;
      top: 0;
      width: 100%;
      align-items: center;
      z-index: 1;

      & > div {
        font-weight: 700;
        padding: 0 1rem;
        flex: 1;
        text-align: left;
        color: var(--text-secondary, #6c757d);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      div:nth-child(1) {
        flex: 1.5;
      }
      div:nth-child(2) {
        flex: 1.5;
      }
      div:nth-child(5) {
        flex: 0.75;
        text-align: center;
      }
    }

    .table-contents {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;

      .table-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        min-height: 4rem;
        align-items: center;
        background-color: var(--background);
        transition: all 0.2s ease;
        border-bottom: 1px solid var(--border);

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: var(--background-alt, #f8f9fa);
        }

        .name-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1.5;
          min-width: 0;

          img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          span {
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .email-cell {
          flex: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .subscription-wrapper {
          flex: 1;
          position: relative;

          .tooltip {
            position: absolute;
            display: none;
            top: 100%;
            left: 50%;
            transform: translate(-50%, 8px);
            z-index: 100;

            .tooltip-content {
              background-color: var(--background);
              padding: 0.75rem;
              border-radius: var(--border-radius);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              min-width: 200px;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              border: 1px solid var(--border);

              span {
                font-size: 0.9rem;
                white-space: nowrap;
              }
            }
          }

          &:hover .tooltip {
            display: block;
          }
        }

        .type-cell {
          flex: 1;
          font-size: 0.9rem;
        }

        .table-actions {
          display: flex;
          gap: 0.75rem;
          flex: 0.75;
          justify-content: center;

          .action-button {
            background-color: transparent;
            border: none;
            outline: none;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
              background-color: var(--background-alt, #f8f9fa);
              transform: translateY(-2px);
            }

            &:active {
              transform: translateY(0);
            }

            &.edit-button:hover {
              background-color: rgba(0, 128, 0, 0.1);
            }

            &.delete-button:hover {
              background-color: rgba(255, 0, 0, 0.1);
            }
          }
        }
      }
    }
  }

  /* Mobile Accordion styles */
  .accordion-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
  }

  .accordion-item {
    border-bottom: 1px solid var(--border);

    &:last-child {
      border-bottom: none;
    }
  }

  .accordion-header {
    padding: 0;
    list-style: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &::-webkit-details-marker {
      display: none;
    }

    .company-summary {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      position: relative;

      img {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
      }

      .company-title {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .company-name {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subscription-pill {
          font-size: 0.75rem;
          padding: 0.15rem 0.5rem;
        }
      }
    }
  }

  .accordion-content {
    padding: 1rem;
    background-color: var(--background-alt, #f8f9fa);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .company-detail {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.9rem;

      strong {
        min-width: 120px;
        color: var(--text-secondary);
      }
    }

    .company-actions {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border);

      .action-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: transparent;
        border: 1px solid var(--border);
        border-radius: var(--border-radius);
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
        justify-content: center;

        &.edit-button:hover {
          background-color: rgba(0, 128, 0, 0.1);
          border-color: green;
        }

        &.delete-button:hover {
          background-color: rgba(255, 0, 0, 0.1);
          border-color: red;
        }
      }
    }
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-top: 1px solid var(--border);
    background-color: var(--background);

    .pagination-button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--border-radius);
      background-color: var(--background);
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 600;

      &:hover:not(:disabled) {
        background-color: var(--primary);
        color: var(--background);
        border-color: var(--primary);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .page-info {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    header {
      padding: 1rem;

      h1 {
        font-size: 1.25rem;
      }

      #add-company-btn {
        padding: 0.5rem;

        .button-text {
          display: none;
        }
      }
    }

    .controls {
      top: 3.5rem;
      padding: 0.75rem;
      flex-direction: column;
      align-items: stretch;

      .filters {
        width: 100%;
        justify-content: flex-start;

        button {
          padding: 0.4rem 0.75rem;
          font-size: 0.85rem;
        }
      }

      .search {
        width: 100%;
        box-sizing: border-box;

        input {
          width: 100%;
          min-width: 0;
        }
      }
    }

    .companies-container {
      margin: 0 0.5rem 0.5rem;
    }
  }
</style>
