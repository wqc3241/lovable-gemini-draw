import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: "credit_limit" | "model_restricted" | "batch_restricted";
}

const messages = {
  credit_limit: {
    title: "Credits Exhausted",
    description: "You've used all your monthly credits. Upgrade to Pro for 150 credits/month or Premium for 500 credits/month.",
  },
  model_restricted: {
    title: "Model Not Available",
    description: "This AI model is only available on Pro and Premium plans. Upgrade to access all models.",
  },
  batch_restricted: {
    title: "Batch Size Limited",
    description: "Your current plan limits batch size. Upgrade for larger batches.",
  },
};

const UpgradeDialog = ({ open, onOpenChange, reason }: UpgradeDialogProps) => {
  const navigate = useNavigate();
  const { title, description } = messages[reason];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={() => { onOpenChange(false); navigate("/pricing"); }}>
            View Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
