export interface DocPageHeaderProps {
  title: string;
  subtitle: string;
}
export default function DocPageHeader({ title, subtitle }: DocPageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 pb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 300,
          letterSpacing: "0.01em",
          padding: "0px",
        }}
      >
        {subtitle}
      </h2>
    </div>
  );
}
