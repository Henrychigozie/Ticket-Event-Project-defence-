import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";

// Fixed path: standard React structures usually use ./firebase or ../firebase
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
  Chrome,
  Check,
  Loader2,
} from "lucide-react";

const auth = getAuth(app);

const AttendanceAuth = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setLoginForm({ email: "", password: "" });
    setSignupForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const features = [
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Real-time Attendance Tracking" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Automated Reporting" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Enterprise Analytics" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Team Management" },
    { icon: <Check className="w-4 h-4 text-blue-400" />, text: "Security Dashboard" },
  ];

  const blackToast = {
    success: (msg) => toast.success(msg, { style: { background: "#000", color: "#fff", borderRadius: '10px' } }),
    error: (msg) => toast.error(msg, { style: { background: "#000", color: "#fff", borderRadius: '10px' } }),
  };

  const storeUser = (user) => {
    const tixUser = {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      uid: user.uid,
      avatar: user.photoURL || null,
    };
    localStorage.setItem("tixUser", JSON.stringify(tixUser));
    window.dispatchEvent(new Event("storage"));
  };

  /* ---------------- AUTH HANDLERS ---------------- */

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) return blackToast.error("Passwords do not match");
    if (!agreeTerms) return blackToast.error("Please agree to terms");

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, signupForm.email, signupForm.password);
      await updateProfile(cred.user, { displayName: signupForm.name });
      storeUser({ ...cred.user, displayName: signupForm.name });
      blackToast.success("Account created!");
      navigate("/");
    } catch (err) {
      blackToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      storeUser(cred.user);
      blackToast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      blackToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    if (loading) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      storeUser(result.user);
      blackToast.success("Success!");
      navigate("/");
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
      } else if (error.code !== 'auth/cancelled-popup-request') {
        blackToast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginForm.email) return blackToast.error("Enter your email first");
    try {
      await sendPasswordResetEmail(auth, loginForm.email);
      blackToast.success("Reset link sent to your email");
    } catch (err) {
      blackToast.error(err.message);
    }
  };

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          storeUser(result.user);
          navigate("/");
        }
      } catch (err) { console.error(err); }
    };
    checkRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
      <Toaster position="top-right" />
      
      <Link to="/" className="fixed top-6 left-6 z-50 p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:scale-110 transition-transform">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </Link>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[650px]">
        
        {/* INFO PANEL */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 border border-white/10">
                <Check className="text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Master your workflow <br/>with ease.</h1>
              <p className="text-gray-400 text-lg">Join 10,000+ teams managing their daily operations seamlessly.</p>
            </div>

            <div className="relative z-10 space-y-5">
              {features.slice(2).map((f, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-blue-600/20 transition-colors">
                    {f.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{f.text}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-sm italic text-gray-300 mb-4">"The most intuitive attendance system we've ever implemented. Pure efficiency."</p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    <div>
                        <p className="text-sm font-bold">Sarah Jenkins</p>
                        <p className="text-xs text-gray-500">COO at GlobalTech</p>
                    </div>
                </div>
            </div>
        </div>

        {/* AUTH FORM CONTAINER */}
        <div className="relative p-8 lg:p-16 flex items-center justify-center perspective-1000">
          <div 
            className="w-full max-w-md transition-all duration-700 preserve-3d relative h-[500px]"
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            
            {/* LOGIN FORM */}
            <div className="absolute inset-0 backface-hidden flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500">Sign in to manage your dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                    <button type="button" onClick={handleForgotPassword} className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/20 hover:bg-gray-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
              </form>

              <div className="relative my-8 text-center">
                <hr className="border-gray-100" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or login with</span>
              </div>

              <button 
                onClick={handleSocialLogin}
                disabled={loading}
                className="w-full py-3.5 border border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button onClick={handleFlip} className="text-black font-bold hover:underline">Create one</button>
              </p>
            </div>

            {/* SIGNUP FORM */}
            <div className="absolute inset-0 backface-hidden flex flex-col justify-center" style={{ transform: "rotateY(180deg)" }}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join us</h2>
                <p className="text-gray-500">Start your 14-day free trial today</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                    onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <div className="flex items-center gap-3 py-2 px-1">
                  <input 
                    type="checkbox" 
                    id="terms-check"
                    className="w-4 h-4 rounded accent-black"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label htmlFor="terms-check" className="text-xs text-gray-500 leading-tight">
                    I agree to the <span className="text-black font-bold">Terms of Service</span> and <span className="text-black font-bold">Privacy Policy</span>.
                  </label>
                </div>

                <button 
                  disabled={loading || !agreeTerms}
                  className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${
                    agreeTerms ? "bg-black text-white shadow-black/20 hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button onClick={handleFlip} className="text-black font-bold hover:underline">Log in</button>
              </p>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .perspective-1000 { perspective: 1500px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default AttendanceAuth;