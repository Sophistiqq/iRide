<script lang="ts">
  import { link } from "svelte-spa-router";
  import { register } from "../lib/auth";
  import {
    CircleUserRound,
    Eye,
    EyeOff,
    Loader,
    LockKeyhole,
    Mail,
    Phone,
    Home,
    User,
    RefreshCw,
  } from "lucide-svelte";
  import { toast } from "../lib/Toast";

  let username = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let show_password = $state(false);
  let show_confirm_password = $state(false);
  let phone = $state("");
  let name = $state("");
  let address = $state("");
  let account_type = $state("Individual"); // Default value
  let avatarId = $state(1);
  let loading = $state(false);

  const avatarUrl = () => `https://avatar.iran.liara.run/public/${avatarId}`;

  function nextAvatar() {
    avatarId = avatarId >= 10 ? 1 : avatarId + 1;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;

    try {
      if (password !== confirmPassword) {
        toast("Passwords do not match", 2000, "error");
        return;
      }

      // Create user object with avatar URL instead of file
      const userData = {
        name,
        username,
        email,
        password,
        phone,
        avatar: avatarUrl(), // Just use the URL
        address,
        account_type,
        subscription: {
          type: "none",
          status: "none",
          start_date: new Date().toISOString(),
          expires_at: new Date().toISOString(),
          device_allowed: 0,
        },
      };

      console.log("User data:", userData);

      // Call register with user data
      let user: any = await register(userData);

      if (user !== null) {
        toast(user.message, 2000, user.status);
        if (user.status === "success") {
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } else {
        toast("An error occurred during registration", 2000, "error");
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
      toast("An error occurred during registration", 2000, "error");
    } finally {
      loading = false;
    }
  }

  function togglePasswordVisibility(field: "password" | "confirmPassword") {
    const input = document.getElementById(field) as HTMLInputElement;
    if (field === "password") {
      input.type = show_password ? "password" : "text";
      show_password = !show_password;
    } else {
      input.type = show_confirm_password ? "password" : "text";
      show_confirm_password = !show_confirm_password;
    }
  }
</script>

<div class="container">
  <div class="avatar-section">
    <h2>Choose Avatar</h2>
    <div class="avatar-container">
      <img src={avatarUrl()} alt="User Avatar" class="avatar-preview" />
      <button type="button" class="avatar-button" onclick={nextAvatar}>
        <RefreshCw size="18" />
        <span>Try Another</span>
      </button>
    </div>
  </div>

  <form class="register-form" onsubmit={handleSubmit}>
    <h1>iTrack</h1>
    <h3>Create Account</h3>

    <div class="input-container">
      <label for="name">Full Name</label>
      <div class="inputfield">
        <User size="18" />
        <input
          type="text"
          id="name"
          name="name"
          bind:value={name}
          required
          placeholder="e.g. Juan Dela Cruz"
        />
      </div>
    </div>

    <div class="input-container">
      <label for="username">Username</label>
      <div class="inputfield">
        <CircleUserRound size="18" />
        <input
          type="text"
          id="username"
          name="username"
          bind:value={username}
          required
          placeholder="e.g. Juan_DelaCruz"
        />
      </div>
    </div>

    <div class="input-container">
      <label for="email">Email</label>
      <div class="inputfield">
        <Mail size="18" />
        <input
          type="email"
          id="email"
          name="email"
          bind:value={email}
          required
          placeholder="e.g. juandelacuz@gmail.com"
        />
      </div>
    </div>

    <div class="input-container">
      <label for="phone">Phone Number</label>
      <div class="inputfield">
        <Phone size="18" />
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          bind:value={phone}
          placeholder="e.g. 09123456789"
        />
      </div>
    </div>

    <div class="input-container">
      <label for="address">Address</label>
      <div class="inputfield">
        <Home size="18" />
        <input
          type="text"
          id="address"
          name="address"
          bind:value={address}
          required
          placeholder="e.g. 123 Main St, City"
        />
      </div>
    </div>

    <div class="input-container">
      <label for="account_type">Account Type</label>
      <div class="inputfield select-field">
        <User size="18" />
        <select
          id="account_type"
          name="account_type"
          bind:value={account_type}
          required
        >
          <option value="Individual">Individual</option>
          <option value="Company">Company</option>
        </select>
      </div>
    </div>

    <div class="input-container">
      <label for="password">Password</label>
      <div class="inputfield">
        <LockKeyhole size="18" />
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          required
          placeholder=""
        />
        <button
          type="button"
          class="toggle-password"
          onclick={() => togglePasswordVisibility("password")}
        >
          {#if show_password}
            <Eye size="18" />
          {:else}
            <EyeOff size="18" />
          {/if}
        </button>
      </div>
    </div>

    <div class="input-container">
      <label for="confirmPassword">Confirm Password</label>
      <div class="inputfield">
        <LockKeyhole size="18" />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          bind:value={confirmPassword}
          required
          placeholder=""
        />
        <button
          type="button"
          class="toggle-password"
          onclick={() => togglePasswordVisibility("confirmPassword")}
        >
          {#if show_confirm_password}
            <Eye size="18" />
          {:else}
            <EyeOff size="18" />
          {/if}
        </button>
      </div>
    </div>

    <div class="controls">
      <button id="submit" type="submit">
        {#if loading}
          <Loader size="18" />
        {:else}
          Register
        {/if}
      </button>
      <div class="login-link">
        <p>Already have an account?</p>
        <a href="/" use:link>Login</a>
      </div>
    </div>
  </form>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    height: 100svh;
    width: 100%;
    gap: 2rem;
    padding: 2rem;
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: var(--background-alt);
    border-radius: 10px;
    margin-top: 6rem;
  }

  .avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .avatar-preview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 3px solid var(--primary);
    object-fit: cover;
  }

  .avatar-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .avatar-button:hover {
    background-color: var(--primary-hover);
  }

  .toggle-password {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .register-form {
    display: grid;
    gap: 0rem 2rem;
    grid-template-columns: 1fr 1fr;
    padding: 2rem;
    min-width: 30vw;
    max-width: 800px;
    background-color: var(--background);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    & h1 {
      grid-column: 1 / -1;
      font-size: 3.5em;
      font-weight: bold;
      background: linear-gradient(
        to right,
        var(--primary) 20%,
        var(--secondary) 30%,
        var(--accent) 70%
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 500% auto;
      animation: textShine 4s cubic-bezier(0.6, 0.04, 0.98, 0.335) infinite
        alternate;
      margin-bottom: 1rem;
    }

    h3 {
      grid-column: 1 / -1;
      margin-bottom: 1.5rem;
    }

    label {
      font-size: 1rem;
    }

    button[type="submit"] {
      padding: 0.5rem 2rem;
      border: none;
      background-color: var(--primary);
      color: white;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      max-width: 200px;

      &:hover {
        background-color: var(--primary-hover);
      }

      &:active {
        background-color: var(--primary-active);
      }
    }
  }

  .select-field select {
    width: 100%;
    padding: 0.5rem;
    border: none;
    background-color: var(--background);
    appearance: none;

    &:focus {
      outline: none;
    }
  }

  @media (max-width: 992px) {
    .container {
      flex-direction: column;
      align-items: center;
      height: auto;
      padding: 1rem;
    }

    .avatar-section {
      margin-top: 1rem;
      width: 100%;
      max-width: 800px;
    }

    .register-form {
      grid-template-columns: 1fr 1fr;
      width: 100%;
      max-width: 800px;
    }
  }

  @media (max-width: 768px) {
    .register-form {
      grid-template-columns: 1fr;
    }
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .inputfield {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border);
    transition: border 0.5s;
    padding: 0.25rem 0;
  }

  input,
  select {
    padding: 0.5rem;
    border: none;
    background-color: var(--background);
    width: 100%;
    &:focus {
      outline: none;
    }
  }

  .inputfield:focus-within {
    border-bottom: 1px solid var(--primary);
  }

  @keyframes textShine {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  .login-link {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
      margin: 1rem 0 0.25rem;
    }
    a {
      color: var(--primary);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .controls {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }
</style>
