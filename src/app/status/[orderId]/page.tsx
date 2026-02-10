import StatusPageClient from "./StatusPageClient";

/**
 * For a static export, all dynamic paths must be known at build time.
 * This function pre-generates the pages for the provided order IDs.
 */
export async function generateStaticParams() {
  // In a production app, you would fetch all order IDs from Firestore here.
  // For this prototype, we return a few example IDs to ensure the build succeeds.
  return [
    { orderId: "SAMPLE-123" },
    { orderId: "DEMO-456" }
  ];
}

export default function StatusPage() {
  return <StatusPageClient />;
}
