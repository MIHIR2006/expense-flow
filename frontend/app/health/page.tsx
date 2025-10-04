export default function HealthPage() {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    service: 'ExpenseFlow Frontend'
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Health Check</h1>
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
          <pre className="text-left text-sm">
            {JSON.stringify(healthData, null, 2)}
          </pre>
        </div>
        <p className="mt-4 text-gray-400">
          Service is running normally
        </p>
      </div>
    </div>
  );
}
