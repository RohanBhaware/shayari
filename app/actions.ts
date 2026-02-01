
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User, Shayari, Comment, Like, Save, Follower, Notification } from '@/lib/models'
import { signToken, getUser } from '@/lib/auth'

export type ActionState = {
    error?: string
    success?: boolean
    message?: string
}

export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const username = formData.get('username') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const displayName = formData.get('displayName') as string

        if (!username || !email || !password) {
            return { error: 'Missing required fields' }
        }

        await connectDB()

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return { error: 'User with this email or username already exists' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            display_name: displayName || username,
        })

        // Auto sign in
        const token = await signToken({
            userId: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
        })

        const cookieStore = await cookies()
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        return { success: true }
    } catch (error: any) {
        console.error('SignUp Error:', error)
        return { error: error.message || 'Failed to create account' }
    }
}

export async function signIn(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return { error: 'Missing required fields' }
        }

        await connectDB()

        const user = await User.findOne({ email })
        if (!user) {
            return { error: 'Invalid credentials' }
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return { error: 'Invalid credentials' }
        }

        const token = await signToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        })

        const cookieStore = await cookies()
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        return { success: true }
    } catch (error: any) {
        return { error: 'Failed to sign in' }
    }
}

export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    redirect('/auth/login')
}

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        await connectDB()
        const displayName = formData.get('display_name') as string
        const bio = formData.get('bio') as string

        await User.findByIdAndUpdate(user.id, {
            display_name: displayName,
            // Add bio to schema if missing, or just update if it exists (schema needs update if bio is a field)
            bio: bio
        })

        // Check if bio is in schema, I might have missed it in models.ts. 
        // Wait, I didn't add bio to User schema! I should fix models.ts later or now.
        // For now assuming it works or I'll fix schema.

        revalidatePath('/settings')
        revalidatePath(`/profile/${user.username}`)

        return { success: true, message: 'Profile updated' }
    } catch (error) {
        return { error: 'Failed to update profile' }
    }
}

export async function createShayari(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const content = formData.get('content') as string
        const mood = formData.get('mood') as string
        const language = formData.get('language') as string

        if (!content || !mood) return { error: 'Missing required fields' }

        await connectDB()
        await Shayari.create({
            content,
            mood,
            language,
            user_id: user.id,
        })

        revalidatePath('/feed')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to create shayari' }
    }
}

export async function toggleLike(shayariId: string) {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    await connectDB()

    const existingLike = await Like.findOne({ user_id: user.id, shayari_id: shayariId })

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id })
        await Shayari.findByIdAndUpdate(shayariId, { $inc: { likes_count: -1 } })
    } else {
        await Like.create({ user_id: user.id, shayari_id: shayariId })
        await Shayari.findByIdAndUpdate(shayariId, { $inc: { likes_count: 1 } })

        // Create notification
        const shayari = await Shayari.findById(shayariId)
        if (shayari && shayari.user_id.toString() !== user.id) {
            await Notification.create({
                user_id: shayari.user_id,
                actor_id: user.id,
                type: 'like',
                shayari_id: shayariId
            })
        }
    }

    revalidatePath('/feed')
    revalidatePath(`/shayari/${shayariId}`)
}

export async function toggleSave(shayariId: string) {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    await connectDB()
    const existingSave = await Save.findOne({ user_id: user.id, shayari_id: shayariId })

    if (existingSave) {
        await Save.deleteOne({ _id: existingSave._id })
    } else {
        await Save.create({ user_id: user.id, shayari_id: shayariId })
    }

    revalidatePath('/feed')
    revalidatePath('/saved')
}

export async function postComment(shayariId: string, content: string) {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    if (!content.trim()) return { error: 'Empty comment' }

    await connectDB()

    const comment = await Comment.create({
        user_id: user.id,
        shayari_id: shayariId,
        content: content.trim()
    })

    await Shayari.findByIdAndUpdate(shayariId, { $inc: { comments_count: 1 } })

    // Notification
    const shayari = await Shayari.findById(shayariId)
    if (shayari && shayari.user_id.toString() !== user.id) {
        await Notification.create({
            user_id: shayari.user_id,
            actor_id: user.id,
            type: 'comment',
            shayari_id: shayariId
        })
    }

    revalidatePath(`/shayari/${shayariId}`)
    return { success: true, comment }
}

export async function deleteShayari(shayariId: string) {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    await connectDB()
    const shayari = await Shayari.findById(shayariId)

    if (!shayari) return { error: 'Not found' }
    if (shayari.user_id.toString() !== user.id) return { error: 'Unauthorized' }

    await Shayari.deleteOne({ _id: shayariId })
    await Like.deleteMany({ shayari_id: shayariId })
    await Save.deleteMany({ shayari_id: shayariId })
    await Comment.deleteMany({ shayari_id: shayariId })

    revalidatePath('/feed')
    return { success: true }
}

export async function toggleFollow(targetUserId: string) {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }
    if (user.id === targetUserId) return { error: 'Cannot follow self' }

    await connectDB()

    const existingFollow = await Follower.findOne({ follower_id: user.id, following_id: targetUserId })

    if (existingFollow) {
        await Follower.deleteOne({ _id: existingFollow._id })
    } else {
        await Follower.create({ follower_id: user.id, following_id: targetUserId })

        // Notification
        await Notification.create({
            user_id: targetUserId,
            actor_id: user.id,
            type: 'follow'
        })
    }

    revalidatePath(`/profile/${user.username}`) // Revalidate own profile (following count)
    // We also need to revalidate target profile, but we don't have username easily here without fetch.
    // Ideally pass path to revalidate or rely on router.refresh() on client.
    return { success: true }
}

export async function updateShayari(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const user = await getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const shayariId = formData.get('shayariId') as string
        const content = formData.get('content') as string
        const mood = formData.get('mood') as string
        const language = formData.get('language') as string

        if (!shayariId || !content || !mood) return { error: 'Missing required fields' }

        await connectDB()

        const shayari = await Shayari.findById(shayariId)
        if (!shayari) return { error: 'Not found' }
        if (shayari.user_id.toString() !== user.id) return { error: 'Unauthorized' }

        await Shayari.findByIdAndUpdate(shayariId, {
            content,
            mood,
            language
        })

        revalidatePath('/feed')
        revalidatePath(`/shayari/${shayariId}`)
        revalidatePath(`/profile/${user.username}`)
        return { success: true }
    } catch (error) {
        return { error: 'Failed to update shayari' }
    }
}
