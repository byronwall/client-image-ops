import { useDropzone } from "react-dropzone";

import { cn } from "~/utils/classes";

const App = () => {
  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
    noClick: true,
  });

  return (
    <div className="relative" {...getRootProps()}>
      <div
        className={cn(
          "absolute top-0 left-0 h-screen w-screen p-4 transition-all duration-300 ease-in-out -z-10",
          {
            "bg-gray-300 border-4 border-gray-500": isDragActive,
          }
        )}
      ></div>
      <div
        className={cn("flex flex-col items-center justify-center min-h-screen")}
      >
        <h1 className="text-4xl font-bold">Image Converter</h1>
        <p className="text-xl mt-4">
          To make use of this tool, paste or drop something containing an image
          here.
        </p>
      </div>
    </div>
  );
};

export default App;
