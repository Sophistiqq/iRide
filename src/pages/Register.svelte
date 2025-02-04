<script lang="ts">
  import { link } from "svelte-spa-router";
  import { register } from "../lib/auth";
  import {
    CircleUserRound,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
  } from "lucide-svelte";
  import { fly } from "svelte/transition";

  let username = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let show_password = $state(false);
  let show_confirm_password = $state(false);
  let mobile_number = $state("");
  let fullname = $state("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    register(username, password, fullname, mobile_number, email);
  };

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

<div class="container" transition:fly>
  <h1>iPick</h1>
  <form class="register-form" onsubmit={handleSubmit}>
    <h3>Create Account</h3>
    <label for="username">Username</label>
    <div class="inputfield">
      <CircleUserRound size="18" />
      <input
        type="text"
        id="username"
        name="username"
        bind:value={username}
        required
        placeholder="e.g. john_rodnie"
      />
    </div>
    <label for="fullname">Full Name</label>
    <div class="inputfield">
      <CircleUserRound size="18" />
      <input
        type="text"
        id="fullname"
        name="fullname"
        bind:value={fullname}
        required
        placeholder="e.g. John Rodnie"
      />
    </div>
    <label for="email">Email</label>
    <div class="inputfield">
      <Mail size="18" />
      <input
        type="email"
        id="email"
        name="email"
        bind:value={email}
        required
        placeholder="e.g. jrodnie@email.com"
      />
    </div>
    <label for="phone">Mobile Number</label>
    <div class="inputfield">
      <Phone size="18" />
      <input
        type="tel"
        id="phone"
        name="phone"
        required
        bind:value={mobile_number}
        placeholder="e.g. 09913314402"
      />
    </div>

    <label for="password">Password</label>
    <div class="inputfield">
      <LockKeyhole size="18" />
      <input
        type="password"
        id="password"
        name="password"
        bind:value={password}
        required
        placeholder="e.g. password123"
      />
      {#if show_password}
        <Eye size="18" on:click={() => togglePasswordVisibility("password")} />
      {:else}
        <EyeOff
          size="18"
          on:click={() => togglePasswordVisibility("password")}
        />
      {/if}
    </div>
    <label for="confirmPassword">Confirm Password</label>
    <div class="inputfield">
      <LockKeyhole size="18" />
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        bind:value={confirmPassword}
        required
        placeholder="e.g. password123"
      />
      {#if show_confirm_password}
        <Eye
          size="18"
          on:click={() => togglePasswordVisibility("confirmPassword")}
        />
      {:else}
        <EyeOff
          size="18"
          on:click={() => togglePasswordVisibility("confirmPassword")}
        />
      {/if}
    </div>
    <button id="submit" type="submit">Register</button>
    <div class="login-link">
      <p>Already have an account?</p>
      <a href="/" use:link>Login</a>
    </div>
  </form>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100svh;
    gap: 1.5rem;
    h1 {
      font-size: 4rem;
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
    }
  }

  .register-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    width: 75vw;
    box-shadow: 0 0 10px rgba(50, 50, 50, 0.2);
    border-radius: 5px;
    h3 {
      margin-bottom: 1.5rem;
    }
    label {
      font-size: 0.8rem;
    }
    button {
      padding: 0.5rem;
      margin-top: 1rem;
      border: none;
      background-color: var(--primary);
      color: white;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      &:active {
        background-color: var(--primary-active);
      }
    }
  }

  .inputfield {
    display: flex;
    align-items: center;
    padding-inline: 0.5rem;
    border-bottom: 1px solid var(--border);
    transition: border 0.5s;
    margin-block: 0.5rem;
  }

  input {
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
      margin: 1rem;
    }
    a {
      color: var(--primary);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
