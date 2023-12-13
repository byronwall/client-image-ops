import heic2any from "heic2any";

import { extractBase64FromBlob, createBlobFromBase64 } from "./buffers";

export async function convertHEICToPNG(base64Data: string) {
  const blob = createBlobFromBase64(base64Data, "image/heic");

  let pngBlob = await heic2any({
    blob: blob,
    toType: "image/png",
  });

  // get single png blob if heic2any returns an array
  if (Array.isArray(pngBlob)) {
    pngBlob = pngBlob[0];
  }

  // return base 64 data
  return extractBase64FromBlob(pngBlob);
}
