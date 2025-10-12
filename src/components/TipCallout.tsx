import { AlertCircle, Info, Lightbulb } from "lucide-react";

interface TipCalloutProps {
  children: React.ReactNode;
  variant?: "tip" | "warning" | "info";
}

export function TipCallout({ children, variant = "tip" }: TipCalloutProps) {
  const variants = {
    tip: {
      icon: Lightbulb,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    warning: {
      icon: AlertCircle,
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-600 dark:text-orange-400",
    },
    info: {
      icon: Info,
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-600 dark:text-purple-400",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${config.bg} ${config.border}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
      <div className="flex-1 text-sm text-foreground">{children}</div>
    </div>
  );
}
