import { type DragEvent, useState } from "react";

import { cn } from "~/utils/classes";
import { handleEventWithData } from "~/utils/events";

import { Spinner } from "./ui/Spinner";

const App = () => {
  const [inputType, setInputType] = useState<"drop" | "paste" | undefined>(
    undefined
  );

  const [base64data, setBase64data] = useState<string | undefined>(undefined);

  const [inputData, setInputData] = useState<any | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    setIsDragActive(true);
  };

  const handleDrop = async (ev: DragEvent) => {
    setIsLoading(true);

    setInputType("drop");
    setIsDragActive(false);

    const res = await handleEventWithData(ev as DragEvent);
    if (!res) {
      return;
    }

    const { base64Data, dropData } = res;

    setBase64data(base64Data);
    setInputData(dropData);
    setIsLoading(false);
  };

  const handlePaste = async (ev: any) => {
    setInputType("paste");
    setIsLoading(true);

    const res = await handleEventWithData(ev as ClipboardEvent);
    if (!res) {
      return;
    }

    const { base64Data, dropData } = res;

    setBase64data(base64Data);
    setInputData(dropData);
    setIsLoading(false);
  };

  return (
    <div
      className="relative  "
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 ">
        <h1 className="text-4xl font-bold">Image Converter</h1>
        <p className="text-xl mt-4">
          Paste an image or drop something containing an image here.
        </p>

        <div className="flex flex-wrap gap-4">
          <div className="w-80 h-80 bg-gray-300 border-4 border-gray-500 rounded-lg">
            <p>input</p>
            {inputType === "drop" && <p>drop</p>}
            {inputType === "paste" && <p>paste</p>}
            {inputType === undefined && <p>paste or drop to start!</p>}
            {isLoading && <Spinner />}
          </div>
          <div className="w-80 h-80 bg-gray-300 border-4 border-gray-500 rounded-lg">
            <p>raw image</p>

            {base64data && (
              <img src={base64data} alt="output" height={260} width={260} />
            )}
          </div>
          <div className="w-80 h-80 bg-gray-300 border-4 border-gray-500 rounded-lg">
            output
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
