import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

import {
  type WorkflowImage,
  type WorkflowStep,
} from "~/stores/useWorkflowStore";

import { ImageHelper } from "./ImageHelper";

function CustomNodeRaw({ id, data }: NodeProps<WorkflowStep | WorkflowImage>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      {"base64Data" in data && <ImageHelper workflowImage={data} />}

      {"outputImages" in data && data.outputImages && (
        <ImageHelper workflowImage={data.outputImages[0]} />
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const CustomNode = memo(CustomNodeRaw);

export default CustomNode;
