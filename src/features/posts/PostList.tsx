import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { fetchPosts, Post, selectAllPosts, selectPostsError, selectPostsStatus } from './postsSlice'

interface PostExcerptProps {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
  return (
    <article className="post-exerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}
export const PostList = () => {
  const dispatch = useAppDispatch()
  const postStatus = useAppSelector(selectPostsStatus)
  // Select the `state.posts` value from the store into the component
  const posts = useAppSelector(selectAllPosts)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }),
    [postStatus, dispatch]
  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
