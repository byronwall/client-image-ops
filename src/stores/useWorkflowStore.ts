import { create } from "zustand";

import {
  type WorkflowOperations,
  workflowOperations,
} from "./WorkflowOperations";

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

    // find the node and see if it has an output image
    for (const step of workflowSteps) {
      if (step.inputId === id) {
        return step.outputImages.length === 0;
      }
    }

    return true;
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
