import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>404</h1>
      <p>This page doesn’t exist.</p>
      <Link to="/">Go home</Link>
    </main>
  );
}
