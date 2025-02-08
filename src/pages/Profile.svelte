<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../lib/auth";
  import Button from "../lib/components/ui/button/button.svelte";

  type User = {
    firstname: string;
    username: string;
    email: string;
    mobile_number: string;
    created_at: string;
    updated_at: string;
  };

  let user_data: User = {
    firstname: "",
    username: "",
    email: "",
    mobile_number: "",
    created_at: "",
    updated_at: "",
  };

  onMount(() => {
    getData();
  });

  async function getData() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const response = await fetch(
      `http://localhost:3000/page/user-data${user.username}`,
    );
    const data = await response.json();
    user_data = data.user;
    console.log(user_data);
  }
</script>

<div class="container">
  <h1>Settings</h1>
  <h1>Nyek</h1>
  <button on:click={logout}>Logout</button>
  <button on:click={getData}>Get Data</button>
  <p>{user_data.username}</p>
  <p>{user_data.email}</p>
  <p>{user_data.mobile_number}</p>
  <p>{user_data.created_at}</p>
  <p>{user_data.updated_at}</p>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 92.5vh;
  }
</style>
