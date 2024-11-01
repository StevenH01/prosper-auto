import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL and Anon Key must be provided!");
    return NextResponse.error(); // Return an error response if variables are missing
  }

  // Create a response object
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Set cookies on the request
          request.cookies.set(name, value);
          // Set cookies on the response
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    // Refreshing the auth token
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error);
      // Optionally handle errors, e.g., redirect or log out the user
    }

    // You can add any additional logic you need here based on the user's data
  } catch (err) {
    console.error("Error in updateSession:", err);
    return NextResponse.error(); // Return an error response on exception
  }

  return supabaseResponse;
}
