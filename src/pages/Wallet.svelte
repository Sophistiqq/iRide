<script lang="ts">
  import { logout } from "../lib/auth";
</script>

<div class="container">
  <h1>Wallet</h1>
  <button on:click={logout}>Logout</button>
</div>

<style lang="scss">
  .container {
    height: 92.5vh;
  }
</style>
