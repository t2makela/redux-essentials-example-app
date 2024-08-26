import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { logout } from '@/features/auth/authSlice'
import { selectCurrentUser } from '@/features/users/usersSlice'
import { fetchNotifications, selectUnreadNotificationsCount } from '@/features/notifications/notificationsSlice'
import { UserIcon } from './UserIcon'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const numUreadNotifications = useAppSelector(selectUnreadNotificationsCount)

  const isLoggedIn = !!user

  let navContent: React.ReactNode = null

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout())
    }

    const fetchNewNotifications = () => {
      dispatch(fetchNotifications())
    }

    let unreadNotificationsBadge: React.ReactNode | undefined

    if (numUreadNotifications > 0) {
      unreadNotificationsBadge = <span className="badge">{numUreadNotifications}</span>
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          <button className="button small" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {user.name}
          <button className="button small" onClick={onLogoutClicked}>
            Log Out
          </button>
        </div>
      </div>
    )
  }
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <div className="navContent">{navContent}</div>
      </section>
    </nav>
  )
}
