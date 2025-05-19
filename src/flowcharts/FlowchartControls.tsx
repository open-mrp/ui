import { Button } from "@/buttons";
import FitViewIcon from "@/icons/FitViewIcon";
import ZoomInIcon from "@/icons/ZoomInIcon";
import ZoomOutIcon from "@/icons/ZoomOutIcon";
import { ReactFlowInstance } from "@xyflow/react";

export interface FlowchartControlsProps {
  reactFlowInstance: ReactFlowInstance | null;
}
export default function FlowchartControls({
  reactFlowInstance,
}: FlowchartControlsProps) {
  return (
    <div
      className="absolute bottom-4 left-4 flex items-center gap-2 border rounded p-2 z-10"
      style={{
        backgroundColor: "rgba(var(--background), 0.8)",
        borderColor: "var(--border-color)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // For Safari support
      }}
    >
      <Button
        variant="icon"
        color="gray"
        onClick={() => reactFlowInstance?.fitView()}
        title="Fit View"
      >
        <FitViewIcon size={16} />
      </Button>
      <div
        className="w-px h-6"
        style={{
          backgroundColor: "var(--border-color)",
        }}
      />
      <Button
        variant="icon"
        color="gray"
        onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
        title="Zoom Out"
      >
        <ZoomOutIcon size={16} />
      </Button>
      <Button
        variant="icon"
        color="gray"
        onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
        title="Zoom In"
      >
        <ZoomInIcon size={16} />
      </Button>
    </div>
  );
}
