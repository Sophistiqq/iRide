<script lang="ts">
  import { logout } from "../lib/auth";
  import Button from "../lib/components/ui/button/button.svelte";

  async function getData() {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    console.table(parsedUser);
    console.log(parsedUser.username);

    const response = await fetch(
      `http://localhost:3000/page/user-data${parsedUser.username}`,
    );
    const data = await response.json();
    console.log(data);
  }
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
