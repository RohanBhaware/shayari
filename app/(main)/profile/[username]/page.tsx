import { notFound } from "next/navigation"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileShayaris } from "@/components/profile-shayaris"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User, Shayari, Follower, Like, Save } from "@/lib/models"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const currentUser = await getUser()
  await connectDB()

  // Get profile by username
  const profileDoc = await User.findOne({ username }).lean() as any

  if (!profileDoc) {
    notFound()
  }

  const profileId = profileDoc._id.toString()
  const currentUserId = currentUser?.id

  // Get user stats
  const [shayarisCount, followersCount, followingCount] = await Promise.all([
    Shayari.countDocuments({ user_id: profileId }),
    Follower.countDocuments({ following_id: profileId }),
    Follower.countDocuments({ follower_id: profileId }),
  ])

  const stats = {
    shayaris: shayarisCount,
    followers: followersCount,
    following: followingCount,
  }

  // Check if current user is following
  let isFollowing = false
  if (currentUserId && currentUserId !== profileId) {
    const followRecord = await Follower.findOne({ follower_id: currentUserId, following_id: profileId })
    isFollowing = !!followRecord
  }

  // Get user's shayaris
  const shayarisDocs = await Shayari.find({ user_id: profileId })
    .sort({ created_at: -1 })
    .populate({ path: 'user_id', model: User, select: 'username display_name avatar_url' })
    .lean() as any[]

  // Get currentUser's likes and saves
  let userLikes: string[] = []
  let userSaves: string[] = []

  if (currentUserId) {
    const [likesResult, savesResult] = await Promise.all([
      Like.find({ user_id: currentUserId }).select('shayari_id'),
      Save.find({ user_id: currentUserId }).select('shayari_id'),
    ])
    userLikes = likesResult.map(l => l.shayari_id.toString())
    userSaves = savesResult.map(s => s.shayari_id.toString())
  }

  const transformedShayaris = shayarisDocs.map((s) => ({
    ...s,
    _id: undefined,
    __v: undefined,
    user_id: s.user_id._id.toString(),
    id: s._id.toString(),
    created_at: s.created_at.toISOString(),
    profiles: {
      id: s.user_id._id.toString(),
      username: s.user_id.username,
      display_name: s.user_id.display_name,
      avatar_url: s.user_id.avatar_url
    },
    likes_count: s.likes_count || 0,
    comments_count: s.comments_count || 0,
    is_liked: userLikes.includes(s._id.toString()),
    is_saved: userSaves.includes(s._id.toString()),
  }))

  const profile = {
    ...profileDoc,
    _id: undefined,
    id: profileId,
    created_at: profileDoc.created_at.toISOString(),
  }

  const isOwnProfile = currentUserId === profileId

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ProfileHeader
          profile={profile}
          stats={stats}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          currentUserId={currentUserId}
        />

        <div className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
            Shayaris
          </h2>
          <ProfileShayaris
            shayaris={transformedShayaris}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  )
}
