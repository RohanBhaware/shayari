"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

interface SettingsFormProps {
    initialProfile: any
}

export function SettingsForm({ initialProfile }: SettingsFormProps) {
    const [displayName, setDisplayName] = useState(initialProfile.display_name || "")
    const [bio, setBio] = useState(initialProfile.bio || "")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(false)
        setSaving(true)

        const result = await updateProfile({} as any, formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(true)
            router.refresh()
        }

        setSaving(false)
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
                <p className="mt-1 text-muted-foreground">
                    Manage your profile and preferences
                </p>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Update your public profile information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
                                Profile updated successfully!
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={initialProfile.username || ""}
                                disabled
                                className="bg-muted/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                Username cannot be changed
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="display_name"
                                name="display_name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your display name"
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell the world about yourself..."
                                className="min-h-[120px] resize-none bg-background/50"
                                maxLength={200}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {bio.length}/200
                            </p>
                        </div>

                        <Button type="submit" disabled={saving} className="gap-2">
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Account section */}
            <Card className="mt-6 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                        Manage your account settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="text-foreground">{initialProfile.email || "Not available"}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Member since</Label>
                            <p className="text-foreground">
                                {initialProfile.created_at
                                    ? new Date(initialProfile.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "Unknown"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
