import { getPostsByFollowedUsers } from "@/actions/posts/post-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { userData } from "@/lib/session";
import { Terminal } from "lucide-react";
import PostGrid from "../_components/post-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FollowingPage = async () => {

    const { isLoggedIn, user } = await userData()

    if (!isLoggedIn) return (
        <div className="h-96 flex items-center justify-center">
            <Alert className="h-36 w-[70%] flex flex-col items-center justify-center py-5">
                <AlertTitle className="py-2 text-xl font-semibold">
                    Heads up!
                </AlertTitle>
                <AlertDescription className="flex flex-col items-center justify-center">
                    Must be logged in to view this page
                    <Link href="/login">
                        <Button variant="link">
                            Sign in
                        </Button>
                    </Link>
                </AlertDescription>
            </Alert>
        </div>
    )

    const posts = await getPostsByFollowedUsers(user?.id as string);

    if (posts.length === 0) return (
        <div className="h-96 flex items-center justify-center">
            <Alert className="h-36 w-[70%] flex flex-col items-center justify-center py-5">
                <AlertTitle className="py-2 text-xl font-semibold">
                    Heads up!
                </AlertTitle>
                <AlertDescription className="flex flex-col items-center justify-center">
                    No posts from users you follow
                    <Link href="/">
                        <Button variant="link">
                            Go Home
                        </Button>
                    </Link>
                </AlertDescription>
            </Alert>
        </div>
    )

    return (
        <div className="py-4">
            <PostGrid posts={posts} />
        </div>
    )
}

export default FollowingPage