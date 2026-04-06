import { Card } from "@/components/ui/card";

interface GuideStepProps {
  stepNumber: number;
  title: string;
  description: string;
  screenshotDescription?: string;
  tips?: string[];
  children?: React.ReactNode;
}

export function GuideStep({ 
  stepNumber, 
  title, 
  description, 
  screenshotDescription,
  tips,
  children 
}: GuideStepProps) {
  return (
    <div className="mb-12">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full ai-pulse flex items-center justify-center text-primary-foreground font-bold shadow-glow">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      
      {screenshotDescription && (
        <Card className="p-6 bg-muted/50 border-0 mb-4 ml-14">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded ai-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">Screenshot Preview</span>
          </div>
          <p className="text-sm text-muted-foreground italic">{screenshotDescription}</p>
        </Card>
      )}
      
      {children && (
        <div className="ml-14 mb-4">
          {children}
        </div>
      )}
      
      {tips && tips.length > 0 && (
        <div className="ml-14 space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
              <span className="text-lg">💡</span>
              <p className="text-sm text-foreground">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
