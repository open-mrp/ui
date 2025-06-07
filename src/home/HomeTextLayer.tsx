"use client";

export interface HomeTextLayerProps {
  children: React.ReactNode;
  style: React.CSSProperties;
}

export default function HomeTextLayer({ children, style }: HomeTextLayerProps) {
  return (
    <span
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        userSelect: "none",
        pointerEvents: "none",
        color: "#FFFFFF",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
