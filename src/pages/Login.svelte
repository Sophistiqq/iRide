<script lang="ts">
  import {
    CircleUserRound,
    Eye,
    EyeOff,
    Loader,
    LockKeyhole,
  } from "lucide-svelte";
  import { login } from "../lib/auth";
  import { onMount } from "svelte";
  import { toast } from "../lib/Toast";
  let SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

  let username = $state("");
  let password = $state("");
  let show_password = $state(false);
  let loading = $state(false);
  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    try {
      const user: any = await login(username, password);
      console.log(user);
      if (user.status === "success") {
        toast(user.message, 2000, "success");
      } else {
        toast(user.message, 2000, "error");
      }
    } catch (error) {
      toast("An error occurred during login", 2000, "error");
    } finally {
      loading = false;
    }
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

  let forgot_password_modal = $state(false);
  let email = $state("");
  let step = $state(1);
  let forgot_password_new = $state("");
  let forgot_password_confirm = $state("");

  async function submitForgotPassword(e: SubmitEvent) {
    e.preventDefault();

    if (forgot_password_new !== forgot_password_confirm) {
      toast("Passwords do not match", 2000, "error");
      return;
    }
    try {
      const res = await fetch(`${SERVER_URL}/forgot-password/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: forgot_password_new }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast(data.message, 2000, "success");
        forgot_password_modal = false;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast(error.message, 2000, "error");
    }
  }

  async function submitEmail() {
    try {
      const res = await fetch(`${SERVER_URL}/forgot-password/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast(data.message, 2000, "success");
        step = 2;
        await fetch(`${SERVER_URL}/forgot-password/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast(error.message, 2000, "error");
    }
  }

  let otp = $state("");
  async function verifyOTP() {
    try {
      const res = await fetch(`${SERVER_URL}/forgot-password/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast(data.message, 2000, "success");
        step = 3;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast(error.message, 2000, "error");
    }
  }
</script>

<div class="container">
  <form class="login-form" onsubmit={handleSubmit}>
    <h1>iTrack</h1>
    <h3>Admin Login</h3>
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
    <button
      id="forgot-password"
      type="button"
      onclick={() => (forgot_password_modal = true)}
    >
      Forgot Password?
    </button>
    <button id="submit" type="submit">
      {#if loading}
        <Loader size="12" color="white" />
      {:else}
        Login
      {/if}
    </button>
  </form>
</div>

{#if forgot_password_modal}
  <div class="modal">
    <form class="modal-content" onsubmit={submitForgotPassword}>
      <button class="close" onclick={() => (forgot_password_modal = false)}>
        &times;
      </button>
      {#if step === 1}
        <h3>Forgot Password</h3>
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          bind:value={email}
          placeholder="Enter your email"
        />
        <button type="button" onclick={() => submitEmail()}>Next</button>
      {:else if step === 2}
        <h3>Forgot Password</h3>
        <label for="otp">Open {email} inbox to see the OTP</label>
        <input
          type="text"
          id="otp"
          name="otp"
          required
          bind:value={otp}
          placeholder="Enter the OTP sent to your email"
        />
        <button type="button" onclick={() => verifyOTP()}>Next</button>
      {:else if step === 3}
        <h3>Forgot Password</h3>
        <label for="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          required
          bind:value={forgot_password_new}
          placeholder="Enter your new password"
        />
        <label for="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
          bind:value={forgot_password_confirm}
          placeholder="Confirm your new password"
        />
        <button type="submit">Submit</button>
      {:else}
        <h3>Forgot Password</h3>
        <p>An error occurred</p>
        <button type="button" onclick={() => (step = 1)}>Retry</button>
      {/if}
      {#if step !== 1}
        <button type="button" onclick={() => (step -= 1)}>Back</button>
      {/if}
    </form>
  </div>
{/if}

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100svh;
    width: 100vw;
    gap: 1rem;
    padding-inline: 1rem;
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
      margin-block: 2rem;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    height: 100%;
    min-width: 40vw;
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

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      align-items: center;
      width: 100vw;
    }
    .login-form {
      min-width: 80vw;
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
  #forgot-password {
    align-self: flex-end;
    font-size: 0.8rem;
    margin-block: 1rem;
    color: var(--primary);
    background-color: transparent;
    &:hover {
      text-decoration: underline;
    }
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    background-color: var(--background);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 5px;
    width: 40vw;
    position: relative;

    input {
      padding: 0.5rem;
      border: none;
      background-color: var(--background);
      width: 100%;
      border-bottom: 1px solid var(--border);
      &:focus {
        outline: none;
      }
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

    .close {
      align-self: flex-end;
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 2rem;
      color: var(--primary);
      position: absolute;
      right: 1rem;
      top: 1rem;
      &:hover {
        color: var(--primary-active);
      }
    }
  }
</style>
