<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import { Home, Calendar, Wallet, Settings } from "lucide-svelte";

  $: activePage = $location;
</script>

<nav>
  <a href="/home" use:link class={activePage === "/home" ? "active" : ""}>
    <Home
      size="24"
      color={activePage === "/home" ? "var(--primary)" : "#333"}
    />
    <p>Home</p>
  </a>
  <a href="/history" use:link class={activePage === "/history" ? "active" : ""}>
    <Calendar
      size="24"
      color={activePage === "/history" ? "var(--primary)" : "#333"}
    />
    <p>History</p>
  </a>
  <a href="/wallet" use:link class={activePage === "/wallet" ? "active" : ""}>
    <Wallet
      size="24"
      color={activePage === "/wallet" ? "var(--primary)" : "#333"}
    />
    <p>Wallet</p>
  </a>
  <a
    href="/settings"
    use:link
    class={activePage === "/settings" ? "active" : ""}
  >
    <Settings
      size="24"
      color={activePage === "/settings" ? "var(--primary)" : "#333"}
    />
    <p>Settings</p>
  </a>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-around;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
    z-index: 100;
    height: 7.5vh;
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #333;
    background-color: transparent;
    font-size: 0.8rem;
    padding-top: 0.5rem;
    transition: transform 0.2s;
    user-select: none;
    -webkit-tap-highlight-color: transparent; /* Disable tap highlight */
  }

  a:active {
    transform: scale(0.8);
    background-color: transparent;
  }

  a:hover {
    background-color: transparent;
  }

  a:focus {
    background-color: transparent;
    outline: none; /* Remove focus outline */
  }

  .active {
    p {
      color: var(--primary);
      font-weight: bold;
    }
  }
</style>
