<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../lib/auth";
  import { fly } from "svelte/transition";
  import { toast } from "../lib/Toast";
  import { CircleUserRound, Eye, EyeOff, LockKeyhole } from "lucide-svelte";
  import { API_URL } from "../lib/ServerAPI";
  const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;
  let show_password = $state(false);

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

  let show_new_password = $state(false);
  let show_confirm_password = $state(false);
  let show_old_password = $state(false);

  let ChangePasswordModal = $state(false); // For password change modal
  let EditProfileModal = $state(false); // For edit profile modal
  let editFullname = $state("");
  let editUsername = $state("");
  let editEmail = $state("");
  let editMobileNumber = $state("");

  function togglePasswordVisibility(
    field: "new_password" | "old_password" | "confirm_password",
  ) {
    const input = document.getElementById(field) as HTMLInputElement;
    if (field === "new_password") {
      input.type = show_new_password ? "password" : "text";
      show_new_password
        ? (show_new_password = false)
        : (show_new_password = true);
    } else if (field === "confirm_password") {
      input.type = show_confirm_password ? "password" : "text";
      show_confirm_password
        ? (show_confirm_password = false)
        : (show_confirm_password = true);
    } else if (field === "old_password") {
      input.type = show_old_password ? "password" : "text";
      show_old_password
        ? (show_old_password = false)
        : (show_old_password = true);
    }
  }

  async function getData() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const response = await fetch(
      `${SERVER_URL}/page/user-data${user.username}`,
    );
    const data = await response.json();
    user_data = data.user;
    console.log(user_data);
  }

  // Function to handle the password change request
  async function requestPasswordChange() {
    ChangePasswordModal = true;
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
    const res = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        old_password,
        new_password,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      toast(data.message, 2000, data.status);
      ChangePasswordModal = false;
    } else {
      toast(data.message, 2000, data.status);
    }
  }

  async function submitProfileEdit(e: Event) {
    e.preventDefault();
    user_data = {
      fullname: editFullname,
      username: editUsername,
      email: editEmail,
      mobile_number: editMobileNumber,
      created_at: user_data.created_at,
      updated_at: new Date().toISOString(),
    };

    EditProfileModal = true;
  }
</script>

<div class="container">
  <div class="profile">
    <h1>Settings</h1>

    <div class="information">
      <h1>{user_data.fullname}</h1>
      <p>{user_data.username}</p>
      <p>{user_data.email}</p>
      <p>{user_data.mobile_number}</p>

      <div class="changepassword">
        <button id="changepass" onclick={requestPasswordChange}
          >Change password</button
        >

        <button id="editprof" onclick={() => (EditProfileModal = true)}
          >Edit your profile</button
        >

        <div class="logout">
          <button class="logout" onclick={logout}>Logout</button>
        </div>
      </div>
    </div>
  </div>

  <div class="about">
    <h1>About us</h1>
  </div>
</div>

{#if ChangePasswordModal}
  <div class="modal" transition:fly>
    <form onsubmit={submitPasswordChange}>
      <h1>Change Password</h1>

      <div class="newpass">
        <label for="old_password">Old Password</label>
        <div class="inputfield">
          <LockKeyhole size="20" />
          <input
            type="password"
            id="old_password"
            placeholder="Enter your old password"
            bind:value={old_password}
          />
          {#if show_old_password}
            <Eye
              size="24"
              onclick={() => togglePasswordVisibility("old_password")}
            />
          {:else}
            <EyeOff
              size="24"
              onclick={() => togglePasswordVisibility("old_password")}
            />
          {/if}
        </div>

        <label for="new_password">New Password</label>
        <div class="inputfield">
          <LockKeyhole size="20" />
          <input
            type="password"
            id="new_password"
            placeholder="Enter new password"
            bind:value={new_password}
          />
          {#if show_new_password}
            <Eye
              size="24"
              onclick={() => togglePasswordVisibility("new_password")}
            />
          {:else}
            <EyeOff
              size="24"
              onclick={() => togglePasswordVisibility("new_password")}
            />
          {/if}
        </div>

        <label for="confirm_password">Confirm Password</label>
        <div class="inputfield">
          <LockKeyhole size="20" />
          <input
            type="password"
            id="confirm_password"
            placeholder="Confirm your new password"
            bind:value={confirm_password}
          />
          {#if show_confirm_password}
            <Eye
              size="24"
              onclick={() => togglePasswordVisibility("confirm_password")}
            />
          {:else}
            <EyeOff
              size="24"
              onclick={() => togglePasswordVisibility("confirm_password")}
            />
          {/if}
        </div>

        <div class="buttons">
          <button
            type="button"
            class="cancel"
            onclick={() => (ChangePasswordModal = false)}>Cancel</button
          >
          <button type="submit" class="submit">Submit</button>
        </div>
      </div>
    </form>
  </div>
{/if}

{#if EditProfileModal}
  <div class="modal" transition:fly>
    <form onsubmit={submitProfileEdit}>
      <h1>Edit Profile</h1>

      <div class="inputfield">
        <label for="fullname">Full Name</label>
        <input
          type="text"
          id="fullname"
          bind:value={editFullname}
          placeholder="Enter full name"
        />
      </div>

      <div class="inputfield">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          bind:value={editUsername}
          placeholder="Enter username"
        />
      </div>

      <div class="inputfield">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={editEmail}
          placeholder="Enter email"
        />
      </div>

      <div class="inputfield">
        <label for="mobile_number">Mobile Number</label>
        <input
          type="text"
          id="mobile_number"
          bind:value={editMobileNumber}
          placeholder="Enter mobile number"
        />
      </div>

      <div class="buttons">
        <button
          type="button"
          class="cancel"
          onclick={() => (EditProfileModal = false)}>Cancel</button
        >
        <button type="submit" class="submit">Save</button>
      </div>
    </form>
  </div>
{/if}

<style lang="scss">
  /* Profile Section */
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .information {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  .profile {
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #ddd; /* Border to separate profile */
    border-radius: 8px;
    background-color: #f9f9f9; /* Light background */
  }

  .profile h1 {
    font-size: 24px;
  }

  .about {
    padding: 20px;
    border: 1px solid #ddd; /* Border to separate about section */
    border-radius: 8px;
    background-color: #f9f9f9; /* Light background */
    margin-top: 20px;
  }

  .about h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  #changepass,
  #editprof {
    margin: 10px 0;
    padding: 0.8rem 1rem;
    border: none;
    border-radius: 5px;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    &:active {
      background-color: var(--primary-active);
    }

    &:hover {
      background-color: var(--primary);
      transform: scale(1.05); /* Slight scale effect for hover */
    }
  }

  #changepass {
    margin-right: 0.5rem;
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
    h1 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      text-align: center;
      color: #333;
    }
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

  .inputfield {
    display: flex;
    // border: 1px solid red;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
    padding-inline: 0.5rem;
    &:focus-within {
      border: 1px solid var(--accent);
      border-radius: 0.5rem;
    }
    input {
      margin: 0;
      width: 100%;
      border: none;
      background: transparent;
    }
  }

  .logout {
    background-color: #d32f2f; /* Red color for logout */
    color: white;
    padding: 0.3rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s ease-in-out;

    &:hover {
      background-color: #c62828; /* Darker red on hover */
      transform: scale(1.05); /* Slight scale effect for hover */
    }

    &.logout {
      display: flex;
      justify-content: center;
    }
  }
</style>
