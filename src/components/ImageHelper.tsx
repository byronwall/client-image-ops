import { downloadBase64File } from "~/utils/buffers";

interface ImageHelperProps {
  base64Webp?: string;
}

export function ImageHelper({ base64Webp }: ImageHelperProps) {
  if (!base64Webp) {
    return null;
  }

  const imageType = base64Webp.split(";")[0].split("/")[1];

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
      </div>
      <img
        src={base64Webp}
        alt="output"
        height={260}
        width={260}
        className="rounded-lg"
      />
    </div>
  );
}
