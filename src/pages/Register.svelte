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
    alert(field);
    const input = document.getElementById(field) as HTMLInputElement;
    if (field === "password") {
      input.type = show_password ? "password" : "text";
      show_password ? (show_password = false) : (show_password = true);
    } else {
      input.type = show_confirm_password ? "password" : "text";
      show_confirm_password
        ? (show_confirm_password = false)
        : (show_confirm_password = true);
    }
  }
</script>

<div class="container">
  <form class="register-form" onsubmit={handleSubmit}>
    <h1>iTrack</h1>
    <h3>Create Account</h3>
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
      <label for="fullname">Full Name</label>
      <div class="inputfield">
        <CircleUserRound size="18" />
        <input
          type="text"
          id="fullname"
          name="fullname"
          bind:value={fullname}
          required
          placeholder="e.g. Juan Dela Cruz"
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
      <label for="phone">Mobile Number</label>
      <div class="inputfield">
        <Phone size="18" />
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          bind:value={mobile_number}
          placeholder="e.g. 09123456789"
        />
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
        {#if show_password}
          <Eye size="18" onclick={() => togglePasswordVisibility("password")} />
        {:else}
          <EyeOff
            size="18"
            onclick={() => togglePasswordVisibility("password")}
          />
        {/if}
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
        {#if show_confirm_password}
          <Eye
            size="18"
            onclick={() => togglePasswordVisibility("confirmPassword")}
          />
        {:else}
          <EyeOff
            size="18"
            onclick={() => togglePasswordVisibility("confirmPassword")}
          />
        {/if}
      </div>
    </div>
    <div class="controls">
      <button id="submit" type="submit">Register</button>
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
    justify-content: space-around;
    height: 100svh;
    width: 100vw;
    gap: 1.5rem;
  }

  .register-form {
    display: grid;
    gap: 0rem 2rem;
    grid-template-columns: 1fr 1fr;
    padding: 6rem;
    min-width: 30vw;
    height: 100%;
    box-shadow: 0 0 10px rgba(50, 50, 50, 0.2);
    border-radius: 5px;

    & h1 {
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
    button {
      padding: 0.5rem;
      border: none;
      background-color: var(--primary);
      color: white;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 1.5rem;
      &:active {
        background-color: var(--primary-active);
      }
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      align-items: center;
      width: 100vw;
    }
    .register-form {
      grid-template-columns: 1fr;
      width: 80vw;
      padding: 2rem;
      gap: 0rem;
      h3 {
        margin-bottom: 1rem;
      }
      button {
        padding: 0.5rem 2rem;
      }
    }
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .inputfield {
    display: flex;
    align-items: center;
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
  .controls {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      padding: 0.5rem 2rem;
    }
    gap: 1rem;
  }
</style>
