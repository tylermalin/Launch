/**
 * The global header and footer now render on every route (including /sensors),
 * so this is a passthrough. Kept as a seam in case a future route needs its own
 * standalone chrome.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
