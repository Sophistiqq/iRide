<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import {
    Home,
    Calendar,
    Bus,
    CircleUserRound,
    ChevronRight,
  } from "lucide-svelte";

  $: activePage = $location;
</script>

<nav>
  <h1>iTrack</h1>
  <a href="/home" use:link class={activePage === "/home" ? "active" : ""}>
    <Home size="24" color={activePage === "/home" ? "var(--accent)" : "#333"} />
    <p>Home</p>
    <ChevronRight size="24" color="rgba(0,0,0,0.3)" />
  </a>
  <a href="/history" use:link class={activePage === "/history" ? "active" : ""}>
    <Calendar
      size="24"
      color={activePage === "/history" ? "var(--accent)" : "#333"}
    />
    <p>History</p>
    <ChevronRight size="24" color="rgba(0,0,0,0.3)" />
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
    <ChevronRight size="24" color="rgba(0,0,0,0.3)" />
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
    <ChevronRight size="24" color="rgba(0,0,0,0.3)" />
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
    height: 100vh;
  }

  @media (max-width: 768px) {
    nav {
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      height: 7.5svh;
      width: 100vw;
      padding-inline: 0;
      h1 {
        display: none;
      }
      a {
        flex-direction: column;
        gap: 0;
      }
      #profile {
        margin-block: auto;
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
    user-select: none;
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
</style>
