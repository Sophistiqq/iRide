<script lang="ts">
  import { onMount } from "svelte";
  onMount(() => {
    getData();
  });

  async function getData() {
    const response = await fetch("http://localhost:3000/page/unit-management");
    const data = await response.json();
    console.log(data);
  }
</script>

<div class="container">
  <h1>Manage Units</h1>
  <p>Manage units and their account settings here.</p>

  <div class="table-wrapper">
    <div class="table-header">
      <h2>All units</h2>
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    height: 100vh;
    width: 100%;
  }

  @media (max-width: 768px) {
    .container {
      height: 92.5vh;
    }
  }
</style>
