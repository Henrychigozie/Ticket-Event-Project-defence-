import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "/firebase";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Facebook,
  Github,
  Chrome,
  Check,
} from "lucide-react";
import logo from "/src/assets/Tix-logo-transparent.png";

const auth = getAuth(app);

const AttendanceAuth = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  const handleFlip = () => setIsFlipped(!isFlipped);

  // Enterprise features array
  const features = [
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Feature 1" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Feature 2" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Enterprise Analytics" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Team Management" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Security Dashboard" },
  ];

  const socialButtons = [
    { icon: <Facebook className="w-4 h-4" />, text: "Facebook" },
    { icon: <Github className="w-4 h-4" />, text: "GitHub" },
    { icon: <Chrome className="w-4 h-4" />, text: "Google" },
  ];

  /* ---------------- TOAST ---------------- */
  const blackToast = {
    success: (msg) =>
      toast.success(msg, { style: { background: "#000", color: "#fff" } }),
    error: (msg) =>
      toast.error(msg, { style: { background: "#000", color: "#fff" } }),
    loading: (msg) =>
      toast.loading(msg, { style: { background: "#000", color: "#fff" } }),
    promise: (promise, msgs) =>
      toast.promise(promise, msgs, {
        style: { background: "#000", color: "#fff" },
      }),
  };

  /* ---------------- STORE USER ---------------- */
  const storeUser = (user) => {
    const tixUser = {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      uid: user.uid,
      avatar: user.photoURL || null,
    };
    localStorage.setItem("tixUser", JSON.stringify(tixUser));
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "tixUser",
          newValue: JSON.stringify(tixUser),
        })
      );
    } catch {
      window.dispatchEvent(new Event("storage"));
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword)
      return blackToast.error("Passwords do not match");
    if (!agreeTerms) return blackToast.error("Agree to terms first");

    const promise = createUserWithEmailAndPassword(
      auth,
      signupForm.email,
      signupForm.password
    ).then(async (cred) => {
      await updateProfile(cred.user, { displayName: signupForm.name });
      storeUser({ ...cred.user, displayName: signupForm.name });
      return cred;
    });

    blackToast.promise(promise, {
      loading: "Creating account...",
      success: () => {
        setIsFlipped(false);
        setTimeout(() => navigate("/"), 900);
        return "Account created successfully!";
      },
      error: (err) => err.message,
    });
  };

  /* ---------------- LOGIN ---------------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const promise = signInWithEmailAndPassword(
      auth,
      loginForm.email,
      loginForm.password
    ).then((cred) => {
      storeUser(cred.user);
      return cred;
    });

    blackToast.promise(promise, {
      loading: "Signing in...",
      success: () => {
        setTimeout(() => navigate("/"), 900);
        return "Logged in successfully!";
      },
      error: (err) => err.message,
    });
  };

  /* ---------------- GOOGLE LOGIN ---------------- */
  const handleSocialLogin = async (platform) => {
    if (platform !== "Google") {
      blackToast.error(`${platform} login not implemented`);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      storeUser(result.user);
      blackToast.success("Google login successful!");
      navigate("/");
    } catch (err) {
      blackToast.error(err.message);
    }
  };

  /* ---------------- FORGOT PASSWORD ---------------- */
  const handleForgotPassword = async () => {
    if (!loginForm.email) return blackToast.error("Enter email first");
    try {
      await sendPasswordResetEmail(auth, loginForm.email);
      blackToast.success("Password reset email sent");
    } catch (err) {
      blackToast.error(err.message);
    }
  };

  /* ---------------- INPUT HANDLERS ---------------- */
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleSignupChange = (e) =>
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });

  return (
    <>
      <Toaster position="top-right" />

      {/* Back Button */}
      <div className="fixed top-2 left-2 z-50 bg-white w-10 h-10 rounded-full flex justify-center items-center">
        <Link to="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-700/40 via-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row gap-6">
          {/* ---------------- LEFT SIDE FEATURES ---------------- */}
          <div className="lg:w-2/5 bg-gradient-to-b from-black to-gray-900 text-white p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1 rounded-xl shadow-lg">
            <div className="max-w-xs mx-auto">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Enterprise Features</h3>
                <div className="space-y-4">
                  {features.slice(2).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-2 mb-3">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">"Onboarding made simple"</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-xs font-medium">Global Retail Co.</p>
                    <p className="text-xs text-gray-400">1,200+ Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT SIDE LOGIN/SIGNUP 3D CONTAINER ---------------- */}
          <div className="lg:w-3/5 perspective-1000 order-1 lg:order-2">
            <div
              className="relative w-full h-140 transition-transform duration-700 preserve-3d"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* ================= LOGIN SIDE ================= */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                  <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                    <form
                      onSubmit={handleLoginSubmit}
                      className="max-w-sm mx-auto flex flex-col justify-center space-y-4"
                    >
                      <h2 className="text-3xl font-semibold mb-6">Welcome Back</h2>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="email"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          placeholder="Email"
                          className="w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-lg"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          placeholder="Password"
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-left"
                      >
                        Forgot password?
                      </button>

                      <button className="w-full py-3 bg-black text-white rounded-lg mb-2">
                        Sign In
                      </button>

                      <div className="grid grid-cols-3 gap-3 mb-2">
                        {socialButtons.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSocialLogin(s.text)}
                            className="bg-gray-900 text-white py-2 rounded-lg"
                          >
                            {s.icon}
                          </button>
                        ))}
                      </div>

                      <p className="text-sm text-center">
                        No account?{" "}
                        <button type="button" onClick={handleFlip} className="text-black font-medium">
                          Sign up
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>

              {/* ================= SIGNUP SIDE ================= */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                  <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                    <form onSubmit={handleSignupSubmit} className="max-w-sm mx-auto space-y-4">
                      <h2 className="text-2xl font-semibold">Create Account</h2>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input
                          name="name"
                          value={signupForm.name}
                          onChange={handleSignupChange}
                          placeholder="Full Name"
                          className="w-full pl-10 py-3 bg-gray-50 border rounded-lg"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input
                          name="email"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                          placeholder="Email"
                          className="w-full pl-10 py-3 bg-gray-50 border rounded-lg"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          placeholder="Password"
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                          placeholder="Confirm Password"
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Agree Terms */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={() => setAgreeTerms(!agreeTerms)}
                          className="cursor-pointer"
                        />
                        <p className="text-sm">I agree to the Terms & Conditions</p>
                      </div>

                      <button
                        disabled={!agreeTerms}
                        className={`w-full py-3 text-white rounded-lg ${
                          agreeTerms ? "bg-black" : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Create Account
                      </button>

                      <p className="text-sm text-center">
                        Already have account?{" "}
                        <button type="button" onClick={handleFlip} className="text-black font-medium">
                          Login
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .perspective-1000 {
            perspective: 1200px;
          }
          .preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
        `}</style>
      </div>
    </>
  );
};

export default AttendanceAuth;
