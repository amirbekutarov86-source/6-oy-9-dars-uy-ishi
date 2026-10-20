"use client";

import { useEffect, useState } from "react";

/** true after the first client render. Persisted store values are only shown after this, so server and browser HTML always match. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
