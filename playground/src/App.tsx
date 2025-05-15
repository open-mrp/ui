import { WaveShader } from "@augno/ui";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <WaveShader
        skew="bottom"
        height={600}
        minWidth={400}
        maintainHeight={0.3}
        seed={16192}
        colorConfiguration="default"
      />
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Component Playground</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Add your components here */}
          <p className="text-gray-600">
            Start adding your components to visualize them here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
