import { type DropData, type ProcImageData } from "~/models/models";

import { extractBase64FromBlob } from "./buffers";
import { getBase64ForUrl } from "./getBase64ForUrl";
import { convertHEICToPNG } from "./heic";

export async function getImageDataFromDropData(
  dropData: DropData
): Promise<ProcImageData | undefined> {
  if (dropData.files.length > 0) {
    const file = dropData.files[0];

    const base64Raw = await extractBase64FromBlob(file);

    if (file.type === "image/heic") {
      const base64DataPng = await convertHEICToPNG(base64Raw);
      return { base64Data: base64DataPng, dropData };
    }

    if (file.type.startsWith("image/")) {
      return { base64Data: base64Raw, dropData };
    }

    console.error("Not an image file");
  }

  if (dropData.customData["text/html"]) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      dropData.customData["text/html"],
      "text/html"
    );

    const imgTag = htmlDoc.querySelector("img");

    if (imgTag === null) {
      console.error("No image tag found");
      return;
    }

    const imageUrl = imgTag.src;
    const base64Data = await getBase64ForUrl(imageUrl);

    return { base64Data, dropData };
  }
}
