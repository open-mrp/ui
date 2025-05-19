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
}

export default function HomeTitle({ title, description }: HomeTitleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <HomeTextLayer
          style={{
            ...styles.title,
            position: "relative",
            mixBlendMode: "color-burn",
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
            mixBlendMode: "color-burn",
          }}
        >
          {description}
        </HomeTextLayer>
      </div>
    </div>
  );
}
