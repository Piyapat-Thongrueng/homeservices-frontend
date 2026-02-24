import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

// server-side supabase (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const {
      full_name,
      email,
      password,
      phone,
      username
    } = req.body

    // validation
    if (!full_name || !email || !password || !phone || !username) {
      return res.status(400).json({
        error: "Missing required fields"
      })
    }

    if (password.length < 12) {
      return res.status(400).json({
        error: "Password must be at least 12 characters"
      })
    }

    // check email exists
    const { data: existingUser } =
      await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists"
      })
    }

    // create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })

    if (authError) {
      return res.status(400).json({
        error: authError.message
      })
    }

    // insert into users table
    const { error: insertError } =
      await supabase
        .from("users")
        .insert({
          auth_user_id: authData.user.id,
          email,
          full_name,
          phone,
          username,
          role: "user"
        })

    if (insertError) {
      return res.status(400).json({
        error: insertError.message
      })
    }

    return res.status(200).json({
      message: "Register success"
    })

  }
  catch (err: any) {

    return res.status(500).json({
      error: err.message
    })

  }

}