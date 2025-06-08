"use client";

export interface HomeTextLayerProps {
  children: React.ReactNode;
  style: React.CSSProperties;
  className?: string;
}

export default function HomeTextLayer({
  children,
  style,
  className,
}: HomeTextLayerProps) {
  return (
    <span
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
