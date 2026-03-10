/**
 * Notifications Page
 * User notifications and alerts management
 */

'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, X, Archive, Settings, Filter, Search } from 'lucide-react';

function FormattedDate({ timestamp }: { timestamp: string }) {
  const [formatted, setFormatted] = useState('');
  
  useEffect(() => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    let result = '';
    if (diffInHours < 1) result = 'Just now';
    else if (diffInHours < 24) result = `${diffInHours}h ago`;
    else if (diffInHours < 48) result = 'Yesterday';
    else result = date.toLocaleDateString();
    
    setFormatted(result);
  }, [timestamp]);
  
  return <span>{formatted}</span>;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Research Article Available',
      message: 'Constitutional Interpretation in Modern Nigeria has been added to the Research Library',
      type: 'research',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/dashboard/research-library'
    },
    {
      id: '2',
      title: 'Module Completion',
      message: 'You have completed "Introduction to Constitutional Law" module',
      type: 'achievement',
      timestamp: '2024-01-15T09:15:00Z',
      read: false,
      priority: 'high',
      actionUrl: '/dashboard/modules'
    },
    {
      id: '3',
      title: 'AI Assistant Response',
      message: 'Your question about contract law has been answered by the AI Assistant',
      type: 'ai',
      timestamp: '2024-01-14T16:45:00Z',
      read: true,
      priority: 'low',
      actionUrl: '/dashboard/ai-assistant'
    },
    {
      id: '4',
      title: 'Simulation Results Available',
      message: 'Your Civil Contract Dispute simulation results are ready for review',
      type: 'simulation',
      timestamp: '2024-01-14T14:20:00Z',
      read: true,
      priority: 'medium',
      actionUrl: '/dashboard/simulations'
    },
    {
      id: '5',
      title: 'System Update',
      message: 'New features have been added to the Concept Builder tool',
      type: 'system',
      timestamp: '2024-01-13T11:00:00Z',
      read: true,
      priority: 'low',
      actionUrl: '/dashboard/concept-builder'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research':
        return '📚';
      case 'achievement':
        return '🏆';
      case 'ai':
        return '🤖';
      case 'simulation':
        return '⚖️';
      case 'system':
        return '🔔';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'research':
        return 'bg-blue-100 text-blue-800';
      case 'achievement':
        return 'bg-green-100 text-green-800';
      case 'ai':
        return 'bg-purple-100 text-purple-800';
      case 'simulation':
        return 'bg-orange-100 text-orange-800';
      case 'system':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-slate-200 bg-white';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || notif.type === filter;
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-600">Stay updated with your learning progress and system updates</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Mark All Read
              </button>
            )}
            <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{notifications.length}</p>
                <p className="text-sm text-slate-600">Total Notifications</p>
              </div>
            </div>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{unreadCount}</p>
                <p className="text-sm text-slate-600">Unread</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {notifications.filter(n => n.read).length}
                </p>
                <p className="text-sm text-slate-600">Read</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Archive className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-sm text-slate-600">Archived</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-slate-600 mt-2.5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="research">Research</option>
                <option value="achievement">Achievements</option>
                <option value="ai">AI Assistant</option>
                <option value="simulation">Simulations</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-all ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'font-medium' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-slate-900">{notification.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          <FormattedDate timestamp={notification.timestamp} />
                        </span>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications found</h3>
              <p className="text-slate-600">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'You\'re all caught up! No new notifications.'
                }
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
