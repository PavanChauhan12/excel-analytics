"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react"; // Removed BarChart3, TrendingUp, Users, Shield as they are not used in the new left panel
import { handleLogin, handleSignup, handleGoogleLogin } from "@/services/api";
import { useNavigate } from "react-router-dom";
import Particles from "@/components/ui/particles";

// Glass style for the right-side card
const glassStyle = {
  background: "rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      await handleGoogleLogin(response, navigate);
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const initiateGoogleLogin = () => {
    if (window.google && window.google.accounts) {
      setGoogleLoading(true);
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const buttonDiv = document.getElementById("google-signin-button");
            if (buttonDiv) {
              buttonDiv.innerHTML = "";
              window.google.accounts.id.renderButton(buttonDiv, {
                theme: "outline",
                size: "large",
                width: "100%",
                text: "continue_with",
                shape: "rectangular",
              });
              buttonDiv.style.display = "block";
            }
          }
          setGoogleLoading(false);
        });
      } catch (error) {
        console.error("Google Sign-In error:", error);
        setGoogleLoading(false);
      }
    } else {
      console.error("Google Sign-In not loaded");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden text-white">
      {/* Background particles */}
      <div className="absolute inset-0 z-0 h-full">
        <Particles />
      </div>

      {/* Foreground content - Main container for the two columns */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center lg:p-8">
        {/* LEFT SIDE: Info Card - Styled to match the image */}
        <div
          className="flex-1 flex items-center justify-center p-12 rounded-2xl shadow-2xl  lg:m-8"
          style={{
            background: `linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(41, 158, 225, 0.17) 40%,
      rgba(255, 0, 25, 0.15) 100%
    )`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.2),
      0 0 10px rgba(0, 238, 255, 0.4),
      0 0 20px rgba(255, 0, 85, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="max-w-md text-left text-white space-y-8">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              <span className="block">Visualize Instantly.</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-red-400 text-transparent bg-clip-text px-2 py-1 rounded-md inline-block">
                Excel Analytics.
              </span>
            </h1>

            <div className="space-y-10 mt-10">
              {/* Feature 1 */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-md bg-cyan-500 bg-opacity-20 border border-cyan-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="cyan"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bar-chart-3"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M18 17v-6" />
                      <path d="M13 17V9" />
                      <path d="M8 17V5" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Instant Excel Upload
                  </h2>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Drag and drop your Excel files to immediately begin exploring
                  data. Our platform parses sheets and prepares it for fast
                  visual analysis.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-md bg-red-500 bg-opacity-10 border border-red-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-presentation-chart"
                    >
                      <path d="M2 3h20" />
                      <path d="M4 3v13a8 8 0 0 0 16 0V3" />
                      <path d="M12 12v5" />
                      <path d="M8 12v3" />
                      <path d="M16 12v2" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    2D & 3D Chart Builder
                  </h2>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Instantly generate interactive 2D and 3D visualizations from
                  your data — no coding required. Customize and share with ease.
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-md bg-purple-500 bg-opacity-20 border border-purple-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="purple"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user-cog"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21a10.3 10.3 0 0 1 13 0" />
                      <path d="M18.5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      <path d="M21 17h-0.5" />
                      <path d="M17 17h-0.5" />
                      <path d="M18.5 19.5v-0.5" />
                      <path d="M18.5 14.5v-0.5" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    User-Friendly Dashboard
                  </h2>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Navigate and analyze with ease. Our UI is built for clarity —
                  making insights accessible for everyone on your team.
                </p>
              </div>
            </div>

            
          </div>

          {/* RIGHT SIDE: Auth Form - Kept as provided in the prompt */}
          <div className="flex-1 flex items-center justify-center">
            <Card
              className="w-full max-w-md text-white border border-gray-800 rounded-xl py-8 px-4 relative overflow-hidden"
              style={glassStyle}
            >
              

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full px-4"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-900 text-white border border-gray-700 rounded-lg mb-6">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r from-cyan-700 to-cyan-900 data-[state=active]:text-cyan-300 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-lg text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r from-red-700 to-red-900 data-[state=active]:text-red-300 data-[state=active]:border-b-2 data-[state=active]:border-red-400 rounded-lg text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login content */}
                <TabsContent value="login">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-cyan-400 font-bold">
                      Welcome back
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      Sign in to access your data visualizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(loginData, navigate);
                      }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          className="bg-black text-white border border-cyan-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          placeholder="your.email@example.com"
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-black text-white border border-cyan-600 pr-10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-cyan-400 hover:bg-cyan-900/20"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 rounded-lg transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </form>
                    <Separator className="my-6 bg-gray-700" />
                    <Button
                      onClick={initiateGoogleLogin}
                      disabled={googleLoading}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold border border-gray-600 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {googleLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>
                    <div
                      id="google-signin-button"
                      className="w-full mt-2"
                      style={{ display: "none" }}
                    ></div>
                  </CardContent>
                </TabsContent>

                {/* Signup content */}
                <TabsContent value="signup">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-red-400 font-bold">
                      Create account
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      Start visualizing your Excel data today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSignup({ ...signupData, role: "user" }, navigate);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input
                            id="first-name"
                            className="bg-black text-white border border-red-600 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            placeholder="John"
                            value={signupData.firstName}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input
                            id="last-name"
                            className="bg-black text-white border border-red-600 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            placeholder="Doe"
                            value={signupData.lastName}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          className="bg-black text-white border border-red-600 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                          placeholder="your.email@example.com"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-black text-white border border-red-600 pr-10 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            value={signupData.password}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-red-400 hover:bg-red-900/20"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-black text-white border border-red-600 pr-10 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                            value={signupData.confirmPassword}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-red-400 hover:bg-red-900/20"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full font-bold py-2 rounded-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white"
                      >
                        Create Account
                      </Button>
                    </form>
                    <Separator className="my-6 bg-gray-700" />
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
