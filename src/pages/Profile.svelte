<script lang="ts">
  import { logout } from "../lib/auth";
  import Button from "../lib/components/ui/button/button.svelte";
</script>

<div class="container">
  <h1>Settings</h1>
  <h1>Nyek</h1>
  <Button variant="outline">Logout</Button>
  <button on:click={logout}>Logout</button>
</div>

<style lang="scss">
  .container {
    height: 92.5vh;
  }
</style>
