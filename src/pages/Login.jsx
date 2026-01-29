import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear previous errors

        try {
            const success = await login(email, password);
            if (success) {
                navigate("/");
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* Left Column - Hero */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#F0F8FF] p-12 relative overflow-hidden">
                {/* Decorative elements could be added here */}
                <div className="z-10 mt-10">
                    <h1 className="text-5xl  font-bold text-gray-900 leading-tight mb-4">
                        Entry Portal To <br />
                        Your Online World
                    </h1>
                </div>

                <div className="flex-1 flex items-center justify-center relative z-10">
                    {/* Illustration Placeholder - Using an SVG or simple composition */}
                    <div className="relative w-80 h-80">
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/login-page-4468581-3783954.png"
                            alt="Login Illustration"
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                </div>

                <div className="z-10">
                    {/* Logo Placeholder */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">UCU</div>
                        <span className="text-xl font-bold text-gray-700 tracking-tight">UCU CMS</span>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2 flex flex-col relative min-h-screen bg-white">
                <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-12 w-full">
                    <div className="w-full max-w-md space-y-8 mx-auto">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold text-gray-900">Login to your CMS</h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">

                            {/* Username/Email Input with Floating Label style */}
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 peer h-12 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:-webkit-text-fill-color-gray-900"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute text-sm text-blue-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                >
                                    Username or Email Address
                                </label>
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 peer h-12 pr-10 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:-webkit-text-fill-color-gray-900"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                                    >
                                        Remember Me
                                    </label>
                                </div>
                                <a href="#" className="text-sm font-medium text-blue-500 hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#0070D2] hover:bg-[#005fb8] text-white font-medium py-2 rounded-md transition-all"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        "Log In"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 w-full max-w-md">
                        <div className="pt-2">
                            <Button variant="ghost" onClick={() => window.location.href = import.meta.env.VITE_FRONTEND_URL} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                go to website
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
