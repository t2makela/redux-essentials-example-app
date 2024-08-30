import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useGetPostsQuery, Post } from '../api/apiSlice'
import classnames from 'classnames'

interface PostExcerptProps {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
  // const post = useAppSelector((state) => selectPostById(state, postId))
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
  const { data: posts = [], isLoading, isFetching, isSuccess, isError, error, refetch } = useGetPostsQuery()
  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])
  let content: React.ReactNode

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)

    const containerClassname = classnames('posts-container', { disabled: isFetching })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
