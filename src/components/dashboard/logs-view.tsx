"use client";

import { useEffect, useRef, useState } from "react";

const INITIAL_LOGS = [
  "[12:30:01] INFO: Initializing container...",
  "[12:30:03] INFO: Loading environment variables...",
  "[12:30:05] INFO: Connecting to database...",
  "[12:30:06] SUCCESS: Database connected.",
  "[12:30:07] INFO: Starting server on port 3000...",
  "[12:30:08] SUCCESS: Server is ready!",
];

export function LogsView() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLine = `[${new Date().toLocaleTimeString()}] INFO: GET /api/health - 200 OK (${Math.floor(Math.random() * 50)}ms)`;
      setLogs((prev) => [...prev.slice(-49), newLine]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0f1117] text-[#e0e1e6] font-mono text-sm p-4 rounded-xl border border-[#334155] h-[500px] overflow-y-auto" ref={scrollRef}>
      {logs.map((log, i) => (
        <div key={i} className="mb-1 leading-relaxed">
          <span className="text-primary/70 mr-2">$</span>
          {log}
        </div>
      ))}
    </div>
  );
}
