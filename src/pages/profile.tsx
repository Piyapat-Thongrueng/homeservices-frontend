import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/components/common/Navbar"
import { useAuth } from "@/contexts/AuthContext"
import { useRequireAuth } from "@/contexts/useRequireAuth"

export default function ProfilePage() {

  const router = useRouter()
  const { user, loading } = useRequireAuth()
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)


  // LOAD USER
  useEffect(() => {

    if (loading) return

    if (!user) {

      router.replace("/auth/login")

      return
    }

    // รองรับ Google + Facebook + email login
    setEmail(user.email || "")

    setName(
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      ""
    )

    setUsername(
      user.user_metadata?.username ||
      ""
    )

    setAvatarUrl(
      user.user_metadata?.avatar_url ||
      null
    )

  }, [user, loading, router])



  // SELECT AVATAR
  const handleSelectAvatar = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setPreviewUrl(URL.createObjectURL(file))
  }



  // SAVE PROFILE
  const handleSave = async () => {

    if (!user) return
    if (saving) return

    setSaving(true)

    try {

      let finalAvatarUrl = avatarUrl


      // upload avatar
      if (selectedFile) {

        const fileExt =
          selectedFile.name.split(".").pop()

        const fileName =
          `${user.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } =
          await supabase.storage
            .from("avatars-picture")
            .upload(fileName, selectedFile, {
              cacheControl: "3600",
              upsert: true,
            })

        if (uploadError) throw uploadError

        const { data } =
          supabase.storage
            .from("avatars-picture")
            .getPublicUrl(fileName)

        finalAvatarUrl = data.publicUrl

        setAvatarUrl(finalAvatarUrl)

        setSelectedFile(null)

        if (previewUrl)
          URL.revokeObjectURL(previewUrl)

        setPreviewUrl(null)

      }



      // update user metadata
      const { error } =
        await supabase.auth.updateUser({
          data: {
            name,
            username,
            avatar_url: finalAvatarUrl
          }
        })

      if (error) throw error


      alert("บันทึกข้อมูลสำเร็จ ✅")

    }
    catch (err) {

      console.error(err)

      alert("เกิดข้อผิดพลาด ❌")

    }
    finally {

      setSaving(false)

    }

  }



  // loading screen
  if (loading || !user) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  }


  const displayAvatar =
    previewUrl || avatarUrl



  return (

    <div className="min-h-screen bg-[#F9FAFB]">

      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">


        {/* SIDEBAR */}
        <div className="w-full md:w-[260px] bg-[#F2F4F7] rounded-xl p-5">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">

              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {name?.charAt(0).toUpperCase()}
                </div>
              )}

            </div>

            <div>
              <div className="font-semibold text-[15px]">
                {name}
              </div>
              <div className="text-[13px] text-gray-500">
                Member
              </div>
            </div>

          </div>


          <div className="space-y-2">

            <div className="bg-white rounded-lg px-3 py-2 font-medium">
              Profile
            </div>

            <div
              onClick={() =>
                router.push("/reset-password")
              }
              className="px-3 py-2 text-gray-600 hover:bg-white rounded-lg cursor-pointer"
            >
              Reset password
            </div>

          </div>

        </div>



        {/* CONTENT */}
        <div className="flex-1 bg-[#F2F4F7] rounded-xl p-6 flex justify-center">

          <div className="w-full max-w-[420px] bg-white rounded-xl p-6">

            <h2 className="text-center text-[20px] font-semibold mb-6">
              Profile
            </h2>


            {/* AVATAR */}
            <div className="flex flex-col items-center mb-6">

              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 mb-3">

                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                    {name?.charAt(0).toUpperCase()}
                  </div>
                )}

              </div>

              <label className="text-[13px] bg-gray-100 px-4 py-1 rounded-full hover:bg-gray-200 cursor-pointer">

                Select new picture

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectAvatar}
                  className="hidden"
                />

              </label>

            </div>


            <div className="mb-4">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full h-[44px] px-3 border rounded-lg"
              />
            </div>


            <div className="mb-4">
              <label>Username</label>
              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full h-[44px] px-3 border rounded-lg"
              />
            </div>


            <div className="mb-6">
              <label>Email</label>
              <input
                value={email}
                disabled
                className="w-full h-[44px] px-3 border rounded-lg bg-gray-100"
              />
            </div>


            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full h-[44px] flex items-center justify-center gap-2 mb-3"
            >
              {saving ? "Saving..." : "Save"}
            </button>

          </div>

        </div>

      </div>

    </div>

  )

}