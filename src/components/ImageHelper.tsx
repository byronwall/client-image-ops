import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useS3Storage } from "~/stores/useS3Storage";
import {
  useWorkflowStore,
  type WorkflowImage,
} from "~/stores/useWorkflowStore";
import { workflowOperationList } from "~/stores/WorkflowOperations";
import { downloadBase64File } from "~/utils/buffers";
import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

interface ImageHelperProps {
  workflowImage: WorkflowImage | undefined;
}

export function ImageHelper({ workflowImage }: ImageHelperProps) {
  const getCanSaveImage = useS3Storage((s) => s.getCanSaveImage);
  const saveImage = useS3Storage((s) => s.saveImage);

  const [presignedUrl, setPresignedUrl] = useState<string | undefined>(
    undefined
  );

  const addWorkflowStep = useWorkflowStore((s) => s.addWorkflowStep);
  const isTerminal = useWorkflowStore((s) => s.isNodeTerminal);
  const removeWorkflowStep = useWorkflowStore((s) => s.removeWorkflowStep);

  const base64 = workflowImage?.base64Data;

  if (!base64) {
    return null;
  }

  const shouldShowButtons = isTerminal(workflowImage.id);

  const imageType = base64.split(";")[0].split("/")[1];

  const handleSaveImage = async () => {
    // call the save, get the URL back, and then set it in the state
    const url = await saveImage(base64);

    setPresignedUrl(url);
  };

  const isNotRoot = workflowImage.id !== "root";

  return (
    <div className="flex">
      <div className="p-2 flex flex-col">
        <div className="flex gap-1">
          <p>
            {imageType} [{Math.round((base64.length * 3) / 4 / 1024)} KB]
          </p>
          <button
            onClick={() => downloadBase64File(base64, "output." + imageType)}
          >
            download
          </button>
          {getCanSaveImage() && presignedUrl === undefined && (
            <button onClick={handleSaveImage}>get url</button>
          )}
          {isNotRoot && (
            <Button
              onClick={() => removeWorkflowStep(workflowImage.id)}
              variant={"destructive"}
            >
              <Trash2 />
            </Button>
          )}
        </div>
        <img
          src={presignedUrl || base64}
          alt="output"
          height={260}
          width={260}
          className={cn({
            "border-4 border-green-500": presignedUrl !== undefined,
          })}
        />
      </div>

      {shouldShowButtons && (
        <>
          <div className="self-center flex justify-center ">
            <div className="w-10 h-3 bg-slate-500"></div>
          </div>

          <div className="flex flex-col self-center border border-slate-500 rounded-lg gap-2 p-2">
            {workflowOperationList.map((operation) => (
              <Button
                key={operation}
                onClick={() => {
                  addWorkflowStep({
                    inputId: workflowImage.id,
                    operation,
                  });
                }}
              >
                {operation}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
