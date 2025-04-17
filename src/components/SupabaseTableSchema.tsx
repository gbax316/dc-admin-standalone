import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function SupabaseTableSchema() {
  const [status, setStatus] = useState<"checking" | "exists" | "missing" | "error">("checking");
  const [message, setMessage] = useState("Checking vows table...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkTable();
  }, []);

  async function checkTable() {
    try {
      // Try to select from the vows table
      const { data, error } = await supabase
        .from('vows')
        .select('*')
        .limit(1);
      
      if (error) {
        // If error contains "does not exist" the table is missing
        if (error.message.includes("does not exist")) {
          setStatus("missing");
          setMessage("The vows table doesn't exist");
        } else {
          setStatus("error");
          setMessage("Error checking vows table");
          setError(error.message);
        }
      } else {
        setStatus("exists");
        setMessage(`The vows table exists${data?.length ? ` with ${data.length} records` : ''}`);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage("Unexpected error");
      setError(err.message);
    }
  }

  const createTable = async () => {
    setStatus("checking");
    setMessage("Attempting to create vows table...");
    setError(null);

    try {
      // Try to insert a sample record
      const { error } = await supabase
        .from('vows')
        .insert({
          first_name: "Test",
          surname: "User",
          email: "test@example.com",
          phone: "1234567890",
          amount: 0,
          chapter: "Test",
          country: "Test",
          state: "Test",
          purpose: "Test"
        });

      if (error) {
        if (error.message.includes("does not exist")) {
          setStatus("missing");
          setMessage("Table doesn't exist and couldn't be created automatically");
          setError("Please ask your administrator to create the vows table");
        } else {
          setStatus("error");
          setMessage("Error creating table");
          setError(error.message);
        }
      } else {
        setStatus("exists");
        setMessage("Successfully created a test record!");
        setTimeout(() => checkTable(), 1000);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage("Unexpected error");
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 my-4">
      <h2 className="text-xl font-bold mb-4">Supabase Table Status</h2>
      
      <div className={`p-4 rounded ${
        status === "checking" ? "bg-blue-100 text-blue-700" :
        status === "exists" ? "bg-green-100 text-green-700" :
        status === "missing" ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700"
      }`}>
        <p className="font-medium">{message}</p>
        {error && <p className="mt-2 text-sm">{error}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={checkTable}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Again
        </button>
        
        {status === "missing" && (
          <button 
            onClick={createTable}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Test Record
          </button>
        )}
      </div>
    </div>
  );
} 