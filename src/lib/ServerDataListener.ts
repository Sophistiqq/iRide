import { writable, type Writable } from "svelte/store";

export class ServerDataListener {
  private SERVER_URL: string;
  private eventSource: EventSource | null = null;
  private activeDevices: Set<string> = new Set();
  private updateTimeout: number | null = null;

  public deviceData: Writable<Map<string, any>>;

  constructor(serverUrl?: string) {
    this.SERVER_URL = serverUrl || import.meta.env.VITE_SERVER_API_URL;
    this.deviceData = writable(new Map<string, any>());
  }

  public start(): void {
    this.connect();
  }

  public stop(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.updateTimeout) {
      window.clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
  }

  private connect(): void {
    // Close existing connection if any
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(`${this.SERVER_URL}/events`);

    this.eventSource.onmessage = (event) => {
      if (this.updateTimeout) {
        window.clearTimeout(this.updateTimeout);
      }
      console.log("Received SSE data:", event.data);
      this.updateTimeout = window.setTimeout(() => {
        this.processData(event.data);
      }, 100);
    };

    this.eventSource.onerror = () => {
      // Auto-reconnect after a short delay
      setTimeout(() => {
        this.connect();
      }, 3000);
    };
  }

  private processData(rawData: string): void {
    // Clear the active devices before processing new data
    this.activeDevices.clear();

    try {
      const locationsArray = JSON.parse(rawData);

      // Process all incoming device data
      locationsArray.forEach((location: any) => {
        this.activeDevices.add(location.device_id);
        this.updateDeviceData(location);
      });

      // Remove stale devices
      this.removeStaleDevices();
    } catch (error) {
      console.error("Error processing SSE data:", error);
    }
  }

  private updateDeviceData(data: any): void {
    this.deviceData.update((dataMap) => {
      dataMap.set(data.device_id, data);
      return dataMap;
    });
  }

  private removeStaleDevices(): void {
    this.deviceData.update((dataMap) => {
      for (const deviceId of dataMap.keys()) {
        if (!this.activeDevices.has(deviceId)) {
          dataMap.delete(deviceId);
        }
      }
      return dataMap;
    });
  }
}
