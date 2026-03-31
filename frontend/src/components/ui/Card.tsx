import type { CSSProperties, ReactNode } from "react";
import { theme } from "../../theme/theme";

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Card({ children, className = "", style }: CardProps) {
  return (
    <div
      className={`card border-0 ${className}`}
      style={{
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        borderRadius: theme.radii.md,
        boxShadow: theme.shadows.md,
        border: "1px solid rgba(148, 163, 184, 0.10)",
        ...style,
      }}
    >
      <div className="card-body p-4">{children}</div>
    </div>
  );
}