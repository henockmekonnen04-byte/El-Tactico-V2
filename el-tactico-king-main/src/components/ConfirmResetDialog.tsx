import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ConfirmResetDialogProps {
  onConfirm: () => void;
  triggerText?: string;
  triggerVariant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ConfirmResetDialog = ({
  onConfirm,
  triggerText = "Start Over",
  triggerVariant = "outline",
  triggerSize = "sm",
  className = ""
}: ConfirmResetDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={className}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start Over?</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all your progress and return you to the beginning. 
            Your current draft and any saved data will be lost. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes, Start Over
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmResetDialog;

