import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { CategoriesType, Post } from '@/types'
import { Button } from '@/components/ui/button'
import LikeButton from './buttons/like-button'
import FollowBtn from './buttons/follow-button'
import { User } from '@prisma/client'
import CommentButton from './buttons/comments/comment-button'
import { Bike, BookOpen, Briefcase, Cpu, Dumbbell, Film, Globe, LifeBuoy, Mic, Music, Pizza, Shirt } from 'lucide-react'

export const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "technology":
      return <Cpu />;
    case "sports":
      return <Bike />; 
    case "music":
      return <Music />;
    case "movies":
      return <Film />;
    case "politics":
      return <Mic />;
    case "fashion":
      return <Shirt />;
    case "food":
      return <Pizza />;
    case "travel":
      return <Globe />;
    case "fitness":
      return <Dumbbell />;
    case "lifestyle":
      return <LifeBuoy />;
    case "business":
      return <Briefcase />;
    case "education":
      return <BookOpen />;
    default:
      return null;
  }
};


interface PostCardProps {
  post: Post
  user: User | null | undefined
  isLoggedIn: boolean
}

const PostCard = async ({ post, user, isLoggedIn }: PostCardProps) => {

  const hasUserLiked = post.likes.some(like => like.userId === user?.id)

  const getUserUrl = () => {
    if (!isLoggedIn || !user?.id) {
      return `/user/${post.user.username}`;
    }

    if (user?.id === post.userId) {
      return '/user/me';
    }

    return `/user/${post.user.username}`;
  };

  return (
    <Card className='w-full relative bg-slate-300/10 dark:bg-gray-950/80 border-gray-700/15 shadow-sm  dark:shadow-gray-600'>
      <CardHeader className='flex flex-row justify-between items-center'>
        <div className='flex flex-row items-center space-x-4'>
          <Link href={getUserUrl()}>
            <Avatar>
              <AvatarImage
                src={post?.user?.image || "/default-avatar.png"}
                alt={`${post.user.username}'s avatar`}
              />
              <AvatarFallback>{getInitials(post.user.username)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <CardTitle>{post.user.username}</CardTitle>
            <CardDescription>
              <Link href={getUserUrl()}>
                @{post.user.email.split('@')[0]}
              </Link>
            </CardDescription>
          </div>
        </div>
        <FollowBtn
          post={post}
          user={user}
        />
      </CardHeader>

      <CardContent className='my-1 w-[90%] mx-auto'>
        <h1 className='font-semibold text-2xl'>{post.title}</h1>
        <p className='font-light break-words'>{post.description}</p>
      </CardContent>

      <CardFooter className='w-full flex flex-col justify-center md:flex-row md:justify-between items-center'>
        <Link href={`/${post.category.toLocaleLowerCase()}`}>
          <Button>
            {post.category} <span>{getIcon(post.category)}</span>
          </Button>
        </Link>
        <div className='flex flex-row space-x-8 my-2 lg:my-0'>
          <div className='flex flex-row items-center '>
            <LikeButton
              hasUserLiked={hasUserLiked}
              post={post}
              userId={user?.id}
              username={user?.username}
            />
          </div>
          <div className='flex flex-row items-center space-x-2'>
            <CommentButton
              post={post}
            />
          </div>
        </div>
        <h1>{new Date(post.createdAt).toLocaleDateString()}</h1>
      </CardFooter>

    </Card>
  )
}

export default PostCard