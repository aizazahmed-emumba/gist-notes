import { Routes, Route } from "react-router-dom";
import "./App.css";
// import Navbar from "./Components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Navbar2 from "./components/Navbar/Navbar2";
import GistPage from "./pages/GistPage";
import MyGists from "./pages/MyGists";
import { initializeApp } from "firebase/app";
import CreateGist from "./pages/CreateGist";
import EditGist from "./pages/EditGist";

initializeApp({
  apiKey: "AIzaSyAfFRNqQ3fA59MZ_f6XZwfkMbyDFxywqqM",
  projectId: "gist-notes-3db94",
  authDomain: "gist-notes-3db94.firebaseapp.com",
});

function App() {
  return (
    <div className="App">
      <Navbar2 />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gist/:id" element={<GistPage />} />
          <Route path="/my-gists/:gistType" element={<MyGists />} />
          <Route path="/create" element={<CreateGist />} />
          <Route path="/edit/:id" element={<EditGist />} />
          <Route path="/about" element={<div>About</div>} />
        </Routes>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
