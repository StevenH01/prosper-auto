"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Make sure to import cookies

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const cookieStore = cookies(); // Get the cookie store
  const supabase = createClient(cookieStore); // Pass it to createClient

  // Type-casting here for convenience
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signup(formData: FormData) {
  const cookieStore = cookies(); // Get the cookie store
  const supabase = createClient(cookieStore); // Pass it to createClient

  // Type-casting here for convenience
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
