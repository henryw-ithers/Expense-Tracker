import type { CSSProperties, ReactNode } from "react";
import { theme } from "../../theme/theme";

type SectionTitleProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function SectionTitle({
  children,
  className = "",
  style,
}: SectionTitleProps) {
  return (
    <h2
      className={`mb-3 ${className}`}
      style={{
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}