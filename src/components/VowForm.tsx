import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "../lib/supabase"; // Adjust the path if different

export default function VowForm() {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (form: any) => {
    setMessage("Submitting...");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    const { error } = await supabase.from("vows").insert({
      user_id: user?.id ?? null,
      first_name: form.firstName,
      surname: form.surname,
      phone: form.phone,
      email: form.email,
      amount: parseFloat(form.amount),
      chapter: form.chapter,
      country: form.country,
      state: form.state,
      purpose: form.purpose,
    });

    if (error) {
      console.error(error);
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage("✅ Vow submitted successfully!");
      reset();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("firstName")} placeholder="First Name" className="w-full border p-2" />
        <input {...register("surname")} placeholder="Surname" className="w-full border p-2" />
        <input {...register("phone")} placeholder="Phone" className="w-full border p-2" />
        <input {...register("email")} placeholder="Email" className="w-full border p-2" />
        <input type="number" {...register("amount")} placeholder="Amount" className="w-full border p-2" />
        <input {...register("chapter")} placeholder="Dominion City Chapter" className="w-full border p-2" />
        <input {...register("country")} placeholder="Country" className="w-full border p-2" />
        <input {...register("state")} placeholder="State" className="w-full border p-2" />
        <input {...register("purpose")} placeholder="Purpose" className="w-full border p-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit Vow</button>
      </form>
    </div>
  );
} 