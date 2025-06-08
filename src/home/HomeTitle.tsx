"use client";

import HomeTextLayer from "./HomeTextLayer";

const styles = {
  title: {
    fontSize: "5.8rem",
    fontWeight: 650,
    lineHeight: "1.1",
    letterSpacing: "-0.03em",
    padding: "0px",
    margin: "0px",
  },
  description: {
    fontSize: "1.5rem",
    fontWeight: 400,
    letterSpacing: "0.01em",
    padding: "0px",
    margin: "0px",
  },
} as const;

export interface HomeTitleProps {
  title: string;
  description: string;
  baseZIndex?: number;
}

export default function HomeTitle({
  title,
  description,
  baseZIndex = 0,
}: HomeTitleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <HomeTextLayer
          style={{
            ...styles.title,
            position: "relative",
            mixBlendMode: "soft-light",
            zIndex: baseZIndex + 1,
          }}
        >
          {title}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.title,
            position: "absolute",
            opacity: 0.6,
            mixBlendMode: "revert",
            pointerEvents: "none",
            zIndex: baseZIndex + 1,
          }}
        >
          {title}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.title,
            position: "absolute",
            mixBlendMode: "revert",
            color: "var(--tw-text-color)",
            pointerEvents: "none",
            zIndex: baseZIndex,
          }}
        >
          {title}
        </HomeTextLayer>
      </div>
      <div className="relative">
        <HomeTextLayer
          style={{
            ...styles.description,
            position: "relative",
            mixBlendMode: "soft-light",
            zIndex: baseZIndex + 1,
          }}
        >
          {description}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.description,
            position: "absolute",
            opacity: 0.6,
            mixBlendMode: "revert",
            pointerEvents: "none",
            zIndex: baseZIndex + 1,
          }}
        >
          {description}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.description,
            position: "absolute",
            mixBlendMode: "revert",
            color: "var(--tw-text-color)",
            pointerEvents: "none",
            zIndex: baseZIndex,
          }}
        >
          {description}
        </HomeTextLayer>
      </div>
    </div>
  );
}
