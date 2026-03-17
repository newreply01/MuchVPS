"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeployStatus({ status }: { status: "deploying" | "success" | "failed" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-xs font-bold uppercase tracking-wider">
      {status === "deploying" && (
        <>
          <Loader2 className="w-3 h-3 text-primary animate-spin" />
          <span className="text-primary">Deploying...</span>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Live</span>
        </>
      )}
      {status === "failed" && (
        <>
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="text-red-500">Failed</span>
        </>
      )}
    </div>
  );
}

export function DeploymentProgressBar() {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 10, ease: "linear" }}
        className="h-full bg-primary"
      />
    </div>
  );
}
