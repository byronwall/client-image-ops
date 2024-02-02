import { useState } from "react";

import { useS3Storage } from "~/stores/useS3Storage";
import { downloadBase64File } from "~/utils/buffers";
import { cn } from "~/utils/classes";

interface ImageHelperProps {
  base64Webp?: string;
}

export function ImageHelper({ base64Webp }: ImageHelperProps) {
  const getCanSaveImage = useS3Storage((s) => s.getCanSaveImage);
  const saveImage = useS3Storage((s) => s.saveImage);

  const [presignedUrl, setPresignedUrl] = useState<string | undefined>(
    undefined
  );

  if (!base64Webp) {
    return null;
  }

  const imageType = base64Webp.split(";")[0].split("/")[1];

  const handleSaveImage = async () => {
    // call the save, get the URL back, and then set it in the state
    const url = await saveImage(base64Webp);

    setPresignedUrl(url);
  };

  return (
    <div className="p-2">
      <div className="flex gap-1">
        <p>
          {imageType} [{Math.round((base64Webp.length * 3) / 4 / 1024)} KB]
        </p>
        <button
          onClick={() => downloadBase64File(base64Webp, "output." + imageType)}
        >
          download
        </button>
        {getCanSaveImage() && presignedUrl === undefined && (
          <button onClick={handleSaveImage}>get url</button>
        )}
      </div>
      <img
        src={presignedUrl || base64Webp}
        alt="output"
        height={260}
        width={260}
        className={cn("rounded-lg", {
          "border-4 border-green-500": presignedUrl !== undefined,
        })}
      />
    </div>
  );
}
