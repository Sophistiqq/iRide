<script lang="ts">
  import { Building2, Mail, X, Settings2 } from "lucide-svelte";
  import { toast } from "../../lib/Toast";
  import { onMount } from "svelte";
  let { onClose, selected_company } = $props();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  });
  const default_avatar = "https://avatar.iran.liara.run/public/";
  let src: any = $state(default_avatar);

  onMount(() => {
    console.log(selected_company);
    if (selected_company) {
      account_data = {
        company_name: selected_company.name,
        account_type: selected_company.account_type,
        password: selected_company.password,
        confirm_password: selected_company.password,
        email: selected_company.email,
        otp: "",
      };
      src = selected_company.avatar;
    }
  });

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

  let account_data = $state({
    company_name: "",
    account_type: "individual",
    password: "",
    confirm_password: "",
    email: "",
    otp: "",
  });

  async function resetForm() {
    src = default_avatar;
    account_data = {
      company_name: "",
      account_type: "individual",
      password: "",
      confirm_password: "",
      email: "",
      otp: "",
    };
    const fileInput = document.getElementById("avatar") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function submitAccount(e: Event) {
    e.preventDefault();
    if (account_data.password !== account_data.confirm_password) {
      toast("Passwords do not match", 3000, "error");
      return;
    }
  }
</script>

<div class="container">
  <div class="modal-header">
    <h2>Edit an Account</h2>
    <button onclick={onClose}><X /></button>
  </div>
  <form onsubmit={submitAccount}>
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
    <div class="input-container">
      <div class="form-header">
        <h3>Account Information</h3>
      </div>
      <div class="inputfields">
        <div class="input-container">
          <label for="company_name">Company Name</label>
          <div class="inputfield">
            <Building2 size="24" />
            <input
              type="text"
              id="company_name"
              name="company_name"
              bind:value={account_data.company_name}
              required
              placeholder="Enter Company Name"
            />
          </div>
        </div>

        <div class="input-container">
          <label for="account_type">Account Type</label>
          <div class="inputfield">
            <Settings2 size="24" />
            <select
              name="account_type"
              id="account_type"
              bind:value={account_data.account_type}
            >
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
          </div>
        </div>

        <div class="input-container" id="email-input">
          <label for="email">Email</label>
          <div class="inputfield">
            <Mail size="24" />
            <input
              type="email"
              id="email"
              name="email"
              bind:value={account_data.email}
              required
              placeholder="Enter Email"
            />
          </div>
        </div>

        <div class="input-container change-password">
          <button type="button" onclick={() => resetForm()}
            >Change Password</button
          >
        </div>

        <div class="input-container submit">
          <button type="submit">Add Account</button>
        </div>
      </div>
    </div>
  </form>
</div>

<style lang="scss">
  .container {
    width: 70vw;
    height: max-content;
    background-color: var(--background);
    border-radius: var(--border-radius);
    padding: 1rem;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);

    button {
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  }

  form {
    display: flex;
    height: 60%;
    flex-direction: row;
    justify-content: space-around;
    gap: 1rem;
    align-items: center;
  }

  .form-header {
    width: 100%;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .avatar-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 400px;
    img {
      width: 25vw;
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

  .inputfields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;
    .input-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }
    .inputfield {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--border);
      &:focus-within {
        border-bottom: 1px solid var(--primary);
      }
      input {
        border: none;
        padding: 0.5rem;
        width: 100%;
        background-color: transparent;

        &:focus {
          outline: none;
        }
      }

      select {
        border: none;
        padding: 0.5rem;
        width: 100%;
        background-color: transparent;
        &:focus {
          outline: none;
        }
      }
    }
  }

  .submit,
  .change-password {
    display: flex;
    justify-content: flex-end;
    button {
      color: var(--background);
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color 0.3s;
    }
  }
  .submit button {
    background-color: var(--accent);
    &:hover {
      background-color: var(--accent-hover);
    }
  }
  .change-password button {
    background-color: var(--secondary);
    &:hover {
      background-color: var(--secondary-hover);
    }
  }

  @media (max-width: 768px) {
    .container {
      width: 100vw;
      overflow-y: scroll;
      min-height: 100vh;
      border-radius: 0;
    }

    form {
      flex-direction: column;
      gap: 0.5rem;
    }

    #email-input {
      grid-column: span 2;
    }
  }

  @media (max-width: 1180px) {
    form {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
