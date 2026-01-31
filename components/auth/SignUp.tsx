'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ← important for app router
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();

  type SignUpFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    membershipType: string;
    agreeToTerms: boolean;
  };

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    membershipType: 'starter',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const name = target.name;
    const value = target.value;
    const isCheckbox = (target as HTMLInputElement).type === 'checkbox';
    const checked = isCheckbox ? (target as HTMLInputElement).checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    } as unknown as SignUpFormData));

    // Clear error when user starts typing again
    if ((errors as Record<string, string>)[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // You can add more rules (email format, phone format, etc.)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // ────────────────────────────────────────────────
      // Replace this block with your real signup logic
      // (fetch('/api/signup', { method: 'POST', body: JSON.stringify(formData) }))
      // ────────────────────────────────────────────────

      // Simulated delay + response
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const shouldSucceed = Math.random() > 0.3; // ~70% success rate for demo

      if (!shouldSucceed) {
        // Simulate common backend errors
        if (Math.random() > 0.5) {
          throw new Error('Email already in use. Please use another email.');
        } else {
          throw new Error('Account creation failed. Please try again.');
        }
      }

      // Success case
      setSuccessMessage('Account created successfully! Redirecting...');
      
      // Redirect after short delay so user can see success message
      setTimeout(() => {
        router.push('/home');
      }, 1800);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || 'Something went wrong. Please try again.');
      } else {
        setSubmitError(String(err) || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Keep your existing <style jsx global> ... */ }
      {/* ... grain, animations, etc. ... */}

      <div className="grain"></div>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="relative z-10 p-6">{/* ... logo ... */}</header>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-8 animate-slide-in-up">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif', lineHeight: '1' }}>
              JOIN THE <span className="block text-red-500">LEGION</span>
            </h1>
            <p className="text-gray-400 text-lg">Start your transformation today</p>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-gray-800 p-6 sm:p-8 md:p-10 animate-slide-in-up stagger-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── Name fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border-2 border-gray-800 px-4 py-3 focus:border-red-500 transition-colors"
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border-2 border-gray-800 px-4 py-3 focus:border-red-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full bg-black/50 border-2 px-4 py-3 focus:border-red-500 transition-colors ${
                    errors.email || submitError?.includes('Email') ? 'border-red-500' : 'border-gray-800'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border-2 border-gray-800 px-4 py-3 focus:border-red-500 transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full bg-black/50 border-2 px-4 py-3 pr-12 focus:border-red-500 transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-800'
                      }`}
                      placeholder="••••••••"
                    />
                    {/* eye icon button ... (keep your existing toggle) */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                    >
                      {/* your SVG eye icons */}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full bg-black/50 border-2 px-4 py-3 pr-12 focus:border-red-500 transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-800'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                    >
                      {/* your SVG eye icons */}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Membership */}
              <div>{/* keep your select ... */}</div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 w-5 h-5 bg-black/50 border-2 border-gray-800 accent-red-500"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-400 cursor-pointer">
                  I agree to the <a href="#" className="text-red-500 hover:underline">Terms & Conditions</a>...
                </label>
              </div>

              {/* Global submit error */}
              {submitError && (
                <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-900/40 border border-green-600 text-green-200 px-4 py-3 rounded">
                  {successMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-red-500 hover:bg-red-600 py-4 font-bold text-lg transition-all transform hover:scale-105 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? 'cursor-wait' : ''
                }`}
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Divider + social buttons ... keep as is */}
            </form>
          </div>

          <div className="text-center mt-8 animate-slide-in-up stagger-3">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/signin" className="text-red-500 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}