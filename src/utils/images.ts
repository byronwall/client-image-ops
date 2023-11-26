const dropzone = document.getElementById("dropzone");
const eventOutput = document.getElementById("eventOutput");
const imgContainer = document.getElementById("imageContainer");

// Function to extract base64 data from a Blob
async function extractBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Function to update the image in the container
function updateImageContainer(
  base64Data: string,
  imageContainer?: HTMLElement | null
) {
  if (!imageContainer) {
    return;
  }

  const imgElement = document.createElement("img");
  imgElement.src = base64Data;

  // Clear any previous content inside the container
  imageContainer.innerHTML = "";

  // Append the image to the container
  imageContainer.appendChild(imgElement);
}

async function displayImageAsBase64(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64Data = await extractBase64FromBlob(blob);
    updateImageContainer(base64Data, imgContainer);
  } catch (e) {
    console.error(e);
  }
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

async function handleDropEvent(e: DragEvent) {
  e.stopPropagation();
  e.preventDefault();

  if (eventOutput === null) {
    return;
  }

  const dropData = extractDropData(e);
  eventOutput.textContent = JSON.stringify(dropData, null, 2);

  if (dropData.files.length > 0) {
    const file = dropData.files[0];

    if (file.type.startsWith("image/")) {
      const base64Data = await extractBase64FromBlob(file);
      updateImageContainer(base64Data);
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
    displayImageAsBase64(imageUrl);
  }
}
