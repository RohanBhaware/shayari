import { notFound } from "next/navigation"
import { ShayariDetail } from "@/components/shayari-detail"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Shayari, Comment, Like, Save, User } from "@/lib/models"

interface ShayariPageProps {
  params: Promise<{ id: string }>
}

export default async function ShayariPage({ params }: ShayariPageProps) {
  const { id } = await params
  const user = await getUser()
  await connectDB()

  // Get shayari with profile
  // Need valid ObjectId check? Mongoose throws if id is invalid.
  // We should try catch or check format.

  let shayariDoc: any = null;
  try {
    shayariDoc = await Shayari.findById(id)
      .populate({ path: 'user_id', model: User, select: 'username display_name avatar_url' })
      .lean()
  } catch (e) {
    notFound()
  }

  if (!shayariDoc) {
    notFound()
  }

  // Get comments
  const commentsDocs = await Comment.find({ shayari_id: id })
    .sort({ created_at: 1 })
    .populate({ path: 'user_id', model: User, select: 'username display_name avatar_url' })
    .lean() as any[]

  // Get user's like and save status
  let isLiked = false
  let isSaved = false

  if (user) {
    const [likeResult, saveResult] = await Promise.all([
      Like.findOne({ user_id: user.id, shayari_id: id }),
      Save.findOne({ user_id: user.id, shayari_id: id }),
    ])
    isLiked = !!likeResult
    isSaved = !!saveResult
  }

  const transformedShayari = {
    ...shayariDoc,
    _id: undefined,
    __v: undefined,
    user_id: undefined,
    id: shayariDoc._id.toString(),
    created_at: shayariDoc.created_at.toISOString(),
    profiles: {
      id: shayariDoc.user_id._id.toString(),
      username: shayariDoc.user_id.username,
      display_name: shayariDoc.user_id.display_name,
      avatar_url: shayariDoc.user_id.avatar_url
    },
    likes_count: shayariDoc.likes_count || 0,
    comments_count: shayariDoc.comments_count || commentsDocs.length,
    is_liked: isLiked,
    is_saved: isSaved,
  }

  const transformedComments = commentsDocs.map(c => ({
    ...c,
    _id: undefined,
    __v: undefined,
    user_id: undefined,
    shayari_id: undefined,
    id: c._id.toString(),
    created_at: c.created_at.toISOString(),
    profiles: {
      id: c.user_id._id.toString(),
      username: c.user_id.username,
      display_name: c.user_id.display_name,
      avatar_url: c.user_id.avatar_url
    }
  }))

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ShayariDetail
          shayari={transformedShayari}
          comments={transformedComments || []}
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
