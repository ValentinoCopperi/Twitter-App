"use server"

import { prisma } from "@/lib/prisma"
import { userData } from "@/lib/session"
import { Post } from "@/types"
import { createPostSchema, CreatePostState } from "@/types/create-post"
import { revalidateTag } from "next/cache";
import { User } from "@prisma/client"

export const getPosts = async (category?: string ): Promise<Post[]> => {
    try {

        if(category){
            return getPostsByCategory(category)
        }

        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        image: true,
                    },
                },
                comments: true,
                likes: true,
            },
        })

        return posts as Post[]
    } catch (error) {
        console.error("Error fetching posts:", error)
        return []
    }
};

export const revalidatePosts = async () => {
    revalidateTag("posts");
};

export const getPostsByFollowedUsers = async (userId: string): Promise<Post[]> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { following: true },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const usersToFetchPosts = [...user.following];

        const posts = await prisma.post.findMany({
            where: {
                userId: {
                    in: usersToFetchPosts,
                },
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        image: true,
                    },
                },
                comments: true,
                likes: true,
            },
        });

        return posts as Post[];

    } catch (error) {
        console.error("Error fetching posts by followed users:", error);
        return [];
    }
}

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {

    try {
        const posts = await prisma.post.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        image: true
                    }
                },
                comments: true,
                likes: true
            }
        })

        return posts as Post[]

    } catch (error) {
        console.error(error)
        return []
    }

}

export const getPostsByCategory = async (category: string): Promise<Post[]> => {

    try {
        const posts = await prisma.post.findMany({
            where: {
                category: category.toLocaleUpperCase()
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        image: true,
                    },
                },
                comments: true,
                likes: true,
            },
        });

        return posts as Post[]

    } catch (error) {
        console.log(error)
        return []
    }

}

// export const getPosts = async (): Promise<Post[]> => {
//     try {

//         const posts = await prisma.post.findMany({
//             orderBy: {
//                 createdAt: "desc"
//             },
//             include: {
//                 user: {
//                     select: {
//                         id: true,
//                         username: true,
//                         email: true,
//                         image: true

//                     }
//                 },
//                 comments: true,
//                 likes: true
//             }
//         })
//         return posts;

//     } catch (error) {
//         console.error(error)
//         return [];
//     }
// }

export const createPost = async (state: CreatePostState, formData: FormData): Promise<CreatePostState> => {



    try {
        const { isLoggedIn, user } = await userData()

        if (!isLoggedIn || !user?.id || user.id === undefined) {
            return { message: { error: true, message: "Must be logged in to create posts" } }
        }



        const validateFormFields = createPostSchema.safeParse({
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category')
        })

        if (!validateFormFields.success) {
            return {
                errors: validateFormFields.error.flatten().fieldErrors,
            }
        }

        await prisma.post.create({
            data: {
                title: validateFormFields.data.title,
                description: validateFormFields.data.description || "",
                category: validateFormFields.data.category,
                userId: user.id
            },


        })

        return { message: { error: false, message: "Post created succesfully" } }

    } catch (error) {
        console.log(error)
        return { message: { error: true, message: "Error creating post. Please try again" } }
    }

}

export const follow = async (user: string, follow: string) => {

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: user },
            select: { following: true },
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        const following = currentUser.following.includes(follow)
            ? currentUser.following
            : [...currentUser.following, follow];

        await prisma.user.update({
            where: { id: user },
            data: {
                following: following,
            },
        });


        await prisma.user.update({
            where: { id: follow },
            data: {
                followers: {
                    increment: 1
                }
            }
        })

    } catch (error) {
        console.error("Error following user:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Error following user");
    }

}

export const unfollow = async (user: string, unfollow: string) => {

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: user },
            select: { following: true },
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        if (!currentUser.following.includes(unfollow)) {
            throw new Error("User is not following the target user");
        }

        const updatedFollowing = currentUser.following.filter(followingId => followingId !== unfollow);

        await prisma.user.update({
            where: { id: user },
            data: {
                following: updatedFollowing,
            },
        });

        await prisma.user.update({
            where: { id: unfollow },
            data: {
                followers: {
                    decrement: 1
                }
            }
        })
    } catch (error) {
        console.error("Error unfollowing user:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Error unfollowing user");
    }

}


export const likePostAction = async (postId: string, userId: string, username: string) => {
    try {
        await prisma.like.create({
            data: {
                userId: userId,
                postId: postId,
                username: username
            }
        })
    } catch (error) {
        console.log(error)
        throw new Error("Error liking post")
    }
}

export const unlikePostAction = async (postId: string, userId: string) => {
    try {
        await prisma.like.deleteMany({
            where: {
                postId: postId,
                userId: userId
            }
        })
    } catch (error) {
        console.log(error)
        throw new Error("Error unliking post")
    }
}
export const deletePostAction = async (post: Post, userId: string) => {
    if (!post || !userId) {
        throw new Error("Invalid post or user data");
    }
    try {
        if (userId !== post.userId) {
            throw new Error("You are not authorized to delete this post");
        }

        await prisma.post.delete({
            where: { id: post.id },
        });

    } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Error deleting post");
    }
};

export const commentPostAction = async (content: string, postId: string, user: User) => {

    try {

        await prisma.comment.create({
            data: {
                content: content,
                userId: user.id,
                username: user.username,
                postId: postId
            }
        })

    } catch (error) {
        console.log(error)
        throw new Error("Error posting comment")
    }

}

export const deleteCommentAction = async (commentId: string) => {

    try {
        await prisma.comment.delete({
            where: {
                id: commentId
            }
        })
    } catch (error) {
        console.log(error)
        throw new Error("Error deleting comment")
    }

}