import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, signup, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isSignUp) {
                const passwordError = validatePassword(password);
                if (passwordError) {
                    setError(passwordError);
                    setLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setLoading(false);
                    return;
                }
                await signup(email, password, fullName);
                setError('');
                setSuccess('Account created. Please check your email to confirm your account before logging in.');
                setIsSignUp(false);
                setPassword('');
                setConfirmPassword('');
                setFullName('');
            } else {
                await login(email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const confirmed = searchParams.get('confirmed');
        if (confirmed === '1') {
            setSuccess('Email confirmed. Please sign in to continue.');
            logout().catch(() => {});
        }
    }, [searchParams, logout]);

    useEffect(() => {
        if (success || error) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }, [success, error]);

    return (
        <div className="py-20 flex justify-center items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <div className="container" style={{ maxWidth: '480px' }}>
                <div className="glass-card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p style={{ color: 'var(--gray-500)', marginBottom: 0 }}>
                            {isSignUp
                                ? 'Create an account so we can save your report and unlock downloads'
                                : 'Log in so we can save your report and unlock downloads'
                            }
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-box flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="status-indicator success" style={{ justifyContent: 'center' }}>
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {isSignUp && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="fullName">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="form-input"
                                    placeholder="Your full name"
                                    autoComplete="name"
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="password">
                                <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                autoComplete={isSignUp ? "new-password" : "current-password"}
                                minLength={isSignUp ? 8 : 6}
                            />
                            {isSignUp && (
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.5rem', marginBottom: 0 }}>
                                    Must be at least 8 characters, including uppercase, lowercase, number, and symbol
                                </p>
                            )}
                        </div>

                        {isSignUp && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" htmlFor="confirmPassword">
                                    <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    minLength={8}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg"
                            disabled={loading}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    {/* Toggle Sign Up / Login */}
                    <div className="text-center" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-200)' }}>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                                setSuccess('');
                                setPassword('');
                                setConfirmPassword('');
                                setFullName('');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '1rem',
                                textDecoration: 'underline'
                            }}
                        >
                            {isSignUp ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center" style={{ marginTop: '1.5rem' }}>
                        <Link
                            to="/"
                            style={{
                                color: 'var(--gray-500)',
                                fontSize: '0.875rem',
                                textDecoration: 'none'
                            }}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function validatePassword(password) {
    if (password.length < 8) {
        return 'Password must be at least 8 characters.';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must include at least one lowercase letter.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must include at least one uppercase letter.';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must include at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/.test(password)) {
        return 'Password must include at least one symbol.';
    }
    return '';
}

