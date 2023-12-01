import { type DragEvent } from "react";

import {
  createDefaultDropData,
  type ProcImageData,
  type DropData,
} from "~/models/models";

import { getImageDataFromDropData } from "./images";

export async function handleEventWithData(
  e: DragEvent | ClipboardEvent
): Promise<ProcImageData | void> {
  e.stopPropagation();
  e.preventDefault();

  const dropData = extractDataFromEvent(e);

  return getImageDataFromDropData(dropData);
}

function extractDataFromEvent(evt: ClipboardEvent | DragEvent): DropData {
  if ("clipboardData" in evt && evt.clipboardData !== null) {
    return extractDataTransfer(evt.clipboardData);
  }

  if ("dataTransfer" in evt && evt.dataTransfer !== null) {
    return extractDataTransfer(evt.dataTransfer);
  }

  return createDefaultDropData();
}

function extractDataTransfer(dataTransfer: DataTransfer): DropData {
  const result = createDefaultDropData();

  // Extract files if present
  if (dataTransfer.files.length > 0) {
    result.files = Array.from(dataTransfer.files);
  }

  // Extract text data if present
  const textData = dataTransfer.getData("text/plain");
  if (textData) {
    result.text = textData;
  }

  // Extract URL if present
  const urlData = dataTransfer.getData("text/uri-list");
  if (urlData) {
    result.url = urlData;
  }

  // Extract any custom data based on available types
  for (const type of dataTransfer.types) {
    if (type !== "Files" && type !== "text/plain" && type !== "text/uri-list") {
      result.customData[type] = dataTransfer.getData(type);
    }
  }

  return result;
}
