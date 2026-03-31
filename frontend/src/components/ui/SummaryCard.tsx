import { Card } from "./Card";
import { theme } from "../../theme/theme";

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function SummaryCard({ title, value, subtitle }: SummaryCardProps) {
  return (
    <Card className="h-100">
      <div className="d-flex flex-column gap-2">
        <span
          style={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textMuted,
            fontWeight: theme.fontWeights.medium,
          }}
        >
          {title}
        </span>

        <span
          style={{
            fontSize: theme.fontSizes.xl,
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
          }}
        >
          {value}
        </span>

        {subtitle && (
          <span
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </Card>
  );
}