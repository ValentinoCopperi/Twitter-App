
export const categories : string[]= [
    "TECHNOLOGY",
    "SPORTS",
    "MUSIC",
    "MOVIES",
    "POLITICS",
    "FASHION",
    "FOOD",
    "TRAVEL",
    "FITNESS",
    "LIFESTYLE",
    "BUSINESS",
    "EDUCATION",
]

export type CategoriesType =
    | "technology"
    | "sports"
    | "music"
    | "movies"
    | "politics"
    | "fashion"
    | "food"
    | "travel"
    | "fitness"
    | "lifestyle"
    | "business"
    | "education";


export interface User {
    id: string;
    email: string;
    username: string;
    image: string | null;
    description?: string;
    posts: Post[];
    password: string;
    following: string[];
    followers: number
}

export interface Post {
    id: string;
    title: string;
    description: string;
    category: string;
    userId: string;
    createdAt: Date;
    user: User;
    likes: Like[];
    comments: Comment[],
}

export interface Like {
    id: string;
    userId: string;
    username: string;
    postId: string;
}

export interface Comment {
    id: string;
    content: string;
    userId: string;
    username: string;
    postId: string;
}
