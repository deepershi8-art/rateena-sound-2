// Browser-local image slots (IndexedDB). Images stay on this device and are
// not part of the JSON export or the public repository.
const DB = "rateena-sound-2-images";
const STORE = "images";
export const MAX_IMAGE_BYTES = 15_000_000;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Local image storage is unavailable in this browser."));
      return;
    }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error ?? new Error("Image storage could not be opened."));
  });
}
async function run<T>(
  mode: IDBTransactionMode,
  op: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = op(tx.objectStore(STORE));
    tx.oncomplete = () => {
      resolve(req.result as T);
      db.close();
    };
    tx.onerror = () => reject(tx.error ?? new Error("Image storage failed."));
  });
}
export interface StoredImage {
  blob: Blob;
  name: string;
  date: string;
}
export const getImage = (key: string) =>
  run<StoredImage | undefined>("readonly", (s) => s.get(key));
export const putImage = (key: string, value: StoredImage) =>
  run<IDBValidKey>("readwrite", (s) => s.put(value, key));
export const deleteImage = (key: string) =>
  run<undefined>("readwrite", (s) => s.delete(key));
