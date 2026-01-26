import { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./FireBase/firebase";

import Events from "./Components/events.jsx";
import Login from "./pages/login.jsx";

import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
useEffect(() => {
  const testWrite = async () => {
    try {
      await addDoc(collection(db, "tickets"), {
        debug: true,
        source: "test-write",
        time: new Date(),
      });
      console.log("✅ Firestore write successful");
    } catch (e) {
      console.error("❌ Firestore write failed:", e);
    }
  };

  testWrite();
}, []);


  return (
    <Routes>
      <Route path="/" element={<Events />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
