import React from 'react'

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Members</h2>
          <p className="text-3xl font-bold text-blue-600">248</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Announcements</h2>
          <p className="text-3xl font-bold text-purple-600">12</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <ul className="divide-y">
          <li className="py-3">New member registered: John Smith</li>
          <li className="py-3">Event created: Sunday Service (May 21, 2023)</li>
          <li className="py-3">Announcement published: Youth Camp Registration</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard 