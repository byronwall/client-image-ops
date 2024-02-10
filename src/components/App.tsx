import { type DragEvent, useState, useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  type Edge,
  type Node,
  Background,
  Controls,
  useNodesState,
} from "reactflow";
import { useMeasure } from "react-use";

import { cn } from "~/utils/classes";
import { handleEventWithData } from "~/utils/events";
import {
  type WorkflowStep,
  useWorkflowStore,
  type WorkflowImage,
} from "~/stores/useWorkflowStore";

import CustomNode from "./CustomNode";

import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
};

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isDragActive, setIsDragActive] = useState(false);

  const inputImage = useWorkflowStore((s) => s.inputImage);
  const setBase64data = useWorkflowStore((s) => s.setInputImage);
  const workflowSteps = useWorkflowStore((s) => s.workflowSteps);

  const { reactFlowEdges, reactFlowNodes } = useMemo(() => {
    // convert the workflowSteps to a format that reactflow can understand
    const reactFlowNodes: Node<WorkflowStep | WorkflowImage>[] =
      workflowSteps.map((step, i) => ({
        id: step.outputImages[0].id,
        position: { x: 0, y: 250 * (i + 2) },
        data: step,
        type: "custom",
      }));

    // add in the input image too
    if (inputImage) {
      reactFlowNodes.unshift({
        id: "root",
        position: { x: 0, y: 0 },
        data: inputImage,
        type: "custom",
      });
    }

    const reactFlowEdges: Edge[] = workflowSteps.map((step, i) => ({
      id: `e${i + 1}-${i + 2}`,
      source: step.inputId,
      target: step.outputImages?.[0].id ?? "root",
      animated: true,
      style: { strokeWidth: 10 },
    }));

    return { reactFlowNodes, reactFlowEdges };
  }, [inputImage, workflowSteps]);

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

  const [ref, { width, height }] = useMeasure();

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);

  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

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

        <div
          className="flex-1 self-stretch h-1  border rounded-lg"
          ref={ref as any}
        >
          <div style={{ height, width }}>
            <ReactFlow
              nodes={nodes}
              edges={reactFlowEdges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              fitView
            >
              <MiniMap
                style={{
                  height: 120,
                }}
                zoomable
                pannable
              />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </div>

        {/* <div className="flex flex-wrap items-center gap-4">
          <S3StorageSettings />
        </div> */}
      </div>
    </div>
  );
};

export default App;
