import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tixUser");
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Error reading user from localStorage", err);
    }

    const onStorage = () => {
      try {
        const stored = localStorage.getItem("tixUser");
        setUser(stored ? JSON.parse(stored) : null);
      } catch (err) {
        setUser(null);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    try {
      const auth = getAuth();
      signOut(auth).catch(() => {});
    } catch (err) {}

    localStorage.removeItem("tixUser");
    try {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "tixUser", newValue: null }),
      );
    } catch (err) {
      window.dispatchEvent(new Event("storage"));
    }
    navigate("/");
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No user signed in</h2>
          <p className="text-sm text-gray-500 mt-2">
            Please log in to view your profile.
          </p>
          <div className="mt-6">
            <Link
              to="/SignUp"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-7 h-7 text-gray-500" />
            </div>
          )}
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-200 rounded-lg text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
          <Link to="/" className="block text-center text-sm text-gray-600">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
