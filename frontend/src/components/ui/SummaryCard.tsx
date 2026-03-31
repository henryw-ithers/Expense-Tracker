import { Card } from "./Card";
import { theme } from "../../theme/theme";

type SummaryCardTone = "positive" | "negative" | "neutral";

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: SummaryCardTone;
};

export function SummaryCard({
  title,
  value,
  subtitle,
  tone = "neutral",
}: SummaryCardProps) {
  const accentColor =
    tone === "positive"
      ? theme.colors.accent
      : tone === "negative"
      ? theme.colors.secondary
      : theme.colors.primary;

  return (
    <Card className="h-100 summary-card">
      <div
        style={{
          height: "4px",
          width: "100%",
          backgroundColor: accentColor,
          borderRadius: theme.radii.sm,
          marginBottom: theme.spacing.md,
        }}
      />

      <div className="d-flex flex-column h-100">
        <div
          style={{
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.medium,
            color: theme.colors.textMuted,
            marginBottom: theme.spacing.sm,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "clamp(1.4rem, 3vw, 1.85rem)",
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            lineHeight: 1.1,
            wordBreak: "break-word",
            marginBottom: theme.spacing.sm,
          }}
        >
          {value}
        </div>

        {subtitle && (
          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
              marginTop: "auto",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </Card>
  );
}