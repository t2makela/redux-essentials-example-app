import { RootState } from '@/app/store'
import { createEntityAdapter, createSlice, EntityState, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { logout } from '../auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withTypes'
import { AppStartListening } from '@/app/listenerMiddleware'
import { apiSlice } from '@/features/api/apiSlice'

export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions
// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Reactions
}

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

export type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
export type NewPost = Pick<Post, 'title' | 'content' | 'user'>
interface PostsState extends EntityState<Post, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

export const addNewPost = createAppAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial '{title, content, user}' object
  async (initialPost: NewPost) => {
    // We send the initial data to the fake API server
    const response = await client.post<Post>('fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  },
)
const postsAdapter = createEntityAdapter<Post>({
  // Sort in descending date order
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

export const addPostsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    matcher: apiSlice.endpoints.addNewPost.matchFulfilled,
    effect: async (action, listenerApi) => {
      const { toast } = await import('react-tiny-toast')

      const toastId = toast.show('New post added!', {
        variant: 'success',
        position: 'bottom-right',
        pause: true,
      })

      await listenerApi.delay(5000)
      toast.remove(toastId)
    },
  })
}
