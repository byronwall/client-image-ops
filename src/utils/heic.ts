import heic2any from "heic2any";

import { extractBase64FromBlob, convertBase64ToUInt8Array } from "./buffers";

export async function convertHEICToPNG(base64Data: string) {
  const uint8Array = convertBase64ToUInt8Array(base64Data);

  // from buffer
  const blob = new Blob([uint8Array], { type: "image/heic" });

  let pngBlob = await heic2any({
    blob: blob,
    toType: "image/png",
    quality: 0.8, // Optional: Adjust the quality
  });

  // get single png blob
  if (Array.isArray(pngBlob)) {
    pngBlob = pngBlob[0];
  }

  // return base 64 data
  return extractBase64FromBlob(pngBlob);
}
