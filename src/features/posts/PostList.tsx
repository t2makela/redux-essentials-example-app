import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { fetchPosts, selectPostById, selectPostIds, selectPostsError, selectPostsStatus } from './postsSlice'
import { useSelector } from 'react-redux'

interface PostExcerptProps {
  postId: string
}

function PostExcerpt({ postId }: PostExcerptProps) {
  const post = useAppSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-exerpt" key={postId}>
      <h3>
        <Link to={`/posts/${postId}`}>{post.title}</Link>
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
  const orderedPostIds = useSelector(selectPostIds)
  const postStatus = useAppSelector(selectPostsStatus)
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
    content = orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />)
  } else if (postStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
