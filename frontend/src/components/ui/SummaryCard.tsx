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

      <div className="d-flex flex-column justify-content-between h-100 gap-2">
        <div>
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
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              lineHeight: 1.15,
              wordBreak: "break-word",
            }}
          >
            {value}
          </div>
        </div>

        {subtitle && (
          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </Card>
  );
}