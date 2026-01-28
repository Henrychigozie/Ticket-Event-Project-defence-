import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  MoreVertical,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const EventsDashboard = () => {
  const [events, setEvents] = useState([
    {
      id: 'EVT-2023-001',
      name: 'Summer Music Festival 2023',
      brand: 'Harmony Productions',
      type: 'Festival',
      startDate: '2023-07-15T18:00:00',
      endDate: '2023-07-17T23:00:00',
      venue: 'Central Park, New York',
      status: 'completed',
      totalTickets: 5000,
      ticketsSold: 4875,
      revenue: 243750,
      currency: 'USD',
      tags: ['music', 'festival', 'summer'],
      organizer: 'John Doe',
      createdDate: '2023-05-10T10:30:00'
    },
    {
      id: 'EVT-2023-002',
      name: 'Tech Conference 2023',
      brand: 'Innovate Corp',
      type: 'Conference',
      startDate: '2023-09-20T09:00:00',
      endDate: '2023-09-22T17:00:00',
      venue: 'Convention Center, San Francisco',
      status: 'active',
      totalTickets: 2000,
      ticketsSold: 1450,
      revenue: 290000,
      currency: 'USD',
      tags: ['technology', 'conference', 'networking'],
      organizer: 'Jane Smith',
      createdDate: '2023-06-15T14:20:00'
    },
    {
      id: 'EVT-2023-003',
      name: 'Comedy Night Special',
      brand: 'Laugh Factory',
      type: 'Comedy Show',
      startDate: '2023-10-05T20:00:00',
      endDate: '2023-10-05T22:30:00',
      venue: 'Downtown Comedy Club',
      status: 'upcoming',
      totalTickets: 300,
      ticketsSold: 275,
      revenue: 13750,
      currency: 'USD',
      tags: ['comedy', 'entertainment'],
      organizer: 'Mike Johnson',
      createdDate: '2023-08-01T11:45:00'
    },
    {
      id: 'EVT-2023-004',
      name: 'Corporate Annual Gala',
      brand: 'Global Enterprises',
      type: 'Corporate Event',
      startDate: '2023-11-25T19:00:00',
      endDate: '2023-11-25T23:00:00',
      venue: 'Grand Hotel Ballroom',
      status: 'draft',
      totalTickets: 500,
      ticketsSold: 0,
      revenue: 0,
      currency: 'USD',
      tags: ['corporate', 'networking', 'gala'],
      organizer: 'Sarah Williams',
      createdDate: '2023-09-10T16:10:00'
    },
    {
      id: 'EVT-2023-005',
      name: 'Charity Football Tournament',
      brand: 'Sports for Good',
      type: 'Sports Tournament',
      startDate: '2023-08-12T10:00:00',
      endDate: '2023-08-13T18:00:00',
      venue: 'City Stadium',
      status: 'completed',
      totalTickets: 10000,
      ticketsSold: 8750,
      revenue: 262500,
      currency: 'USD',
      tags: ['sports', 'charity', 'football'],
      organizer: 'Robert Brown',
      createdDate: '2023-06-20T09:15:00'
    },
    {
      id: 'EVT-2023-006',
      name: 'NFT Art Exhibition',
      brand: 'Digital Gallery',
      type: 'Technology Event',
      startDate: '2023-12-01T11:00:00',
      endDate: '2023-12-03T20:00:00',
      venue: 'Modern Art Museum',
      status: 'upcoming',
      totalTickets: 800,
      ticketsSold: 320,
      revenue: 24000,
      currency: 'USD',
      tags: ['nft', 'art', 'digital'],
      organizer: 'Alex Chen',
      createdDate: '2023-09-25T13:30:00'
    }
  ]);

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Filter and sort events
  useEffect(() => {
    let result = [...events];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(event => event.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(event => event.type === typeFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'revenue':
          return b.revenue - a.revenue;
        case 'tickets':
          return b.ticketsSold - a.ticketsSold;
        default:
          return 0;
      }
    });
    
    setFilteredEvents(result);
  }, [events, searchTerm, statusFilter, typeFilter, sortBy]);

  // Event status configuration
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Clock },
    upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-800', icon: Clock },
    active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  // Event type colors
  const typeColors = {
    'Festival': 'bg-yellow-100 text-yellow-800',
    'Conference': 'bg-blue-100 text-blue-800',
    'Comedy Show': 'bg-pink-100 text-pink-800',
    'Corporate Event': 'bg-indigo-100 text-indigo-800',
    'Sports Tournament': 'bg-green-100 text-green-800',
    'Technology Event': 'bg-purple-100 text-purple-800',
    'Private Event/Party': 'bg-red-100 text-red-800',
    'Drive-in Event': 'bg-gray-100 text-gray-800',
    'Stand Up Comedy': 'bg-orange-100 text-orange-800'
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEditEvent = (eventId) => {
    console.log('Edit event:', eventId);
    // Navigate to edit page or open edit modal
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'events-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (sold, total) => {
    return Math.round((sold / total) * 100);
  };

  // Statistics calculations
  const stats = {
    totalEvents: events.length,
    totalRevenue: events.reduce((sum, event) => sum + event.revenue, 0),
    totalTicketsSold: events.reduce((sum, event) => sum + event.ticketsSold, 0),
    upcomingEvents: events.filter(event => event.status === 'upcoming').length,
    activeEvents: events.filter(event => event.status === 'active').length
  };

  return (
    <div className="min-h-screen   p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Events Dashboard</h1>
              <p className="text-gray-600">Manage and monitor all your events</p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Create New Event
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalTicketsSold.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events by name, brand, venue, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {Object.keys(typeColors).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="tickets">Sort by Tickets</option>
              </select>

              <button
                onClick={handleExportData}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid/Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => {
                  const StatusIcon = statusConfig[event.status].icon;
                  const progress = calculateProgress(event.ticketsSold, event.totalTickets);
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {event.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.brand} • {event.id}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[event.status].color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[event.status].label}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
                            {event.type}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(event.startDate)}
                          </div>
                          <div className="mt-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="truncate max-w-xs">{event.venue}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-900 font-medium">
                              {event.ticketsSold.toLocaleString()}/{event.totalTickets.toLocaleString()}
                            </span>
                            <span className="text-gray-500">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                progress >= 90 ? 'bg-green-600' :
                                progress >= 70 ? 'bg-blue-600' :
                                progress >= 50 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">
                            {formatCurrency(event.revenue)}
                          </div>
                          <div className="text-gray-500">
                            Avg: {formatCurrency(event.ticketsSold > 0 ? event.revenue / event.ticketsSold : 0)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewEvent(event)}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search or filters' : 'Start by creating your first event'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredEvents.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEvents.length}</span> of{' '}
                  <span className="font-medium">{filteredEvents.length}</span> events
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-50 text-blue-600 border-blue-200">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                    <p className="text-gray-600">Event ID: {selectedEvent.id}</p>
                  </div>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Event Details */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Event Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brand:</span>
                          <span className="font-medium">{selectedEvent.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organizer:</span>
                          <span className="font-medium">{selectedEvent.organizer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(selectedEvent.createdDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Date & Venue</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">Start Date</div>
                            <div className="text-gray-600">{formatDate(selectedEvent.startDate)}</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">End Date</div>
                            <div className="text-gray-600">{formatDate(selectedEvent.endDate)}</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium">Venue</div>
                            <div className="text-gray-600">{selectedEvent.venue}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Statistics */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Ticket Statistics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Sold/Total Tickets</span>
                            <span className="font-medium">
                              {selectedEvent.ticketsSold.toLocaleString()}/{selectedEvent.totalTickets.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${calculateProgress(selectedEvent.ticketsSold, selectedEvent.totalTickets)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedEvent.ticketsSold.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Tickets Sold</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                              {(selectedEvent.totalTickets - selectedEvent.ticketsSold).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Financial Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">Total Revenue</span>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(selectedEvent.revenue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Ticket Price</span>
                          <span className="font-medium">
                            {formatCurrency(selectedEvent.ticketsSold > 0 ? selectedEvent.revenue / selectedEvent.ticketsSold : 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[selectedEvent.status].color
                          }`}>
                            {statusConfig[selectedEvent.status].label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex flex-col items-center">
                          <Eye className="w-5 h-5 mb-1" />
                          <span className="text-sm">View Analytics</span>
                        </button>
                        <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex flex-col items-center">
                          <Edit className="w-5 h-5 mb-1" />
                          <span className="text-sm">Edit Event</span>
                        </button>
                        <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex flex-col items-center">
                          <Users className="w-5 h-5 mb-1" />
                          <span className="text-sm">Manage Attendees</span>
                        </button>
                        <button className="p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex flex-col items-center">
                          <Download className="w-5 h-5 mb-1" />
                          <span className="text-sm">Export Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Go to Event Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDashboard;



