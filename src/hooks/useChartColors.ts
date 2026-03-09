import { useTheme } from "next-themes";
import { useMemo } from "react";

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(() => ({
    grid: isDark ? "hsl(160,10%,18%)" : "hsl(150,6%,86%)",
    axis: isDark ? "hsl(150,10%,55%)" : "hsl(150,5%,42%)",
    tooltipBg: isDark ? "hsl(160,12%,9%)" : "hsl(0,0%,100%)",
    tooltipBorder: isDark ? "hsl(120,100%,62%,0.3)" : "hsl(150,6%,86%)",
    tooltipText: isDark ? "hsl(150,20%,95%)" : "hsl(160,10%,10%)",
    primary: isDark ? "hsl(120,100%,62%)" : "hsl(120,100%,32%)",
    secondary: isDark ? "hsl(160,70%,45%)" : "hsl(160,70%,35%)",
    accent: isDark ? "hsl(200,80%,55%)" : "hsl(200,80%,45%)",
  }), [isDark]);
}
