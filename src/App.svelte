<script lang="ts">
  import "./app.css";
  import Router, { push } from "svelte-spa-router";
  import Register from "./pages/Register.svelte";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import History from "./pages/History.svelte";
  import UnitManagement from "./pages/UnitManagement.svelte";
  import Profile from "./pages/Profile.svelte";
  import { onMount } from "svelte";
  import { location } from "svelte-spa-router";
  import { checkAuth, authStore } from "./lib/auth";
  import { Loader } from "lucide-svelte";
  import Nav from "./components/Nav.svelte";
  const routes = {
    "/": Login,
    "/register": Register,
    //"/home": Home,
    "/history": History,
    "/unit-management": UnitManagement,
    "/profile": Profile,
    "/home": Home,
  };

  // Subscribe to route changes
  $: {
    const path = $location;
    if ($authStore.isInitialized) {
      if (
        $authStore.isAuthenticated &&
        (path === "/" || path === "/login" || path === "/register")
      ) {
        push("/home");
      } else if (!$authStore.isAuthenticated && path === "/home") {
        push("/");
      }
    }
  }

  onMount(async () => {
    await checkAuth(true);
  });
</script>

{#if !$authStore.isInitialized}
  <div class="loading-container">
    <Loader size={40} />
  </div>
{:else}
  <div class="container">
    {#if $authStore.isAuthenticated}
      <Nav />
    {/if}
    <Router {routes} />
  </div>
{/if}

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    width: 100vw;
    max-width: 100vw;
    gap: 0.5rem;
    height: 100svh;
  }
  .loading-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column-reverse;
    }
  }
</style>
