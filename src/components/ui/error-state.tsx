"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  const { t } = useLanguage();

  const displayTitle = title || t.errorState.title;
  const displayMessage = message || t.errorState.message;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
      <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
        <AlertCircle className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-foreground">{displayTitle}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
        {displayMessage}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          {t.errorState.retry}
        </Button>
      )}
    </div>
  );
}

