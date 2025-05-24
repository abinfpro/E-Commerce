import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "./components/Usercontext";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import SignupPage from './components/signuppage';

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>
);
