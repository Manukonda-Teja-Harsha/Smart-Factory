import React, { useState } from 'react';
import { Eye, EyeOff, LoaderCircle, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '../api';

export const LoginPage = ({ onLoginSuccess, compact = false }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        remember_me: rememberMe,
      });

      const { access_token, user } = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', access_token);
      storage.setItem('authUser', JSON.stringify(user));
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(user);
      }
    } catch (error) {
      const detail = error.response?.data?.detail || 'Unable to sign in. Please try again.';
      setErrors({ form: detail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${compact ? 'w-full' : 'min-h-screen bg-background flex items-center justify-center px-4 py-10'}`}>
      <div className={`w-full ${compact ? 'max-w-none' : 'max-w-md'} rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-sm`}>
        <div className="flex items-center gap-3 text-primary">
          <div className="rounded-full bg-primary/10 p-3">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Secure Access</p>
            <h1 className="text-2xl font-semibold text-slate-900">SmartFactory Login</h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-700">
          Sign in to access the manufacturing dashboard and protected operations.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {errors.form}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Mail size={18} className="text-slate-500" />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="ml-2 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Lock size={18} className="text-slate-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="ml-2 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="ml-2 text-slate-500 transition-colors hover:text-slate-900"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((value) => !value)}
                className="rounded border-slate-300 bg-white"
              />
              Remember Me
            </label>
            <span className="text-primary">Demo accounts available</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle size={18} className="mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Demo Credentials</p>
          <p className="mt-1">admin@smartfactory.com / Admin@123</p>
          <p>manager@smartfactory.com / Manager@123</p>
          <p>engineer@smartfactory.com / Engineer@123</p>
        </div>
      </div>
    </div>
  );
};
