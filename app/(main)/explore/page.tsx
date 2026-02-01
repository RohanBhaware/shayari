import { ExploreContent } from "@/components/explore-content"
import { MOODS, LANGUAGES } from "@/lib/types"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User, Shayari, Follower, Like, Save } from "@/lib/models"

interface ExplorePageProps {
  searchParams: Promise<{ mood?: string; language?: string; q?: string }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams
  const user = await getUser()
  await connectDB()

  // Build query
  let query: any = {}

  if (params.mood) {
    query.mood = params.mood
  }

  if (params.language) {
    query.language = params.language
  }

  if (params.q) {
    query.content = { $regex: params.q, $options: 'i' }
  }

  const shayarisDocs = await Shayari.find(query)
    .sort({ created_at: -1 })
    .limit(50)
    .populate({ path: 'user_id', model: User, select: 'username display_name avatar_url' })
    .lean() as any[]

  // Get trending poets (aggregation)
  const trendingAggregation = await Follower.aggregate([
    { $group: { _id: '$following_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ])

  // Populate trending poets
  const trendingPoets = await Promise.all(trendingAggregation.map(async (item) => {
    const poet = await User.findById(item._id).lean() as any
    if (poet) {
      return {
        ...poet,
        _id: undefined,
        id: poet._id.toString(),
        followers_count: item.count
      }
    }
    return null
  }))

  const finalTrendingPoets = trendingPoets.filter(Boolean) as any[]

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

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Explore</h1>
          <p className="mt-1 text-muted-foreground">
            Discover shayaris and poets from around the world
          </p>
        </div>

        <ExploreContent
          shayaris={transformedShayaris}
          poets={finalTrendingPoets}
          moods={MOODS}
          languages={LANGUAGES}
          currentFilters={params}
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
