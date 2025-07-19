import { useRb2b } from "@/hooks/useRb2b";

// Example component showing how to use RB2B tracking
export default function RB2BTrackingExample() {
  const { isAvailable, identify, track } = useRb2b();

  // Example: Track when user clicks a specific button
  const handleCTAClick = () => {
    track({
      event: "cta_clicked",
      button: "newsletter_signup",
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  };

  // Example: Identify user when they provide email
  const handleEmailSubmit = (email: string) => {
    identify({
      email,
      source: "newsletter_signup",
      page: window.location.pathname,
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">RB2B Tracking Status</h3>
      <p className="mb-4">
        Status:{" "}
        {isAvailable ? (
          <span className="text-green-600">✅ Active</span>
        ) : (
          <span className="text-yellow-600">⏳ Loading...</span>
        )}
      </p>

      <div className="space-y-2">
        <button
          onClick={handleCTAClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Track CTA Click
        </button>

        <button
          onClick={() => handleEmailSubmit("user@example.com")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Identify User
        </button>
      </div>
    </div>
  );
}
