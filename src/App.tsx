import VowForm from './components/VowForm';
import SupabaseTest from './components/SupabaseTest';
import CreateVowsTable from './components/CreateVowsTable';
import SupabaseTableSchema from './components/SupabaseTableSchema';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [showDebug, setShowDebug] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Check for connection issues on load
  useEffect(() => {
    async function checkConnection() {
      try {
        // Basic connection check
        const { error } = await supabase.from('vows').select('id').limit(1);
        
        // If we get a "table doesn't exist" error, that's still a successful connection
        if (error && !error.message.includes('does not exist')) {
          console.error("Supabase connection issue detected:", error);
          setConnectionError(true);
          // Show debug panel automatically when there are connection issues
          setShowDebug(true);
        }
      } catch (err) {
        console.error("Fatal Supabase connection error:", err);
        setConnectionError(true);
        setShowDebug(true);
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Vow Submission Form</h1>
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className={`text-sm px-3 py-1 rounded ${
            connectionError 
              ? "bg-red-200 hover:bg-red-300 text-red-800" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {showDebug ? 'Hide Debug' : connectionError ? '⚠️ Show Debug (Connection Issues)' : 'Show Debug'}
        </button>
      </div>

      {connectionError && !showDebug && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">⚠️ Supabase Connection Issues Detected</h3>
          <p className="mb-2">There seem to be problems connecting to your Supabase backend.</p>
          <button 
            onClick={() => setShowDebug(true)}
            className="underline text-red-600 hover:text-red-800"
          >
            Click here to show debug tools
          </button>
        </div>
      )}

      {showDebug && (
        <div className="space-y-4 mb-6">
          <SupabaseTest />
          <SupabaseTableSchema />
          <CreateVowsTable />
        </div>
      )}
      
      <VowForm />
    </div>
  )
}

export default App 