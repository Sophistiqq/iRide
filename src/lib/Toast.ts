class ToastManager {
  private static instance: ToastManager
  private containerElement: HTMLElement | null = null
  private toasts: HTMLElement[] = []

  private constructor() { }

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager()
      ToastManager.instance.createContainer()
    }
    return ToastManager.instance
  }

  private createContainer() {
    this.containerElement = document.createElement('div')
    this.containerElement.className = 'toast-container'

    const style = document.createElement('style')
    style.textContent = `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        z-index: 1000;
        gap: 10px;
      }
      .toast {
        background-color: #333;
        color: #fff;
        padding: 10px 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateX(100%);
        transition: opacity 0.5s, transform 0.5s;
      }
      .toast.show {
        opacity: 1;
        transform: translateX(0);
      }
      .toast.success { background-color: #4CAF50; }
      .toast.error { background-color: #F44336; }
      .toast.warning { background-color: #FF9800; }
    `

    document.body.appendChild(this.containerElement)
    document.body.appendChild(style)
  }

  public show(
    message: string,
    duration: number = 3000,
    type: 'success' | 'error' | 'warning' = 'success'
  ) {
    if (!this.containerElement) {
      this.createContainer()
    }

    const toastElement = document.createElement('div')
    toastElement.className = `toast ${type}`
    toastElement.textContent = message

    this.containerElement?.appendChild(toastElement)
    this.toasts.push(toastElement)

    // Trigger reflow to enable transition
    toastElement.offsetHeight
    toastElement.classList.add('show')

    const timeoutId = window.setTimeout(() => {
      this.removeToast(toastElement)
    }, duration)

    // Optional: Add close on click
    toastElement.addEventListener('click', () => {
      clearTimeout(timeoutId)
      this.removeToast(toastElement)
    })
  }

  private removeToast(toastElement: HTMLElement) {
    toastElement.classList.remove('show')

    setTimeout(() => {
      toastElement.remove()
      this.toasts = this.toasts.filter((toast) => toast !== toastElement)
    }, 500) // Match the transition duration
  }
}

// Export a singleton instance
export const toast = ToastManager.getInstance().show.bind(ToastManager.getInstance())
