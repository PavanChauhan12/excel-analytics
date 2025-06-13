"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import {
  BarChart3,
  Upload,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { handleLogin, handleSignup, handleGoogleLogin } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f2d] to-[#000814] text-white flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#a2bffe]/20 border border-[#a2bffe] p-3 rounded-xl shadow-[0_0_12px_#a2bffe]">
              <BarChart3 className="h-8 w-8 text-[#a2bffe]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#a2bffe]">Excel Analytics</h1>
          <p className="text-[#9faecb] mt-2">
            Transform your Excel data into insights
          </p>
        </div>

        <Card className="bg-[#111827] text-white border border-[#1f2937] shadow-[0_0_24px_#0ff]">
          <Tabs defaultValue="login" className="w-full px-4">
            <TabsList className="grid w-full grid-cols-2 bg-[#1e293b] text-white border border-[#334155]">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#a2bffe]">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-center mb-4 text-[#94a3b8]">
                  Sign in to access your data visualizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin(loginData, navigate);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                      <Input
                        id="login-email"
                        type="email"
                        className="bg-[#0f172a] text-white border border-cyan-500 pl-10"
                        placeholder="Enter your email"
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-[#0f172a] text-white border border-cyan-500 pl-10 pr-10"
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-cyan-400 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold shadow-[0_0_10px_#a2bffe]"
                  >
                    Sign In
                  </Button>
                </form>
                <Separator className="my-4 bg-cyan-700" />
                <Button
                  onClick={() => handleGoogleLogin(navigate)}
                  className="w-full bg-[#ff007f] hover:bg-pink-600 text-white font-bold shadow-[0_0_10px_#ff007f]"
                >
                  Continue with Google
                </Button>
              </CardContent>
            </TabsContent>

            {/* Signup */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#a2bffe]">
                  Create account
                </CardTitle>
                <CardDescription className="text-center mb-4 text-[#94a3b8]">
                  Start visualizing your Excel data today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup(signupData, navigate);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-white">First name</Label>
                      <Input
                        id="first-name"
                        className="bg-[#0f172a] text-white border border-cyan-500"
                        placeholder="John"
                        value={signupData.firstName}
                        onChange={(e) =>
                          setSignupData({ ...signupData, firstName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-white">Last name</Label>
                      <Input
                        id="last-name"
                        className="bg-[#0f172a] text-white border border-cyan-500"
                        placeholder="Doe"
                        value={signupData.lastName}
                        onChange={(e) =>
                          setSignupData({ ...signupData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        className="bg-[#0f172a] text-white border border-cyan-500 pl-10"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="bg-[#0f172a] text-white border border-cyan-500 pl-10 pr-10"
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-cyan-400 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="bg-[#0f172a] text-white border border-cyan-500 pl-10 pr-10"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({ ...signupData, confirmPassword: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-cyan-400 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold shadow-[0_0_10px_#a2bffe]"
                  >
                    Create Account
                  </Button>
                </form>

                <Separator className="my-4 bg-cyan-700" />
                <Button
                  onClick={() => handleGoogleLogin(navigate)}
                  className="w-full bg-[#ff007f] hover:bg-pink-600 text-white font-bold shadow-[0_0_10px_#ff007f]"
                >
                  Continue with Google
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center text-white">
          <p className="text-sm mb-4">What you'll get access to:</p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center">
              <Upload className="h-6 w-6 text-cyan-400 mb-2" />
              <span>Excel Upload</span>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="h-6 w-6 text-cyan-400 mb-2" />
              <span>2D/3D Charts</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="h-6 w-6 text-cyan-400 mb-2" />
              <span>Role Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
