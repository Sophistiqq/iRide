<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../lib/auth";
  import { fly, slide } from "svelte/transition";
  import { toast } from "../lib/Toast";
  import {
    CircleUserRound,
    Eye,
    EyeOff,
    LockKeyhole,
    Settings,
    X,
  } from "lucide-svelte";
  import Avatarimage from "../assets/man.png";
  const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;
  let show_password = $state(false);
  let { onClose } = $props();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  });
  const default_avatar = "https://avatar.iran.liara.run/public/";
  let src: any = $state(default_avatar);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

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

  let SettingsDropdown = $state(false); // Dropdown visibility state

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
    const res = await fetch(`${SERVER_URL}/change-password`, {
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
    <div class="information">
      <div class="avatar">
        <img {src} alt="User Avatar" class="avatar-img" />
      </div>

      <h1>{user_data.fullname}</h1>
      <p>{user_data.username}</p>

      <div class="profile2">
        <p>{user_data.email}</p>
        <p>|</p>
        <p>{user_data.mobile_number}</p>
      </div>
    </div>
  </div>

  <div class="about">
    <h1>About us</h1>
  </div>
</div>

<!-- Dropdown Menu -->
<div class="settings">
  <button
    class="settingsbutton"
    onclick={() => (SettingsDropdown = !SettingsDropdown)}><Settings /></button
  >
  {#if SettingsDropdown}
    <div class="settings-container visible" transition:slide={{ axis: "y" }}>
      <button id="changepass" onclick={requestPasswordChange}
        >Change Password</button
      >
      <button id="editprof" onclick={() => (EditProfileModal = true)}
        >Edit Profile</button
      >
      <button id="logout" onclick={logout}>Logout</button>
    </div>
  {/if}
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
    <div class="modalcontents">
      <div class="avatar-picker">
        <img {src} alt="User Avatar" />
        <input
          type="file"
          accept="image/*"
          id="filepicker"
          placeholder="Choose an image"
          onchange={handleFileChange}
          style="display: none;"
        />

        <button
          type="button"
          id="avatar"
          onclick={() => document.getElementById("filepicker")?.click()}
          >Select a new picture?</button
        >
      </div>

      <form class="form1" onsubmit={submitProfileEdit}>
        <label for="fullname">Full Name</label>
        <div class="inputfield2">
          <input
            type="text"
            id="fullname"
            bind:value={editFullname}
            placeholder="Enter fullname"
          />
        </div>

        <label for="username">Username</label>
        <div class="inputfield2">
          <input
            type="text"
            id="username"
            bind:value={editUsername}
            placeholder="Enter username"
          />
        </div>

        <label for="email">Email</label>
        <div class="inputfield2">
          <input
            type="email"
            id="email"
            bind:value={editEmail}
            placeholder="Enter email"
          />
        </div>

        <label for="mobile_number">Mobile Number</label>
        <div class="inputfield2">
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
            onclick={() => (EditProfileModal = false)}
          >
            Cancel
          </button>
          <button type="submit" class="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f7f7f7;
  }

  .container .information p {
    margin-top: -1rem;
    margin-bottom: 1rem;
  }

  .profile,
  .about {
    padding: 1.5rem;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .avatar-img {
    margin-top: 2rem;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .avatar-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 2rem;
    img {
      width: fit-content;
      border-radius: 50%;
      aspect-ratio: 1/1;
      margin-bottom: 1rem;
    }

    #avatar {
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      background-color: transparent;
      transition: background-color 0.3s;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .profile {
    border: 1px solid #ddd;
    height: 70%;
  }

  .profile2 {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .about {
    border-top: 1px solid #ddd;
  }

  .profile h1,
  .about h1 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
  }

  .information {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    color: #333;
    font-size: 22px;
  }

  p {
    color: #666;
    font-size: 16px;
  }

  .about {
    padding: 20px;
    height: 50%;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-top: 20px;
    height: 50%;
  }

  .about h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

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

  .modalcontents {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background);
    border-radius: var(--border-radius);
    padding: 3rem;
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
    border-color: var(--primary);
  }

  form {
    background-color: var(--background);
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    flex-direction: column;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    color: #333;
    display: flex;
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

  .inputfield2 {
    display: flex;
    border-bottom: 1px solid var(--border);
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

  .modal label {
    margin-bottom: -0.9rem;
  }

  .settings {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
  }

  .settingsbutton {
    margin: 0.5rem;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:active {
      background-color: var(--primary);
      transform: scale(1.1) rotate(180deg); /* Slight rotation effect */
    }
  }

  .settingsbutton:focus {
    background: var(--primary);
  }

  .settings-container {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 220px;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition:
      opacity 0.3s ease,
      max-height 0.3s ease;
    &.visible {
      opacity: 1;
      max-height: 500px; /* Dropdown expands */
    }
  }

  .settings-container button {
    padding: 12px;
    font-size: 1.1rem;
    font-weight: 500;
    background-color: transparent;
    color: #444;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: var(--primary-light);
      color: var(--primary);
      transform: translateX(8px);
    }
    &:active {
      background-color: var(--primary-active);
    }
  }

  #logout {
    background-color: #d32f2f; /* Red color for logout */
    color: white;
    padding: rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s ease-in-out;
  }

  .settings-container button:focus {
    outline: none;
    box-shadow: 0 0 4px 2px rgba(0, 123, 255, 0.6); /* Blue outline */
  }

  @media (max-width: 768px) {
    .modalcontents {
      flex-direction: column;
    }
  }
</style>
