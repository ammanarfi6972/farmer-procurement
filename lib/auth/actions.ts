"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// For demo purposes, we map mobile numbers to a dummy email to use Supabase password auth
const MOCK_DOMAIN = "@mock.kisanmitra.in";
const DEMO_PASSWORD = "DemoPassword123!";

function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      cookies: {
        getAll() { return []; },
        setAll() { },
      },
    }
  );
}

export async function requestFarmerOTP(formData: FormData) {
  const mobile = formData.get("mobile") as string;
  
  if (!mobile || mobile.length < 10) {
    return { error: "Please enter a valid mobile number." };
  }

  const email = `${mobile}${MOCK_DOMAIN}`;
  const supabaseAdmin = getAdminClient();

  if (!supabaseAdmin) {
    return { error: "Configuration Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local. Required for demo mock provisioning." };
  }

  // In a real app, this sends an SMS. Here, we ensure the mock user exists.
  const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(email).catch(() => ({ data: null })); // getUserById takes UUID, actually we need to search or just try to create.
  
  // Easier to just try to create, if it fails because it exists, that's fine.
  const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });

  if (error && error.code !== "user_already_exists") {
    console.error("Error ensuring mock user exists:", error);
  }

  // Create a profile if this is a newly created user
  if (authData?.user) {
    await supabaseAdmin.from("profiles").upsert({
      id: authData.user.id,
      full_name: `Farmer ${mobile.slice(-4)}`,
      mobile: mobile,
      role: 'farmer'
    }, { onConflict: 'id' });
  }

  // Simulate SMS delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return { success: true, message: "Mock OTP sent. Use 123456 to verify." };
}

export async function verifyFarmerOTP(formData: FormData) {
  const mobile = formData.get("mobile") as string;
  const otp = formData.get("otp") as string;

  if (otp !== "123456") {
    return { error: "Invalid OTP. Use 123456 for the demo." };
  }

  const email = `${mobile}${MOCK_DOMAIN}`;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: DEMO_PASSWORD,
  });

  if (error) {
    return { error: "Authentication failed." };
  }

  redirect("/farmer");
}

export async function loginOfficial(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // DEMO MOCK PROVISIONING FOR STAFF
  const isDemoEmail = email.includes("@kisanmitra") || email.includes("@test.com");
  if (process.env.NEXT_PUBLIC_IS_DEMO_ENVIRONMENT === "true" && isDemoEmail) {
    const supabaseAdmin = getAdminClient();
    if (supabaseAdmin) {
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      }).catch(() => null); // ignore if exists
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("signInWithPassword failed:", error);
    return { error: "Invalid credentials." };
  }
  console.log("signInWithPassword succeeded:", data?.user?.id);

  // Ensure profile has correct role
  const isDemoEmailPostLogin = email.includes("@kisanmitra") || email.includes("@test.com");
  if (process.env.NEXT_PUBLIC_IS_DEMO_ENVIRONMENT === "true" && isDemoEmailPostLogin && data?.user) {
    const supabaseAdmin = getAdminClient();
    console.log("Demo environment detected. Updating profile for:", email);
    if (supabaseAdmin) {
      let role = 'centre_staff';
      if (email.startsWith("admin")) {
         role = 'district_admin';
      } else if (email.startsWith("manager")) {
         role = 'centre_manager';
      }
      
      const { data: upsertData, error: upsertError } = await supabaseAdmin.from("profiles").upsert({
        id: data.user.id,
        full_name: `Demo ${email.split('@')[0]}`,
        role: role
      }, { onConflict: 'id' });
      
      if (upsertError) {
         console.error("Profile Upsert Error:", upsertError);
      } else {
         console.log("Profile Upsert Success!");
      }
    } else {
      console.log("supabaseAdmin is null");
    }
  } else {
    console.log("Skipping profile upsert. Env:", process.env.NEXT_PUBLIC_IS_DEMO_ENVIRONMENT, "Email:", email, "User:", !!data?.user);
  }

  if (email.startsWith("demo")) {
    redirect("/demo");
  } else if (email.startsWith("admin")) {
    redirect("/admin");
  } else {
    redirect("/manager");
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
