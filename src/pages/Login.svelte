<script lang="ts">
  import { link } from "svelte-spa-router";
  import { CircleUserRound, Eye, EyeOff, LockKeyhole } from "lucide-svelte";
  import { login } from "../lib/auth";
  import { onMount } from "svelte";
  let username = $state("");
  let password = $state("");
  let show_password = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const user = await login(username, password);
    console.log(user);
  }

  onMount(() => {
    // set timeout to prevent the page from flickering
    setTimeout(() => {}, 1000);
  });

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    passwordInput.type = show_password ? "password" : "text";
    show_password = !show_password;
  }
</script>

<div class="container">
  <h1>iPick</h1>
  <form class="login-form" onsubmit={handleSubmit}>
    <h3>Welcome</h3>
    <label for="username">Username</label>
    <div class="inputfield">
      <CircleUserRound size="20" />
      <input
        type="text"
        id="username"
        name="username"
        bind:value={username}
        required
        placeholder="Enter your username"
      />
    </div>
    <label for="password">Password</label>
    <div class="inputfield">
      <LockKeyhole size="20" />
      <input
        type="password"
        id="password"
        name="password"
        bind:value={password}
        required
        placeholder="Enter your password"
      />
      {#if show_password}
        <Eye size="20" onclick={() => togglePasswordVisibility()} />
      {:else}
        <EyeOff size="20" onclick={() => togglePasswordVisibility()} />
      {/if}
    </div>
    <a href="/forgot-password" id="forgot-password" use:link>
      Forgot Password?
    </a>
    <button id="submit" type="submit">Login</button>
    <div class="register-link">
      <p>or</p>
      <a href="/register" use:link>Register</a>
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

  .login-form {
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
  .register-link {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
      margin: 1rem;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: -50px;
        width: 40px;
        height: 1px;
        background-color: var(--border);
      }
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        right: -50px;
        width: 40px;
        height: 1px;
        background-color: var(--border);
      }
    }
    a {
      color: var(--primary);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  #forgot-password {
    align-self: flex-end;
    font-size: 0.8rem;
    margin-block: 1rem;
    color: var(--primary);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
