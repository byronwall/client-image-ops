import { type DragEvent, useState } from "react";

import { cn } from "~/utils/classes";
import { handleDropEvent, handlePasteEvent } from "~/utils/images";

const App = () => {
  // TODO: need to handle paste event

  const [inputType, setInputType] = useState<"drop" | "paste" | undefined>(
    undefined
  );

  const [base64data, setBase64data] = useState<string | undefined>(undefined);

  const [inputData, setInputData] = useState<any | undefined>(undefined);

  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    setIsDragActive(true);
  };

  const handleDrop = async (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    setInputType("drop");
    setIsDragActive(false);

    const res = await handleDropEvent(ev as DragEvent);
    if (!res) {
      return;
    }

    const { base64Data, dropData } = res;

    setBase64data(base64Data);
    setInputData(dropData);
  };

  const handlePaste = async (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();

    setInputType("paste");

    const res = await handlePasteEvent(ev as ClipboardEvent);
    if (!res) {
      return;
    }

    const { base64Data, dropData } = res;

    setBase64data(base64Data);
    setInputData(dropData);
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
            {inputData && (
              <pre className="overflow-hidden break-all whitespace-pre-wrap">
                {JSON.stringify(inputData)}
              </pre>
            )}
          </div>
          <div className="w-80 h-80 bg-gray-300 border-4 border-gray-500 rounded-lg">
            <p>raw image</p>
            <pre className="truncate">{base64data}</pre>
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
