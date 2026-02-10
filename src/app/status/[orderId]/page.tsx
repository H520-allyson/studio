import StatusPageClient from "./StatusPageClient";

/**
 * For a static export (output: 'export'), all dynamic paths must be known at build time.
 * This function provides example IDs so the build succeeds.
 */
export async function generateStaticParams() {
  // In a production app with static export, you might fetch all existing IDs.
  // For this prototype, we provide sample IDs to ensure the 'out' folder is generated.
  return [
    { orderId: "SAMPLE1" },
    { orderId: "SAMPLE2" }
  ];
}

export default function StatusPage() {
  return <StatusPageClient />;
}
