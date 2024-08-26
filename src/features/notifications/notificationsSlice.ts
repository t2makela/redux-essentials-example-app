import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { client } from '@/api/client'

import type { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/withTypes'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface ClientNotification extends ServerNotification {
  read: boolean
  isNew: boolean
}

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const allNotifications = selectAllNotifications(thunkApi.getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get<ServerNotification[]>(`/fakeApi/notifications?since=${latestTimestamp}`)
  return response.data
})

const notificationAdapter = createEntityAdapter<ClientNotification>({
  // Sort with newest first
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
const initialState = notificationAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      //Add client-side metadata for trackin new notifications
      const notificationsWithMetadata: ClientNotification[] = action.payload.map((notification) => ({
        ...notification,
        read: false,
        isNew: true,
      }))
      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })

      notificationAdapter.upsertMany(state, notificationsWithMetadata)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter((notification) => !notification.read)
  return unreadNotifications.length
}
export const { selectAll: selectAllNotifications } = notificationAdapter.getSelectors(
  (state: RootState) => state.notifications,
)
