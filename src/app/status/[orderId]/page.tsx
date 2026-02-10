import StatusPageClient from "./StatusPageClient";

/**
 * Mock function to satisfy generateStaticParams requirements for static export.
 * In a production app, this would fetch active IDs from Firestore during build time.
 */
async function getAllOrderIds() {
  // Static export requires known paths at build time.
  // We return a few sample IDs to ensure the dynamic route is recognized.
  return ["SAMPLE-123", "DEMO-456"];
}

export async function generateStaticParams() {
  const ids = await getAllOrderIds();
  return ids.map((id) => ({
    orderId: id,
  }));
}

export default function StatusPage() {
  return <StatusPageClient />;
}
