"use client";

import HomeTextLayer from "./HomeTextLayer";

const styles = {
  title: {
    fontWeight: 600,
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
    pb: "0.1em",
    margin: "0px",
  },
  description: {
    fontSize: "1.1rem",
    fontWeight: 500,
    lineHeight: 1.6,
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
            color: "#FFFFFF",
            zIndex: baseZIndex + 1,
          }}
          className="text-[2rem] sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem]"
        >
          {title}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.title,
            position: "absolute",
            opacity: 0.2,
            mixBlendMode: "revert",
            pointerEvents: "none",
            color: "#FFFFFF",
            zIndex: baseZIndex + 1,
          }}
          className="text-[2rem] sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem]"
        >
          {title}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.title,
            position: "absolute",
            mixBlendMode: "revert",
            color: "#000000",
            pointerEvents: "none",
            zIndex: baseZIndex,
          }}
          className="text-[2rem] sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem]"
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
            color: "#FFFFFF",
            zIndex: baseZIndex + 1,
          }}
        >
          {description}
        </HomeTextLayer>
        <HomeTextLayer
          style={{
            ...styles.description,
            position: "absolute",
            opacity: 0.3,
            mixBlendMode: "revert",
            pointerEvents: "none",
            color: "#FFFFFF",
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
            color: "#000000",
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
