import type { ReactNode } from "react";
import { theme } from "../../theme/theme";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main
      className="container-fluid py-4 px-3 px-md-4"
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        {children}
      </div>
    </main>
  );
}