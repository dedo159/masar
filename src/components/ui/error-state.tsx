import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "تعذّر تحميل البيانات",
  message = "حدث خطأ أثناء جلب البيانات من الخادم. يرجى المحاولة مجدداً.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
      <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
        <AlertCircle className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
