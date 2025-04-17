import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tables, setTables] = useState<string[]>([]);
  const [vows, setVows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('checking...');

  useEffect(() => {
    async function checkSupabase() {
      try {
        // 1. Simple connection test
        const { data: testData, error: testError } = await supabase
          .from('vows')
          .select('*')
          .limit(1);
          
        if (testError && testError.code !== 'PGRST116') {
          console.error("Connection test error:", testError);
          // Try to identify if it's a table not found error
          if (testError.message.includes('does not exist')) {
            setError(`The 'vows' table doesn't exist yet. Please create it using the button below.`);
            setTables([]);
          } else {
            setError(`Connection error: ${testError.message}`);
          }
          setStatus('error');
        } else {
          console.log("Connection successful");
          setTables(['vows']);
          setStatus('success');
          
          // If we get here, try fetching a few records
          const { data: vowsData, error: vowsError } = await supabase
            .from('vows')
            .select('*')
            .limit(5);
            
          if (vowsError) {
            console.error("Error fetching vows:", vowsError);
          } else {
            setVows(vowsData || []);
          }
        }

        // 4. Check auth status
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
          setAuthStatus(`Auth error: ${authError.message}`);
        } else if (authData?.session) {
          setAuthStatus(`Logged in as: ${authData.session.user.email}`);
        } else {
          setAuthStatus('Not logged in');
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError(`Unexpected error: ${err.message}`);
        setStatus('error');
      }
    }

    checkSupabase();
  }, []);

  return (
    <div className="p-4 bg-gray-50 rounded-lg max-w-lg mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">Connection Status:</h3>
        <p className={`${status === 'loading' ? 'text-blue-500' : 
          status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {status === 'loading' ? 'Checking connection...' : 
           status === 'success' ? 'Connected successfully' : 'Connection failed'}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Auth Status:</h3>
        <p>{authStatus}</p>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="mb-4">
          <h3 className="font-semibold">Database Tables:</h3>
          <p className="text-green-600 font-semibold">The 'vows' table is accessible.</p>
          
          {vows.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Records in vows table: {vows.length}</h3>
              <div className="mt-2 text-xs">
                <div className="bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  <pre>{JSON.stringify(vows[0], null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 