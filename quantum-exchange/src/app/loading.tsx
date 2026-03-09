import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse" />
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
        </div>
        <p className="text-sm text-muted font-medium">Loading...</p>
      </div>
    </div>
  );
}
