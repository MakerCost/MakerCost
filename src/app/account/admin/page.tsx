'use client'

import { useState, useEffect } from 'react'
import { useAdmin, type AdminStats, type AdminUser } from '@/hooks/useAdmin'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { getAdminStats, getAllUsers, setAdminStatus } = useAdmin()

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/account/settings')
      return
    }

    if (isAdmin) {
      loadAdminData()
    }
  }, [isAdmin, adminLoading, router])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getAllUsers()
      ])

      setStats(statsData)
      setUsers(usersData || [])
    } catch (err) {
      console.error('Error loading admin data:', err)
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const success = await setAdminStatus(userId, !currentStatus)
      if (success) {
        // Refresh users data
        const usersData = await getAllUsers()
        setUsers(usersData || [])
      } else {
        setError('Failed to update admin status')
      }
    } catch (err) {
      console.error('Error toggling admin status:', err)
      setError('Failed to update admin status')
    }
  }

  if (adminLoading || loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow border">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage users and view system statistics</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total_users}</p>
            <p className="text-sm text-gray-500 mt-1">+{stats.users_this_month} this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-green-600">{stats.total_projects}</p>
            <p className="text-sm text-gray-500 mt-1">+{stats.projects_this_month} this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Quotes</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.total_quotes}</p>
            <p className="text-sm text-gray-500 mt-1">+{stats.quotes_this_month} this month</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name || user.last_name 
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : user.username || 'Unnamed User'
                        }
                      </div>
                      {user.username && (
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_admin 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                      className={`${
                        user.is_admin
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-blue-600 hover:text-blue-900'
                      } cursor-pointer`}
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  )
}