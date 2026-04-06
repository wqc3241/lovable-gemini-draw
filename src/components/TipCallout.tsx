import { AlertCircle, Info, Lightbulb } from "lucide-react";

interface TipCalloutProps {
  children: React.ReactNode;
  variant?: "tip" | "warning" | "info";
}

export function TipCallout({ children, variant = "tip" }: TipCalloutProps) {
  const variants = {
    tip: {
      icon: Lightbulb,
      bg: "bg-primary/5",
      border: "border-primary/15",
      text: "text-primary",
    },
    warning: {
      icon: AlertCircle,
      bg: "bg-destructive/5",
      border: "border-destructive/15",
      text: "text-destructive",
    },
    info: {
      icon: Info,
      bg: "bg-primary/5",
      border: "border-primary/15",
      text: "text-primary",
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
