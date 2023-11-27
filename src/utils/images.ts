import { type DragEvent } from "react";

// Function to extract base64 data from a Blob
async function extractBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function displayImageAsBase64(url: string): Promise<string> {
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

type DropData = {
  files: File[];
  text: string | null;
  url: string | null;
  customData: Record<string, string>;
};

function extractDropData(event: DragEvent) {
  const result: DropData = {
    files: [],
    text: null,
    url: null,
    customData: {},
  };

  if (event.dataTransfer === null) {
    return result;
  }

  // Extract files if present
  if (event.dataTransfer.files.length > 0) {
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      result.files.push(event.dataTransfer.files[i]);
    }
  }

  // Extract text data if present
  const textData = event.dataTransfer.getData("text/plain");
  if (textData) {
    result.text = textData;
  }

  // Extract URL if present
  const urlData = event.dataTransfer.getData("text/uri-list");
  if (urlData) {
    result.url = urlData;
  }

  // Extract any custom data based on available types
  for (const type of event.dataTransfer.types) {
    if (type !== "Files" && type !== "text/plain" && type !== "text/uri-list") {
      result.customData[type] = event.dataTransfer.getData(type);
    }
  }

  return result;
}

export async function handleDropEvent(e: DragEvent): Promise<{
  base64Data: string;
  dropData: DropData;
} | void> {
  if (e.dataTransfer === null) {
    return;
  }
  e.stopPropagation();
  e.preventDefault();

  //TODO: return the dropData too
  const dropData = extractDropData(e);

  console.log(dropData);

  if (dropData.files.length > 0) {
    const file = dropData.files[0];

    if (file.type.startsWith("image/")) {
      const base64Data = await extractBase64FromBlob(file);

      return { base64Data, dropData };
    } else {
      console.error("Not an image file");
    }
  } else if (dropData.customData["text/html"]) {
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
    return { base64Data: await displayImageAsBase64(imageUrl), dropData };
  }
}

export async function handlePasteEvent(e: ClipboardEvent): Promise<{
  base64Data: string;
  dropData: DropData;
} | void> {
  if (e.clipboardData === null) {
    return;
  }
  e.stopPropagation();
  e.preventDefault();

  const dropData = extractPasteData(e.clipboardData); // Assuming this function exists

  console.log(dropData);

  if (dropData.files.length > 0) {
    const file = dropData.files[0];

    if (file.type.startsWith("image/")) {
      const base64Data = await extractBase64FromBlob(file);

      return { base64Data, dropData };
    } else {
      console.error("Not an image file");
    }
  } else if (dropData.customData["text/html"]) {
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
    return { base64Data: await displayImageAsBase64(imageUrl), dropData };
  }
}

function extractPasteData(clipboardData: DataTransfer): DropData {
  const result: DropData = {
    files: [],
    text: null,
    url: null,
    customData: {},
  };

  // Extract files if present
  if (clipboardData.files.length > 0) {
    for (let i = 0; i < clipboardData.files.length; i++) {
      result.files.push(clipboardData.files[i]);
    }
  }

  // Extract text data if present
  const textData = clipboardData.getData("text/plain");
  if (textData) {
    result.text = textData;
  }

  // Extract URL if present
  const urlData = clipboardData.getData("text/uri-list");
  if (urlData) {
    result.url = urlData;
  }

  // Extract any custom data based on available types
  for (const type of clipboardData.types) {
    if (type !== "Files" && type !== "text/plain" && type !== "text/uri-list") {
      result.customData[type] = clipboardData.getData(type);
    }
  }

  return result;
}
