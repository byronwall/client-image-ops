import { type Base64Image } from "./useWorkflowStore";

export const workflowOperationList = [
  "grayscale",
  "invert",
  "blur",
  "to_jpg",
  "to_png",
  "to_webp",
] as const;

export type WorkflowOperations = (typeof workflowOperationList)[number];

type WorkflowOperationAction = (input: Base64Image) => Promise<Base64Image>;

export const workflowOperations: Record<
  WorkflowOperations,
  WorkflowOperationAction
> = {
  grayscale: async (input: Base64Image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const avg =
            (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
          imgData.data[i] = avg; // red
          imgData.data[i + 1] = avg; // green
          imgData.data[i + 2] = avg; // blue
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
    }),
  invert: async (input: Base64Image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i] = 255 - imgData.data[i]; // red
          imgData.data[i + 1] = 255 - imgData.data[i + 1]; // green
          imgData.data[i + 2] = 255 - imgData.data[i + 2]; // blue
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
    }),
  blur: async (input: Base64Image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.filter = "blur(5px)";
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
    }),

  to_jpg: async (input: Base64Image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
    }),

  to_png: async (input: Base64Image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
    }),

  to_webp: async (input: Base64Image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL("image/webp"));
      };
      img.onerror = reject;
    }),
};
