import { tw } from "../utils/twStyles.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useAuthModal } from "../context/AuthModalContext";

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const { closeAuth, switchAuth } = useAuthModal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      closeAuth();
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={tw("vanta-auth-content")}>
      <div className={tw("vanta-auth-heading")}>
        <p className={tw("vanta-auth-kicker")}>VANTA BAGS</p>
        <h2 id="vanta-auth-title">Create account</h2>
        <p>Welcome to VANTA.</p>
        <small>Create your account to continue</small>
      </div>

      {error && <div className={tw("vanta-auth-error")}>{error}</div>}

      <form className={tw("vanta-auth-form")} onSubmit={handleSubmit}>
        <label className={tw("vanta-auth-field")}>
          <span>Full Name</span>
          <div className={tw("vanta-auth-input-wrap")}>
            <UserRound size={14} />
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </div>
        </label>

        <label className={tw("vanta-auth-field")}>
          <span>Email Address</span>
          <div className={tw("vanta-auth-input-wrap")}>
            <Mail size={14} />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className={tw("vanta-auth-field")}>
          <span>Password</span>
          <div className={tw("vanta-auth-input-wrap")}>
            <LockKeyhole size={14} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <button
              type="button"
              className={tw("vanta-auth-password-toggle")}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </label>

        <button className={tw("vanta-auth-submit")} type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className={tw("vanta-auth-divider")}><span>secure checkout ready</span></div>

      <p className={tw("vanta-auth-switch")}>
        Already have an account?{" "}
        <button type="button" onClick={() => switchAuth("login")}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
