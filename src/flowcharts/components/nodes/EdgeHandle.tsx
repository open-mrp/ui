import { Handle, Position } from "@xyflow/react";
import React from "react";

export interface EdgeHandleProps {
  id: string;
  position: Position;
  type: "target" | "source";
  handlePosition: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

export default function EdgeHandle({
  id,
  position,
  type,
  handlePosition,
}: EdgeHandleProps) {
  return (
    <Handle
      id={id}
      type={type}
      position={position}
      style={{
        position: "absolute",
        ...handlePosition,
        background: "transparent",
        color: "transparent",
        borderColor: "transparent",
      }}
    />
  );
}
