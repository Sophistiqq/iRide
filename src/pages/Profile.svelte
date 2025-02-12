<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../lib/auth";
  import { fly } from "svelte/transition";
  import { toast } from "../lib/Toast";
  type User = {
    fullname: string;
    username: string;
    email: string;
    mobile_number: string;
    created_at: string;
    updated_at: string;
  };

  let user_data: User = $state({
    fullname: "",
    username: "",
    email: "",
    mobile_number: "",
    created_at: "",
    updated_at: "",
  });

  onMount(() => {
    getData();
  });

  async function getData() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const response = await fetch(
      `http://192.168.1.31:3000/page/user-data${user.username}`,
    );
    const data = await response.json();
    user_data = data.user;
    console.log(user_data);
  }

  // Function to handle the password change request
  async function requestPasswordChange() {
    showModal = true;
  }

  let username = $state("");
  let old_password = $state("");
  let new_password = $state("");
  let confirm_password = $state("");

  async function submitPasswordChange(e: Event) {
    e.preventDefault();
    username = user_data.username;
    if (new_password !== confirm_password) {
      toast("Password does not match", 2000, "error");
      return;
    }

    console.log(username, old_password, new_password, confirm_password);
    const res = await fetch(
      "https://ipick-server.onrender.com/change-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          old_password,
          new_password,
        }),
      },
    );
    const data = await res.json();
    if (data.status === "success") {
      toast(data.message, 2000, data.status);
      showModal = false;
    } else {
      toast(data.message, 2000, data.status);
    }
  }

  let showModal = $state(false);
</script>

<div class="container">
  <h1>Settings</h1>

  <div class="information">
    <label for="fullname">Full Name</label>
    <input type="text" id="fullname" bind:value={user_data.fullname} readonly />

    <label for="username">Username</label>
    <input type="text" id="username" bind:value={user_data.username} readonly />
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={user_data.email} readonly />
    <label for="mobile_number">Mobile Number</label>
    <input
      type="text"
      id="mobile_number"
      bind:value={user_data.mobile_number}
      readonly
    />

    <button id="changepass" onclick={requestPasswordChange}
      >Request Password Change</button
    >

    <div class="logbutton">
      <button class="logout" onclick={logout}>Logout</button>
    </div>
  </div>
</div>

{#if showModal}
  <div class="modal" transition:fly>
    <form onsubmit={submitPasswordChange}>
      <h1>Change Password</h1>

      <div class="newpass">
        <label for="old-password">Old Password</label>
        <input
          type="password"
          id="old-password"
          placeholder="Enter your old password"
          bind:value={old_password}
        />

        <label for="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          placeholder="Enter new password"
          bind:value={new_password}
        />

        <label for="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm your new password"
          bind:value={confirm_password}
        />
      </div>

      <div class="buttons">
        <button type="button" class="cancel" onclick={() => (showModal = false)}
          >Cancel</button
        >
        <button type="submit" class="submit">Submit</button>
      </div>
    </form>
  </div>
{/if}

<style lang="scss">
  .logout {
    display: block;
    width: 100%;
    background-color: #f44336;
    color: white;
    border: none;
    padding: 0.6rem;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    margin-top: 1rem; /* Added gap between change password and logout */
  }

  .logout:hover {
    background-color: #e53935;
  }

  .container {
    width: 80%; /* Reduced width */
    height: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 0 auto; /* Centers the container horizontally */
    border: 1px solid #ccc; /* Border around the container */
    border-radius: 8px; /* Rounded corners for the border */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Optional shadow for better visual */
    background-color: #fff; /* White background */
  }

  .information {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    font-size: 0.9rem;
    color: #444;
    font-weight: bold;
  }

  #changepass {
    padding: 0.6rem 1.8rem;
    border-radius: 4px;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #changepass:hover {
    background-color: gray;
  }

  // MODAL STYLE
  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }

  input {
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    outline: none;
  }

  input:focus {
    border-color: #007bff;
  }

  form {
    background-color: var(--background);
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    color: #333;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #333;
  }

  .newpass {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  label {
    font-size: 1rem;
    color: #444;
  }

  input {
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    transition: border-color 0.3s ease;
    outline: none;
  }

  input:focus {
    border-color: #007bff;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    button {
      padding: 0.8rem 2.5rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  }

  .cancel {
    background-color: #f44336;
    color: white;
  }

  .cancel:hover {
    background-color: #e53935;
  }

  .submit {
    background-color: green;
    color: white;
  }

  .submit:hover {
    background-color: #0056b3;
  }
</style>
