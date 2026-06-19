"use client";

import { useEffect, useState } from "react";

/** Client-only reference id (avoids a Date.now() server/client hydration mismatch on the
 * static /thank-you page). */
export function RefId() {
  const [id, setId] = useState("");
  useEffect(() => {
    setId(`SAB-${Date.now().toString().slice(-6)}`);
  }, []);
  return <>{id}</>;
}
