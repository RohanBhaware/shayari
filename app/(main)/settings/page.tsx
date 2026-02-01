import React from "react"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  await connectDB()
  const profileDoc = await User.findById(user.id).lean() as any

  if (!profileDoc) {
    redirect("/auth/login")
  }

  const profile = {
    ...profileDoc,
    _id: undefined,
    __v: undefined,
    password: undefined,
    id: profileDoc._id.toString(),
    created_at: profileDoc.created_at.toISOString(),
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <SettingsForm initialProfile={profile} />
    </div>
  )
}
