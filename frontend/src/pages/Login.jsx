import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { login, verifyOTP } from '@/services/authService';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("login"); // 'login', 'otp', or 'authenticated'
  const [loading, setLoading] = useState(false); // Loading state for button animation
  const navigate = useNavigate();

  // Handles login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show loading spinner on login button
    try {
      const result = await login(email, password);
      setStep('otp'); // Move to OTP step immediately
      localStorage.setItem('tempUserId', result.userId);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false); // Remove loading spinner after response
    }
  };

  // Handles OTP form submission
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show loading spinner on verify button
    try {
      const userId = localStorage.getItem('tempUserId');
      await verifyOTP(userId, otp);
      setStep('authenticated');
      localStorage.removeItem('tempUserId');
      localStorage.setItem('isAuthenticated', 'true');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err) {
      setError(err.message || 'An error occurred during OTP verification.');
    } finally {
      setLoading(false); // Remove loading spinner after response
    }
  };

  // Limits OTP input to alphanumeric characters and max length of 6
  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    if (value.length <= 6) {
      setOTP(value);
    }
  };

  // Toggles password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Renders the correct form based on the current step
  const renderForm = () => {
    switch (step) {
      case "login":
        return (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 block text-left">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 block text-left">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" 
               className="w-full bg-[#FF451C] hover:bg-[#FF6B4A] text-white mt-6"
              disabled={loading} // Disable button while loading
            >
             {loading ? <LoaderIcon className="animate-spin h-5 w-5" /> : 'Verify'}
            </Button>
          </form>
        );
      case "otp":
        return (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-300 block text-left">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="ABC123"
                value={otp}
                onChange={handleOTPChange}
                required
                className="w-full bg-transparent border-gray-700 text-white placeholder-gray-500 text-center text-2xl tracking-widest"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#FF451C] hover:bg-[#FF6B4A] text-white mt-6"
              disabled={loading}
            >
              {loading ? <LoaderIcon className="animate-spin h-5 w-5" /> : 'Verify'}
            </Button>
          </form>
        );
      case "authenticated":
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Authentication Successful!</h2>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 bg-[#09090B] text-gray-100">
      <div className="flex items-center justify-center">
        <div className="w-[350px] max-w-[90%] space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === "login" ? "Login" : step === "otp" ? "Verify It's You" : "Welcome"}
            </h1>
            <p className="text-sm text-gray-400 font-mono">
              {step === "login" 
                ? "Enter your email and password to login to your account" 
                : step === "otp"
                ? "We've sent a 6-digit code to your email. Please enter it below to verify your identity."
                : "You have successfully authenticated."}
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {renderForm()}
          {step === "login" && (
            <div className="text-center text-sm text-gray-400">
              <p>Disclaimer: Use your own email and password</p>
              <p>Dummy account for testing:</p>
              <p>Email: yourmail@gmail.com</p>
              <p>Password: password123</p>
            </div>
          )}
          {step === "otp" && (
            <div className="text-center text-sm text-gray-400">
              <p>Dummy OTP for testing:</p>
              <p>ABC123</p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:block">
        <img 
          src="src/assets/new.jpeg" 
          alt="Decorative background"  
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" 
        />
      </div>
    </div>
  );
}
