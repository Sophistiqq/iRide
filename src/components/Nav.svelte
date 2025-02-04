<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import { Home, Calendar, Wallet, Settings } from "lucide-svelte";

  $: activePage = $location;
</script>

<nav>
  <h1>iTrack</h1>
  <a href="/home" use:link class={activePage === "/home" ? "active" : ""}>
    <Home size="24" color={activePage === "/home" ? "var(--accent)" : "#333"} />
    <p>Home</p>
  </a>
  <a href="/history" use:link class={activePage === "/history" ? "active" : ""}>
    <Calendar
      size="24"
      color={activePage === "/history" ? "var(--accent)" : "#333"}
    />
    <p>History</p>
  </a>
  <a href="/wallet" use:link class={activePage === "/wallet" ? "active" : ""}>
    <Wallet
      size="24"
      color={activePage === "/wallet" ? "var(--accent)" : "#333"}
    />
    <p>Wallet</p>
  </a>
  <a
    href="/settings"
    use:link
    class={activePage === "/settings" ? "active" : ""}
    id="settings"
  >
    <Settings
      size="24"
      color={activePage === "/settings" ? "var(--accent)" : "#333"}
    />
    <p>Settings</p>
  </a>
</nav>

<style>
  nav {
    display: flex;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
    z-index: 100;
    min-width: 15vw;
    flex-direction: column;
    border: 1px solid green;
    padding-inline: 1.5rem;
    height: 100vh;
  }

  @media (max-width: 458px) {
    nav {
      width: 50vw;
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
    padding-top: 0.5rem;
    gap: 1rem;
    transition: transform 0.2s;
    user-select: none;
    -webkit-tap-highlight-color: transparent; /* Disable tap highlight */
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
  #settings {
    margin-top: auto;
    margin-bottom: 2rem;
  }
</style>
