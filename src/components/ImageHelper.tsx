import { useState } from "react";

import { useS3Storage } from "~/stores/useS3Storage";
import {
  type Base64Image,
  useWorkflowStore,
  type WorkflowImage,
} from "~/stores/useWorkflowStore";
import { downloadBase64File } from "~/utils/buffers";
import { cn } from "~/utils/classes";

interface ImageHelperProps {
  base64?: Base64Image;

  workflowImage?: WorkflowImage;
}

export function ImageHelper({
  base64: _base,
  workflowImage,
}: ImageHelperProps) {
  const getCanSaveImage = useS3Storage((s) => s.getCanSaveImage);
  const saveImage = useS3Storage((s) => s.saveImage);

  const [presignedUrl, setPresignedUrl] = useState<string | undefined>(
    undefined
  );

  const addWorkflowStep = useWorkflowStore((s) => s.addWorkflowStep);

  const base64 = workflowImage?.base64Data || _base;

  if (!base64) {
    return null;
  }

  const imageType = base64.split(";")[0].split("/")[1];

  const handleSaveImage = async () => {
    // call the save, get the URL back, and then set it in the state
    const url = await saveImage(base64);

    setPresignedUrl(url);
  };

  return (
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
      </div>
      <img
        src={presignedUrl || base64}
        alt="output"
        height={260}
        width={260}
        className={cn("rounded-lg", {
          "border-4 border-green-500": presignedUrl !== undefined,
        })}
      />
      <div className="flex justify-center gap-2">
        <div className="w-3 h-10 bg-slate-500"></div>
      </div>

      {workflowImage && (
        <div className="flex self-center border border-slate-500 rounded-lg gap-2 p-2">
          <button
            onClick={() => {
              addWorkflowStep({
                inputId: workflowImage.id,
                operation: "grayscale",
              });
            }}
          >
            Grayscale
          </button>
        </div>
      )}
    </div>
  );
}
