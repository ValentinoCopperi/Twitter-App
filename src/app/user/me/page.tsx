import { getPostsByUserId } from '@/actions/posts/post-actions';
import { getUserByUsername } from '@/actions/users/user-actions';
import { userData } from '@/lib/session';
import type { Metadata } from 'next';
import UserCard from '../_components/user-card';
import PostGrid from '@/app/_components/post-grid';


export async function generateMetadata(
): Promise<Metadata> {
  return {
    title: 'Twitter | My Profile',
  };
}


const MyProfilePage = async () => {

  const { user: user_session } = await userData()
  const user = await getUserByUsername(user_session?.username)
  const userPosts = await getPostsByUserId(user_session?.id as string)

  if(!user){
    return <div>User not found</div>
  }

  
  return (
    <div className='mx-3 lg:mx-0'>
      <UserCard user={user} user_session={user_session} />
      <PostGrid posts={userPosts} />
    </div>
  )
}

export default MyProfilePage