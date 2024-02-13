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

  removeWorkflowStep: (id: string) => void;

  reprocessAll: () => void;
};

function getDumbId() {
  return "id-" + +Date.now();
}

export const useWorkflowStore = create<
  WorkflowStoreData & WorkflowStoreActions
>((set, get) => ({
  inputImage: undefined,
  workflowSteps: [],

  reprocessAll: async () => {
    const { workflowSteps, inputImage } = get();

    // for each step, reprocess the image
    const newSteps = [];

    let inputToProcess = inputImage;

    for (const step of workflowSteps) {
      const inputImage = inputToProcess;
      if (!inputImage) {
        console.error("No image found with id", step.inputId);
        return;
      }

      const imgData = inputImage.base64Data;

      const outputImage = await workflowOperations[step.operation](imgData);

      newSteps.push({
        ...step,
        outputImages: [
          {
            id: getDumbId(),
            base64Data: outputImage,
          },
        ],
      });

      inputToProcess = newSteps[newSteps.length - 1].outputImages[0];
    }

    set({
      workflowSteps: await Promise.all(newSteps),
    });
  },

  removeWorkflowStep: (id) => {
    const { workflowSteps, reprocessAll } = get();

    // id will be linked to the output image
    // find the step that is going away and remove it, link the input to the remaining output

    const newSteps: WorkflowStep[] = [];

    let inputIdToUse = "root";

    for (const step of workflowSteps) {
      const outputContainsId = step.outputImages.find((img) => img.id === id);

      if (outputContainsId) {
        // remove the step
        inputIdToUse = step.inputId;
        continue;
      }

      // wire up that input to the next one
      if (inputIdToUse) {
        newSteps.push({
          ...step,
          inputId: inputIdToUse,
        });
        inputIdToUse = "";
      } else {
        newSteps.push(step);
      }
    }

    set({
      workflowSteps: newSteps,
    });

    reprocessAll();
  },

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
