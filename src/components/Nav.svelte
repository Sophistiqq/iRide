<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import mapMarker from "../assets/icon.png";
  import {
    Map,
    Calendar,
    Bus,
    CircleUserRound,
    LayoutDashboard,
  } from "lucide-svelte";
  $: activePage = $location;
</script>

<nav>
  <h1 id="title"><img src={mapMarker} alt="Map Marker" /> iTrack</h1>

  <a href="/testing" use:link class={activePage === "/testing" ? "active" : ""}>
    <LayoutDashboard
      size="24"
      color={activePage === "/testing" ? "var(--accent)" : "#333"}
    />
    <p>Testing</p>
  </a>
  <a
    href="/dashboard"
    use:link
    class={activePage === "/dashboard" ? "active" : ""}
  >
    <LayoutDashboard
      size="24"
      color={activePage === "/dashboard" ? "var(--accent)" : "#333"}
    />
    <p>Dashboard</p>
  </a>
  <a href="/map" use:link class={activePage === "/map" ? "active" : ""}>
    <Map size="24" color={activePage === "/map" ? "var(--accent)" : "#333"} />
    <p>Map</p>
  </a>

  <a href="/history" use:link class={activePage === "/history" ? "active" : ""}>
    <Calendar
      size="24"
      color={activePage === "/history" ? "var(--accent)" : "#333"}
    />
    <p>History</p>
  </a>
  <a
    href="/unit-management"
    use:link
    class={activePage === "/unit-management" ? "active" : ""}
  >
    <Bus
      size="24"
      color={activePage === "/unit-management" ? "var(--accent)" : "#333"}
    />
    <p>Unit Management</p>
  </a>
  <a
    href="/profile"
    use:link
    class={activePage === "/profile" ? "active" : ""}
    id="profile"
  >
    <CircleUserRound
      size="24"
      color={activePage === "/profile" ? "var(--accent)" : "#333"}
    />
    <p>Profile</p>
  </a>
</nav>

<style>
  nav {
    display: flex;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
    z-index: 100;
    min-width: max-content;
    flex-direction: column;
    padding-inline: 1.5rem;
    height: 100%;
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      bottom: 0;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      height: 7.5svh;
      width: 100svw;
      padding-inline: 0;
      font-size: 0.75rem;
      padding-block: 0.5rem;
      padding-bottom: 1rem;
      h1 {
        display: none;
      }
      a {
        flex: 1;
        flex-direction: column;
        p {
          display: none;
        }
      }
      #profile {
        margin-block: auto;
      }
      #title {
        display: none;
      }
    }
  }
  h1 {
    font-size: 1.5rem;
    margin-block: 2rem;
    color: var(--text);
  }
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    margin-block: 1rem;
    background-color: transparent;
    font-weight: bold;
    padding-top: 0.5rem;
    gap: 1rem;
    transition: transform 0.2s;
    -webkit-tap-highlight-color: transparent; /* Disable tap highlight */

    p {
      margin-right: auto;
    }
  }

  a:active {
    transform: scale(0.9);
    background-color: transparent;
  }

  a:hover {
    transform: scale(1.1);
  }

  a:focus {
    background-color: transparent;
    outline: none; /* Remove focus outline */
  }

  .active {
    p {
      color: var(--accent);
      font-weight: bold;
    }
  }
  #profile {
    margin-top: auto;
    margin-bottom: 2rem;
  }

  #title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2.5rem;

    img {
      width: 3.5rem;
      height: 4rem;
    }
  }
</style>
