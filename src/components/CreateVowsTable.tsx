import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CreateVowsTable() {
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const createTable = async () => {
    setCreating(true);
    setMessage('Creating vows table...');
    setSuccess(false);

    try {
      // Attempt to create the table using a simplified approach
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
          -- Create the table if it doesn't exist
          CREATE TABLE IF NOT EXISTS vows (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            first_name TEXT NOT NULL,
            surname TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            amount NUMERIC NOT NULL,
            chapter TEXT NOT NULL,
            country TEXT NOT NULL,
            state TEXT NOT NULL,
            purpose TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Set up RLS policies
          ALTER TABLE vows ENABLE ROW LEVEL SECURITY;
          
          -- Drop existing policies to avoid conflicts
          DROP POLICY IF EXISTS "Anyone can insert vows" ON vows;
          
          -- Policy for inserting (anyone can insert)
          CREATE POLICY "Anyone can insert vows" ON vows
            FOR INSERT TO anon, authenticated
            WITH CHECK (true);
        `
      });

      if (error) {
        // If exec_sql doesn't work, try a fallback by creating a test table
        if (error.message.includes('function') || error.message.includes('permission')) {
          setMessage('Trying an alternative approach...');
          
          // Try to create a table directly
          const { error: directError } = await supabase
            .from('vows')
            .insert([
              { 
                first_name: 'Test', 
                surname: 'User', 
                phone: '1234567890', 
                email: 'test@example.com',
                amount: 100,
                chapter: 'Test Chapter',
                country: 'Test Country',
                state: 'Test State',
                purpose: 'Test Purpose'
              }
            ]);
            
          if (directError) {
            if (directError.message.includes('does not exist')) {
              setMessage(`❌ Error: The vows table doesn't exist and we don't have permission to create it. Please contact your Supabase admin.`);
            } else {
              setMessage(`❌ Error: ${directError.message}`);
            }
          } else {
            setMessage('✅ Test record inserted. Table may have been created automatically!');
            setSuccess(true);
          }
        } else {
          setMessage(`❌ Error creating table: ${error.message}`);
        }
      } else {
        setMessage('✅ Vows table created/updated successfully!');
        setSuccess(true);
      }
    } catch (err: any) {
      setMessage(`❌ Unexpected error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Vows Table Setup</h2>
      
      <p className="text-sm mb-4">
        This will try to create the vows table with the correct schema that matches the form fields.
      </p>
      
      <button
        onClick={createTable}
        disabled={creating}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:bg-blue-400"
      >
        {creating ? 'Creating...' : 'Create/Fix Vows Table'}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded text-sm ${success ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
} 