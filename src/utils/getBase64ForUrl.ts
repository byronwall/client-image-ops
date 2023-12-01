import { extractBase64FromBlob } from "./buffers";

export async function getBase64ForUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64Data = await extractBase64FromBlob(blob);

    return base64Data;
  } catch (e) {
    console.error(e);
  }

  return "";
}
