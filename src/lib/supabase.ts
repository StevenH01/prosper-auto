import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Get unique vehicle makes
export async function getVehicleMakes() {
  const { data, error } = await supabase
    .from("vehicles")
    .select("make")
    .order("make", { ascending: true });
  if (error) throw error;

  // Convert Set back to an array explicitly
  return Array.from(new Set(data.map(item => item.make)));
}

// Get models based on selected make
export async function getVehicleModels(make: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("model")
    .eq("make", make)
    .order("model", { ascending: true });
  if (error) throw error;

  return Array.from(new Set(data.map(item => item.model)));
}

// Get years based on selected make & model
export async function getVehicleYears(make: string, model: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("year")
    .eq("make", make)
    .eq("model", model)
    .order("year", { ascending: false });
  if (error) throw error;

  return Array.from(new Set(data.map(item => item.year)));
}

export default supabase;
