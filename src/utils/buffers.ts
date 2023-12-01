export function convertBase64ToNodeBuffer(base64: string): Uint8Array {
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
