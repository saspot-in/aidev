import { useEffect, useState } from "react";
import { HealthResponse } from "@__PROJECT_NAME__/contract";

export function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((json) => setStatus(HealthResponse.parse(json).status))
      .catch(() => setStatus("api unreachable"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-semibold">__PROJECT_NAME__</h1>
      <p className="text-muted-foreground">api: {status}</p>
    </main>
  );
}
