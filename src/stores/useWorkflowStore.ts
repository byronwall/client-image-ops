import { create } from "zustand";

export type Base64Image = string;

export type WorkflowImage = {
  id: string;
  base64Data: Base64Image;
};

type WorkflowStoreData = {
  inputImage: WorkflowImage | undefined;

  workflowSteps: WorkflowStep[];
};

type WorkflowStepInputs = {
  inputId: string;
  operation: WorkflowOperations;
  options?: Record<string, any>;
};

export type WorkflowStep = WorkflowStepInputs & {
  outputImages: WorkflowImage[];
};

type WorkflowStoreActions = {
  addWorkflowStep: (inputData: WorkflowStepInputs) => void;
  setInputImage: (inputImage: Base64Image) => void;

  getImageById: (id: string) => WorkflowImage | undefined;
  isNodeTerminal: (id: string) => boolean;
};

function getDumbId() {
  return "id-" + +Date.now();
}

export const useWorkflowStore = create<
  WorkflowStoreData & WorkflowStoreActions
>((set, get) => ({
  inputImage: undefined,
  workflowSteps: [],

  isNodeTerminal: (id) => {
    const { workflowSteps } = get();

    // if id is input and no steps exist then true
    if (id === "root" && workflowSteps.length === 0) {
      return true;
    }

    return workflowSteps.some((step) =>
      step.outputImages.some((outputImage) => outputImage.id === id)
    );
  },

  setInputImage: (inputImage) => {
    set({
      inputImage: {
        id: "root",
        base64Data: inputImage,
      },
    });
  },

  getImageById: (id) => {
    const { inputImage, workflowSteps } = get();
    if (inputImage?.id === id) {
      return inputImage;
    }

    // check all steps and all output images
    for (const step of workflowSteps) {
      for (const outputImage of step.outputImages) {
        if (outputImage.id === id) {
          return outputImage;
        }
      }
    }

    console.error("No image found with id", id);
  },

  addWorkflowStep: async ({ inputId, operation, options }) => {
    const { workflowSteps, getImageById } = get();

    const inputImageForStep = getImageById(inputId);
    if (!inputImageForStep) {
      console.error("No image found with id", inputId);
      return;
    }

    const imgData = inputImageForStep.base64Data;

    const outputImage = await workflowOperations[operation](imgData);

    const newWorkflowStep: WorkflowStep = {
      inputId,
      operation,
      options,
      outputImages: [
        {
          id: getDumbId(),
          base64Data: outputImage,
        },
      ],
    };

    set({
      workflowSteps: [...workflowSteps, newWorkflowStep],
    });
  },
}));

type WorkflowOperations = "grayscale" | "invert" | "blur";

type WorkflowOperationAction = (input: Base64Image) => Promise<Base64Image>;

const workflowOperations: Record<WorkflowOperations, WorkflowOperationAction> =
  {
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
    invert: async (input: Base64Image) => {
      // ... invert logic
      return input;
    },
    blur: async (input: Base64Image) => {
      // ... blur logic
      return input;
    },
  };
