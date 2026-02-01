import { FeedContent } from "@/components/feed-content"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Shayari, Follower, Like, Save, User } from "@/lib/models"

// Force dynamic since we read cookies
export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const user = await getUser()
  await connectDB()

  let userIds: string[] = []

  if (user) {
    const following = await Follower.find({ follower_id: user.id }).select('following_id')
    const followingIds = following.map(f => f.following_id.toString())
    userIds = [user.id, ...followingIds]
  }

  // If we have users to filter by, use them. Otherwise (guest or no following), separate logic?
  // Original logic: "plus their own". If no user, userIds is empty.
  // "If no following, show all recent shayaris" -> Wait, original code said:
  // "const userIds = user?.id ? [user.id, ...followingIds] : followingIds"
  // If userIds.length > 0 query.in...
  // So if guest, userIds is empty, we show all.

  let query: any = {}
  if (userIds.length > 0) {
    query = { user_id: { $in: userIds } }
  }

  const shayarisDocs = await Shayari.find(query)
    .sort({ created_at: -1 })
    .limit(50)
    .populate({ path: 'user_id', model: User, select: 'username display_name avatar_url' })
    .lean() as any[]

  // Get user's likes and saves
  let userLikes: string[] = []
  let userSaves: string[] = []

  if (user) {
    const [likesResult, savesResult] = await Promise.all([
      Like.find({ user_id: user.id }).select('shayari_id'),
      Save.find({ user_id: user.id }).select('shayari_id'),
    ])
    userLikes = likesResult.map(l => l.shayari_id.toString())
    userSaves = savesResult.map(s => s.shayari_id.toString())
  }

  // Transform data
  const transformedShayaris = shayarisDocs.map((s) => ({
    ...s,
    _id: undefined,
    __v: undefined,
    user_id: s.user_id._id.toString(),
    id: s._id.toString(), // critical: convert _id to string id
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

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Your Feed</h1>
          <p className="mt-1 text-muted-foreground">
            Shayaris from poets you follow
          </p>
        </div>

        <FeedContent
          initialShayaris={transformedShayaris}
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
