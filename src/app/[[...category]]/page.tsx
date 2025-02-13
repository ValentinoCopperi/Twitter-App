
import { getPosts } from "@/actions/posts/post-actions";
import LoginButton from "@/components/login-button";
import UserDataFetcher from "@/context/user-provider";
import CreatePostForm from "../_components/create-post-form";
import PostGrid from "../_components/post-grid";
import CategoryNav from "./_components/category-nav";
import { CategoriesType } from "@/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default async function Home({
    params,
}: {
    params: Promise<{ category?: string[] }>
}) {
    const resolvedParams = await params;
    const category = resolvedParams.category ? resolvedParams.category[0] : undefined;
    const posts = await getPosts(category);

    return (
        <div className="w-[90%] mx-auto">
            <UserDataFetcher>
                <CreatePostForm />
                <CategoryNav />
                {
                    (posts.length === 0 || !posts) ? (
                        <div className="h-96 flex items-center justify-center">
                            <Alert variant="default" className="w-full max-w-md">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-lg font-semibold mb-2">No posts found</AlertTitle>
                                <AlertDescription className="text-center">
                                    <p className="mb-4">
                                        There are currently no posts in the <span className="font-medium">{category}</span> category.
                                    </p>
                                    <div className="flex justify-center ">
                                        <Link href="/">
                                            <Button variant="default">Go Home</Button>
                                        </Link>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <PostGrid posts={posts} />
                    )
                }
            </UserDataFetcher>
        </div>
    )
}


export const fetchCache = "default-cache"; // Habilita caché en el servidor
export const revalidate = 60; // Refresca cada 60 segundos
export const dynamic = "force-dynamic"; // Opcional, para evitar caché en SSR