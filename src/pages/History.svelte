<script lang="ts">
  import { Search } from "lucide-svelte";
  import AllUnits from "../components/AllUnits.svelte";

  let searchquery = $state("");

  function handlesearch() {
    console.log("Searching for:", searchquery);
  }
</script>

<div class="container">
  <div class="header">
    <h2 class="title">Unit History</h2>
    <p class="description">View the unit's logged location</p>

    <div class="controls-container">
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
      </div>
    </div>
  </div>

  <div class="content">
    <AllUnits {searchquery} />
  </div>
</div>

<style lang="scss">
  .container {
    width: 100%;
    background-color: var(--background);
    padding-inline: 1rem;
    height: 100svh;
  }

  .header {
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
    .title {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 2;
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

  .content {
    background-color: white;
    border-radius: 0.5rem;
  }

  @media (max-width: 768px) {
    .container {
      padding-inline: 0.5rem;
      height: 100svh;
      overflow-y: auto;
    }
    .header {
      .title {
        font-size: 1rem;
      }
    }

    .controls-container {
      padding-block: 0.5rem;
    }

    .controls {
      gap: 1rem;
    }

    .search {
      .search-bar {
        padding: 0.25rem 0.4rem;
      }
    }
  }
</style>
