import { type DragEvent, useState, useEffect } from "react";

import { cn } from "~/utils/classes";
import { handleEventWithData } from "~/utils/events";
import { useWorkflowStore } from "~/stores/useWorkflowStore";

import { Spinner } from "./ui/Spinner";
import { ImageHelper } from "./ImageHelper";
import { S3StorageSettings } from "./S3StorageSettings";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isDragActive, setIsDragActive] = useState(false);

  const inputImage = useWorkflowStore((s) => s.inputImage);
  const setBase64data = useWorkflowStore((s) => s.setInputImage);
  const workflowSteps = useWorkflowStore((s) => s.workflowSteps);

  const base64Data = inputImage?.base64Data;

  const handleDragOver = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    setIsDragActive(true);
  };

  const handleDrop = async (ev: DragEvent) => {
    setIsLoading(true);

    setIsDragActive(false);

    const res = await handleEventWithData(ev as DragEvent);
    if (!res) {
      return;
    }

    const { base64Data } = res;

    setBase64data(base64Data);

    setIsLoading(false);
  };

  const handlePaste = async (ev: any) => {
    // kick out if input
    if (ev.target.tagName === "INPUT") {
      return;
    }

    setIsLoading(true);

    const res = await handleEventWithData(ev as ClipboardEvent);
    if (!res) {
      return;
    }

    const { base64Data } = res;

    setBase64data(base64Data);

    setIsLoading(false);
  };

  const [base64Png, setBase64Png] = useState<string | undefined>(undefined);
  const [base64Jpg, setBase64Jpg] = useState<string | undefined>(undefined);
  const [base64Webp, setBase64Webp] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!base64Data) {
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = base64Data;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngBase64 = canvas.toDataURL(`image/png`);
      setBase64Png(pngBase64);

      const jpgBase64 = canvas.toDataURL(`image/jpeg`);
      setBase64Jpg(jpgBase64);

      const webpBase64 = canvas.toDataURL(`image/webp`);
      setBase64Webp(webpBase64);
    };
  }, [base64Data]);

  return (
    <div
      className="relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <div className="absolute top-0 left-0 h-screen w-screen flex items-stretch -z-10 ">
        <div
          className={cn(
            "m-1 p-4 transition-all duration-300 ease-in-out  flex-1 rounded-md",
            {
              "bg-gray-300 border-4 border-gray-500": isDragActive,
            }
          )}
        ></div>
      </div>
      <div className="flex flex-col items-center  min-h-screen gap-4  p-2">
        <h1 className="text-4xl font-bold">Image Converter</h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="w-80 p-2  bg-gray-300 border-4 border-gray-500 rounded-lg">
            {isLoading && <Spinner />}

            <p>input image (drop or paste)</p>

            <ImageHelper workflowImage={inputImage} />
          </div>

          {workflowSteps.map((step, i) => (
            <div
              key={i}
              className="w-80 p-2  bg-gray-300 border-4 border-gray-500 rounded-lg"
            >
              <p>{step.operation}</p>

              {step.outputImages.map((outputImage) => (
                <ImageHelper key={outputImage.id} workflowImage={outputImage} />
              ))}
            </div>
          ))}

          <div className="bg-gray-300 border-4 border-gray-500 rounded-lg flex gap-4">
            <ImageHelper base64={base64Png} />
            <ImageHelper base64={base64Jpg} />
            <ImageHelper base64={base64Webp} />
          </div>

          <S3StorageSettings />
        </div>
      </div>
    </div>
  );
};

export default App;
