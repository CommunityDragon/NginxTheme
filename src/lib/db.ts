// lib/filelist-db.ts

const DB_NAME = "filelists";
const STORE_NAME = "filelists";
const DB_VERSION = 1;

export class FilelistDB {
  private static dbConnection: Promise<IDBDatabase> | null = null;

  private version: string;
  private worker: Worker | null = null;
  private workerPromiseMap = new Map<
    string,
    {
      resolve: (matches: string[]) => void;
      reject: (reason?: unknown) => void;
    }
  >();

  constructor(version: string) {
    this.version = version;
  }

  private static async getConnection(): Promise<IDBDatabase> {
    if (FilelistDB.dbConnection) return FilelistDB.dbConnection;

    FilelistDB.dbConnection = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "version" });
        }
      };
    });

    return FilelistDB.dbConnection;
  }

  async getFileList(): Promise<string[] | undefined> {
    const db = await FilelistDB.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.files);
      };
    });
  }

  async saveFileList(files: string[]): Promise<void> {
    const db = await FilelistDB.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ version: this.version, files });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteFileList(): Promise<void> {
    const db = await FilelistDB.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Search the file list of this version using a regular expression.
   * The search runs in a Web Worker if supported.
   * @param regex The RegExp to test against each filename
   * @returns Array of matching filenames
   */
  async searchFileList(regex: RegExp): Promise<string[]> {
    const files = await this.getFileList();
    if (!files) return [];

    // Fallback to main thread if workers are not supported
    if (typeof Worker === "undefined") {
      return files.filter((file) => regex.test(file));
    }

    this.initWorker();

    const requestId = Math.random().toString(36).substring(2) + Date.now();

    return new Promise((resolve, reject) => {
      this.workerPromiseMap.set(requestId, { resolve, reject });

      // biome-ignore lint/style/noNonNullAssertion: debug
      this.worker!.postMessage({
        type: "search",
        files,
        pattern: regex.source,
        flags: regex.flags,
        requestId,
      });
    });
  }

  private initWorker() {
    if (this.worker) return;

    const workerCode = `
      self.onmessage = (e) => {
        const { type, files, pattern, flags, requestId } = e.data;
        if (type === 'search') {
          try {
            const regex = new RegExp(pattern, flags);
            const matches = files.filter(file => regex.test(file));
            self.postMessage({ type: 'result', matches, requestId });
          } catch (err) {
            self.postMessage({ type: 'error', error: err.message, requestId });
          }
        }
      };
    `;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = (e) => {
      const { type, matches, error, requestId } = e.data;
      const promise = this.workerPromiseMap.get(requestId);
      if (!promise) return;

      if (type === "result") {
        promise.resolve(matches);
      } else if (type === "error") {
        promise.reject(new Error(error));
      }
      this.workerPromiseMap.delete(requestId);
    };

    this.worker.onerror = (err) => {
      this.workerPromiseMap.forEach((p) => {
        p.reject(err);
      });
      this.workerPromiseMap.clear();
    };
  }

  dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.workerPromiseMap.clear();
    }
  }
}
