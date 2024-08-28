import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectCurrentUsername } from '@/features/auth/authSlice'
import { useGetPostQuery } from '../api/apiSlice'
import { Spinner } from '@/components/Spinner'

export const SinglePostPage = () => {
  const { postId } = useParams()
  const currentUsername = useAppSelector(selectCurrentUsername)!
  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId!)
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }
  const canEdit = currentUsername === post.user
  let content: React.ReactNode

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <section>
        <article className="post">
          <h2>{post.title}</h2>
          <p className="post-content">{post.content}</p>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
          <ReactionButtons post={post} />
          {canEdit && (
            <Link to={`/editPost/${post.id}`} className="button">
              Edit Post
            </Link>
          )}
        </article>
      </section>
    )
  }

  return <section>{content}</section>
}
