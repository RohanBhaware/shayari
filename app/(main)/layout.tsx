import React from "react"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  await connectDB()

  // Get user profile
  const profileDoc = await User.findById(user.id).lean() as any

  const profile = profileDoc ? {
    ...profileDoc,
    _id: undefined,
    id: profileDoc._id.toString(),
    created_at: profileDoc.created_at.toISOString(),
  } : null

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={user} profile={profile} />
      <main className="flex-1 lg:pl-64">
        {children}
      </main>
    </div>
  )
}
