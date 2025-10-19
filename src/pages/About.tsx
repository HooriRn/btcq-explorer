export const About = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About BTCQ Risk Dashboard</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-4">
            The BTCQ Risk Dashboard is a comprehensive tool for monitoring Bitcoin addresses and identifying potential security risks in the blockchain.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Real-time monitoring of Bitcoin addresses</li>
            <li>Risk assessment and classification</li>
            <li>Transaction tracking and analysis</li>
            <li>Block height monitoring</li>
            <li>Search functionality for addresses and blocks</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Frontend</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>React 19</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React Router DOM</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">State Management</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>Zustand</li>
                <li>Custom Hooks</li>
                <li>Mock API Services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
