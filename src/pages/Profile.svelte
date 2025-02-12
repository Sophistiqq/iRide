<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../lib/auth";
  import Button from "../lib/components/ui/button/button.svelte";
  import { fly } from "svelte/transition";
  type User = {
    fullname: string;
    username: string;
    email: string;
    mobile_number: string;
    created_at: string;
    updated_at: string;
  };

  let user_data: User = {
    fullname: "",
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
      `http://192.168.1.31:3000/page/user-data${user.username}`,
    );
    const data = await response.json();
    user_data = data.user;
    console.log(user_data);
  }

  // Function to handle the password change request
  async function requestPasswordChange() {
    // const user = JSON.parse(localStorage.getItem("user") || "{}");

    // // Send request to admin (or backend system) to initiate password change
    // const response = await fetch(
    //   "http://192.168.1.31:3000/request-password-change",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       username: user.username,
    //       message: "Request for password change",
    //     }),
    //   },
    // );

    // const data = await response.json();

    // if (data.success) {
    //   alert("Password change request sent to the admin successfully.");
    // } else {
    //   alert("Failed to send password change request.");
    // }

    showModal = true;
  }

  let showModal = false;
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

      <button id="changepass" onclick={requestPasswordChange}>Request Password Change</button>


    <div class="logbutton">
      <button class="logout" onclick={logout}>Logout</button>
    </div>
  </div>
</div>

{#if showModal}
  <div class="modal" transition:fly>
    <form>
      <h1>Change Password</h1>
      

      <div class="newpass">

        <label for="old-password">Old Password</label>
        <input
          type="password"
          id="old-password"
          placeholder="Enter your old password"
        />

        <label for="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          placeholder="Enter new password"
        />

        <label for="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm your new password"
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
    padding: 0.8rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin-bottom: 2rem;
  }

  .logout:hover {
    background-color: #e53935;
  }

  .container {
    width: 100%;
    height: 92.5vh;
  }

  .information {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 1rem;
    color: #444;
    font-weight: bold;
  }

  #changepass {
    padding: 0.8rem 2rem;
    border-radius: 5px;
    font-size: 1rem;
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
    border-color: #007BFF;
  }

  .button {
    display: flex;
    justify-content: center;
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
