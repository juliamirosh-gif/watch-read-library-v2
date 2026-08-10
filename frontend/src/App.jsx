import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Library from "./pages/Library";
import ItemDetails from "./pages/ItemDetails";
import ItemForm from "./pages/ItemForm";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Публічні маршрути — доступні всім */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Захищені маршрути — тільки для авторизованих */}
          {/* PrivateRoute перевіряє токен, інакше перенаправляє на /login */}
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <Library />
              </PrivateRoute>
            }
          />
          <Route
            path="/library/new"
            element={
              <PrivateRoute>
                <ItemForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/library/:id"
            element={
              <PrivateRoute>
                <ItemDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/library/:id/edit"
            element={
              <PrivateRoute>
                <ItemForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Сторінка 404 */}
          <Route
            path="*"
            element={
              <main style={{ textAlign: "center", padding: "4rem" }}>
                <h1>404 — Сторінку не знайдено</h1>
              </main>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
