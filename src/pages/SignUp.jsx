import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app } from "/firebase";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Check,
  Facebook,
  Github,
  Chrome,
  Shield,
  Clock,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Users,
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
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFlip = () => setIsFlipped(!isFlipped);

  // Custom black theme toast
  const blackToast = {
    success: (message) =>
      toast.success(message, {
        style: {
          background: "#000",
          color: "#fff",
          border: "1px solid #333",
        },
        iconTheme: {
          primary: "#10B981",
          secondary: "#000",
        },
      }),
    error: (message) =>
      toast.error(message, {
        style: {
          background: "#000",
          color: "#fff",
          border: "1px solid #333",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#000",
        },
      }),
    loading: (message) =>
      toast.loading(message, {
        style: {
          background: "#000",
          color: "#fff",
          border: "1px solid #333",
        },
      }),
    promise: (promise, messages) =>
      toast.promise(promise, messages, {
        style: {
          background: "#000",
          color: "#fff",
          border: "1px solid #333",
        },
      }),
  };

  // --- FIREBASE: Handle Sign Up ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      blackToast.error("Passwords do not match!");
      return;
    }

    if (!agreeTerms) {
      blackToast.error("Please agree to the terms and conditions");
      return;
    }

    const signupPromise = createUserWithEmailAndPassword(
      auth,
      signupForm.email,
      signupForm.password,
    ).then(async (userCredential) => {
      await updateProfile(userCredential.user, {
        displayName: signupForm.name,
      });

      // Persist a simplified user object for the header to read
      try {
        const user = userCredential.user;
        const tixUser = {
          name: user.displayName || signupForm.name,
          email: user.email,
          uid: user.uid,
          avatar: user.photoURL || null,
        };
        localStorage.setItem("tixUser", JSON.stringify(tixUser));

        // Try to notify other listeners by dispatching a StorageEvent.
        // Some browsers may disallow constructing StorageEvent; fall back to a simple event.
        try {
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "tixUser",
              newValue: JSON.stringify(tixUser),
            }),
          );
        } catch (err) {
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.error("Error saving user to localStorage:", err);
      }

      return userCredential;
    });

    blackToast.promise(signupPromise, {
      loading: "Creating your account...",
      success: (userCredential) => {
        setIsFlipped(false);
        setTimeout(() => navigate("/"), 1000);
        return "Account created successfully!";
      },
      error: (error) => {
        let errorMessage = "Sign up failed. ";
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage += "Email already in use.";
            break;
          case "auth/invalid-email":
            errorMessage += "Invalid email address.";
            break;
          case "auth/weak-password":
            errorMessage += "Password should be at least 6 characters.";
            break;
          default:
            errorMessage += error.message;
        }
        return errorMessage;
      },
    });
  };

  // --- FIREBASE: Handle Login ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const loginPromise = signInWithEmailAndPassword(
      auth,
      loginForm.email,
      loginForm.password,
    ).then((userCredential) => {
      try {
        const user = userCredential.user;
        const tixUser = {
          name: user.displayName || user.email?.split("@")[0],
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
            }),
          );
        } catch (err) {
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.error("Error saving user to localStorage:", err);
      }

      return userCredential;
    });

    blackToast.promise(loginPromise, {
      loading: "Signing you in...",
      success: () => {
        setTimeout(() => navigate("/"), 1000);
        return "Logged in successfully!";
      },
      error: (error) => {
        let errorMessage = "Login failed. ";
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage += "Invalid email or password.";
            break;
          case "auth/too-many-requests":
            errorMessage += "Too many attempts. Try again later.";
            break;
          default:
            errorMessage += error.message;
        }
        return errorMessage;
      },
    });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleSocialLogin = (platform) => {
    blackToast.loading(`Connecting with ${platform}...`);
    // Add your social login logic here
    setTimeout(() => {
      blackToast.error(`${platform} login is not implemented yet`);
    }, 1500);
  };

  const handleForgotPassword = () => {
    if (!loginForm.email) {
      blackToast.error("Please enter your email first");
      return;
    }
    blackToast.loading("Sending password reset email...");
    // Add your forgot password logic here
    setTimeout(() => {
      blackToast.success(`Password reset link sent to ${loginForm.email}`);
    }, 2000);
  };

  const features = [
    { icon: <Shield className="w-5 h-5" />, text: "ISO-Certified Security" },
    { icon: <Clock className="w-5 h-5" />, text: "Real-time Tracking" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "Analytics Dashboard" },
    { icon: <CreditCard className="w-5 h-5" />, text: "Payroll Integration" },
  ];

  const socialButtons = [
    {
      icon: <Facebook className="w-4 h-4" />,
      text: "Facebook",
      color: "bg-gray-900 hover:bg-black",
    },
    {
      icon: <Github className="w-4 h-4" />,
      text: "GitHub",
      color: "bg-gray-900 hover:bg-black",
    },
    {
      icon: <Chrome className="w-4 h-4" />,
      text: "Google",
      color: "bg-gray-900 hover:bg-black",
    },
  ];

  return (
    <>
      {/* React Hot Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#000",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "8px",
            fontSize: "14px",
            maxWidth: "400px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#000",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#000",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "#000",
              color: "#fff",
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-b  from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-gray-500 border-2 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Log In / Sign Up
                </h1>
                <div className="h-0.5 w-20 bg-gradient-to-r from-gray-900 to-gray-400 mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          {/* Main Container */}
          <div className="relative perspective-1000">
            <div
              className="relative w-full h-140 transition-transform duration-700 ease-in-out preserve-3d"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front Page - Login */}
              <div
                className="absolute inset-0 backface-hidden w-full h-full"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full border border-gray-200">
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Left Side - Login Form */}
                    <div className="flex-1 p-8 lg:p-10">
                      <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
                        <div className="mb-8">
                          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                            Welcome Back
                          </h2>
                          <p className="text-gray-600 text-sm">
                            Manage your workforce with ease
                          </p>
                        </div>

                        <div className="mb-5">
                          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                            EMAIL
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={loginForm.email}
                              onChange={handleLoginChange}
                              placeholder="Enter your email"
                              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
                              PASSWORD
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-xs text-gray-600 hover:text-black font-medium"
                            >
                              SHOW
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              placeholder="Enter your password"
                              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                  setRememberMe(e.target.checked)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 border rounded transition-all duration-200 ${
                                  rememberMe
                                    ? "bg-black border-black"
                                    : "border-gray-400"
                                }`}
                              >
                                {rememberMe && (
                                  <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-700">
                              Remember me
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-xs text-black font-medium hover:text-gray-700 transition-colors duration-200"
                          >
                            FORGOT PASSWORD?
                          </button>
                        </div>

                        <button
                          onClick={handleLoginSubmit}
                          className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 mb-6 text-sm"
                        >
                          Sign In
                        </button>

                        <div className="relative mb-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-gray-500 text-xs font-medium uppercase tracking-wider">
                              SOCIAL
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                          {socialButtons.map((social, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSocialLogin(social.text)}
                              className={`${social.color} text-white py-2.5 rounded-lg font-medium flex items-center justify-center transition-all duration-200 hover:shadow-sm`}
                            >
                              {social.icon}
                            </button>
                          ))}
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                              type="button"
                              onClick={handleFlip}
                              className="text-black font-medium hover:text-gray-700 transition-colors duration-200 inline-flex items-center group"
                            >
                              Sign up here
                              <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Features */}
                    <div className="lg:w-2/5 bg-gradient-to-b from-gray-900 to-black text-white p-8 lg:p-10 flex flex-col justify-center">
                      <div className="max-w-xs mx-auto">
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4">
                            Precision Attendance
                          </h3>
                          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            Streamline your payroll and employee tracking with
                            our ISO-certified cloud infrastructure.
                          </p>
                          <div className="space-y-4">
                            {features.slice(0, 2).map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                  {feature.icon}
                                </div>
                                <span className="text-sm font-medium">
                                  {feature.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-start space-x-2 mb-3">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">
                              "Reduced payroll errors by 95%"
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full"></div>
                            <div className="ml-3">
                              <p className="text-xs font-medium">
                                TechCorp Inc.
                              </p>
                              <p className="text-xs text-gray-400">
                                500+ Employees
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Page - Sign Up */}
              <div
                className="absolute inset-0 backface-hidden w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full border border-gray-200">
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Left Side - Features */}
                    <div className="lg:w-2/5 bg-gradient-to-b from-black to-gray-900 text-white p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
                      <div className="max-w-xs mx-auto">
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4">
                            Enterprise Features
                          </h3>
                          <div className="space-y-4">
                            {features.slice(2).map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                  {feature.icon}
                                </div>
                                <span className="text-sm font-medium">
                                  {feature.text}
                                </span>
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
                              <p className="text-xs font-medium">
                                Global Retail Co.
                              </p>
                              <p className="text-xs text-gray-400">
                                1,200+ Locations
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Sign Up Form */}
                    <div className="flex-1 p-8 lg:p-10 order-1 lg:order-2">
                      <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
                        <div className="mb-8">
                          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Create Account
                          </h2>
                          <p className="text-gray-600 text-sm">
                            Start managing attendance with precision
                          </p>
                        </div>

                        <form
                          onSubmit={handleSignupSubmit}
                          className="space-y-5"
                        >
                          <div className="space-y-4">
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                name="name"
                                value={signupForm.name}
                                onChange={handleSignupChange}
                                placeholder="Full name"
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                                required
                              />
                            </div>

                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={signupForm.email}
                                onChange={handleSignupChange}
                                placeholder="Work email"
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                                required
                              />
                            </div>

                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={signupForm.password}
                                onChange={handleSignupChange}
                                placeholder="Create password"
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={signupForm.confirmPassword}
                                onChange={handleSignupChange}
                                placeholder="Confirm password"
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="flex items-start space-x-2 cursor-pointer">
                              <div className="relative flex-shrink-0 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={agreeTerms}
                                  onChange={(e) =>
                                    setAgreeTerms(e.target.checked)
                                  }
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 border rounded transition-all duration-200 ${
                                    agreeTerms
                                      ? "bg-black border-black"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {agreeTerms && (
                                    <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-gray-700">
                                I agree to the{" "}
                                <a
                                  href="#"
                                  className="text-black font-medium hover:text-gray-700"
                                >
                                  Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                  href="#"
                                  className="text-black font-medium hover:text-gray-700"
                                >
                                  Privacy Policy
                                </a>
                              </span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={!agreeTerms}
                            className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Create Account
                          </button>

                          <div className="text-center pt-4">
                            <button
                              type="button"
                              onClick={handleFlip}
                              className="text-black font-medium hover:text-gray-700 transition-colors duration-200 inline-flex items-center group text-sm"
                            >
                              <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-0.5 transition-transform duration-200" />
                              Back to Sign In
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Corner Flip Button */}
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={handleFlip}
                className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-gray-800"
                aria-label={isFlipped ? "Flip to login" : "Flip to sign up"}
              >
                {isFlipped ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Additional CSS for 3D effects */}
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
      </div>
    </>
  );
};

export default AttendanceAuth;
