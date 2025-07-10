import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import CreatePost from "./components/CreatePost";
import Posts from "./components/Posts";
import Recognition from "./components/Recognition";
import Events from "./components/Events";
import Login from "./components/Login";
import Register from "./components/Register";
import { FiMenu } from "react-icons/fi";
import axios from "axios";

function App() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Check if user is already authenticated
  const loadUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/isvalidUser`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in
        setUser(null);
      } else {
        console.error("❌ Error loading user:", error);
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleRegister = (userData) => setUser(userData);
  const handleLogout = () => {
    setUser(null);
    setActiveComponent("dashboard");
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard user={user} onLogout={handleLogout} />;
      case "chat":
        return <Chat user={user} />;
      case "create-post":
        return <CreatePost user={user} />;
      case "posts":
        return <Posts user={user} />;
      case "leaderboard":
        return <Recognition />;
      case "events":
        return <Events />;
      default:
        return <Dashboard user={user} onLogout={handleLogout} />;
    }
  };

  if (!user) {
    return authMode === "login" ? (
      <Login
        onLogin={handleLogin}
        setAuthMode={setAuthMode}
        setUser={setUser}
      />
    ) : (
      <Register onRegister={handleRegister} setAuthMode={setAuthMode} />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FiMenu size={24} />
        </button>
        <span className="text-lg font-semibold">Welcome, {user.name}</span>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static z-10 top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar
          activeComponent={activeComponent}
          setActiveComponent={(comp) => {
            setActiveComponent(comp);
            setIsSidebarOpen(false);
          }}
          user={user}
          onLogout={handleLogout}
          setUser={setUser}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto mt-4 md:mt-0 p-4">
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
