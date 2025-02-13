import { getUserByUsername } from '@/actions/users/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { userData } from '@/lib/session';
import { getInitials } from '@/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import UserCard from '../_components/user-card';
import { getPostsByUserId } from '@/actions/posts/post-actions';
import PostGrid from '@/app/_components/post-grid';

type Props = {
    params: Promise<{ username: string }>
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {


    const username_decoded = decodeURIComponent((await params).username);

    return {
        title: `Twitter | ${username_decoded}`,
    };
}

export default async function UserPage({ params }: Props) {

    const username = decodeURIComponent((await params).username);

    const user = await getUserByUsername(username)

    const { user: user_session } = await userData()

    
    if (!user) {
        return <div>User not found</div>
    }
    

    const userPosts = await getPostsByUserId(user.id as string)


    return (
        <div className='mx-3 lg:mx-0'>
            <UserCard  user={user} user_session={user_session} />
            <PostGrid posts={userPosts} />
        </div>
    )
}
