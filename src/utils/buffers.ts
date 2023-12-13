export function convertBase64ToUInt8Array(base64: string): Uint8Array {
  // this is basically a node buffer
  // can get an array buffer with bytes.buffer
  // remove data:image/jpeg;base64, from base64 string if present
  if (base64.startsWith("data:")) {
    base64 = base64.split(",")[1];
  }

  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes;
}

export async function extractBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}
export function createBlobFromBase64(base64Data: string, mimeType?: string) {
  const uint8Array = convertBase64ToUInt8Array(base64Data);

  if (!mimeType) {
    mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];
  }

  const blob = new Blob([uint8Array], { type: mimeType });
  return blob;
}

export function downloadBase64File(base64Data: string, fileName: string) {
  const blob = createBlobFromBase64(base64Data);

  const anchor = document.createElement("a");
  const url = window.URL.createObjectURL(blob);

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}
