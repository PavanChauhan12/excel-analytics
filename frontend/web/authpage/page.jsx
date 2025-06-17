"use client"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import { BarChart3, Upload, Eye, EyeOff, Mail, Lock, User, Shield, Crown } from "lucide-react"
import { handleLogin, handleSignup, handleGoogleLogin } from "@/services/api"
import { useNavigate } from "react-router-dom"

// Add glass effect style
const glassStyle = {
  background: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-black border border-cyan-400 p-3 rounded-md shadow-[0_0_12px_#00bfff]">
              <BarChart3 className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-cyan-400">Excel Analytics</h1>
          <p className="text-gray-400 mt-2">Transform your Excel data into insights</p>
        </div>

        <Card
          className="text-white border border-gray-800 rounded-md py-8 px-4 shadow-[8px_10px_15px_#00bfff,_-8px_-10px_15px_#ff0038] relative"
          style={glassStyle}
        >
          <Tabs defaultValue="login" className="w-full px-4">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 text-white border border-gray-700">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-400"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-red-900/30 data-[state=active]:text-red-400 data-[state=active]:border-red-400"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-cyan-400">Welcome back</CardTitle>
                <CardDescription className="text-center mb-4 text-gray-400">
                  Sign in to access your data visualizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleLogin(loginData, navigate)
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
                        className="bg-black text-white border border-cyan-400 pl-10 focus:border-cyan-300 focus:shadow-[0_0_8px_#00bfff]"
                        placeholder="Enter your email"
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                        className="bg-black text-white border border-cyan-400 pl-10 pr-10 focus:border-cyan-300 focus:shadow-[0_0_8px_#00bfff]"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-cyan-400 hover:bg-cyan-900/20"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold shadow-[0_0_10px_#00bfff] border border-cyan-400"
                  >
                    Sign In
                  </Button>
                </form>
                <Separator className="my-4 bg-gray-700" />
                <Button
                  onClick={() => handleGoogleLogin(navigate)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold border border-gray-600 shadow-[0_0_8px_#666]"
                >
                  Continue with Google
                </Button>
              </CardContent>
            </TabsContent>

            {/* Signup */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-red-400">Create account</CardTitle>
                <CardDescription className="text-center mb-4 text-gray-400">
                  Start visualizing your Excel data today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSignup(signupData, navigate)
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-white">
                        First name
                      </Label>
                      <Input
                        id="first-name"
                        className="bg-black text-white border border-red-400 focus:border-red-300 focus:shadow-[0_0_8px_#ff0038]"
                        placeholder="John"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-white">
                        Last name
                      </Label>
                      <Input
                        id="last-name"
                        className="bg-black text-white border border-red-400 focus:border-red-300 focus:shadow-[0_0_8px_#ff0038]"
                        placeholder="Doe"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        className="bg-black text-white border border-red-400 pl-10 focus:border-red-300 focus:shadow-[0_0_8px_#ff0038]"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role-select" className="text-white">
                      Role
                    </Label>
                    <div className="relative">
                      {signupData.role === "admin" ? (
                        <Crown className="absolute left-3 top-3 h-4 w-4 text-red-400 z-10" />
                      ) : (
                        <User className="absolute left-3 top-3 h-4 w-4 text-cyan-400 z-10" />
                      )}
                      <Select
                        value={signupData.role}
                        onValueChange={(value) => setSignupData({ ...signupData, role: value })}
                      >
                        <SelectTrigger
                          className={`bg-black text-white pl-10 ${
                            signupData.role === "admin"
                              ? "border border-red-400 focus:border-red-300 focus:shadow-[0_0_8px_#ff0038]"
                              : "border border-cyan-400 focus:border-cyan-300 focus:shadow-[0_0_8px_#00bfff]"
                          }`}
                        >
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border border-gray-700">
                          <SelectItem value="user" className="text-cyan-400 hover:bg-cyan-900/20 focus:bg-cyan-900/20">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>User</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin" className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4" />
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="bg-black text-white border border-red-400 pl-10 pr-10 focus:border-red-300 focus:shadow-[0_0_8px_#ff0038]"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-red-400 hover:bg-red-900/20"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="bg-black text-white border border-red-400 pl-10 pr-10 focus:border-red-300 focus:shadow-[0_0_8px_#ff0038]"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-red-400 hover:bg-red-900/20"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full font-bold border ${
                      signupData.role === "admin"
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_10px_#ff0038] border-red-400"
                        : "bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_10px_#00bfff] border-cyan-400"
                    }`}
                  >
                    {signupData.role === "admin" ? (
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Create Admin Account
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Create User Account
                      </div>
                    )}
                  </Button>
                </form>

                <Separator className="my-4 bg-gray-700" />
                <Button
                  onClick={() => handleGoogleLogin(navigate)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold border border-gray-600 shadow-[0_0_8px_#666]"
                >
                  Continue with Google
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center text-white">
          <p className="text-sm mb-4 text-gray-400">What you'll get access to:</p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center">
              <Upload className="h-6 w-6 text-cyan-400 mb-2" />
              <span className="text-gray-300">Excel Upload</span>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="h-6 w-6 text-purple-400 mb-2" />
              <span className="text-gray-300">2D/3D Charts</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-6 w-6 text-red-400 mb-2" />
              <span className="text-gray-300">Role Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
