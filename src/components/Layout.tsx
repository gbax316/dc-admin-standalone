import { Outlet, Link } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">DC Admin</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link to="/" className="block py-2 px-6 hover:bg-gray-100">Dashboard</Link>
            </li>
            <li>
              <Link to="/members" className="block py-2 px-6 hover:bg-gray-100">Members</Link>
            </li>
            <li>
              <Link to="/events" className="block py-2 px-6 hover:bg-gray-100">Events</Link>
            </li>
            <li>
              <Link to="/vows" className="block py-2 px-6 hover:bg-gray-100">Vows</Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Dominion City Church Admin</h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout 