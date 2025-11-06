import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Shield, Lock, User, Mail, Eye, EyeOff } from 'lucide-react';

const RequestAccess = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
      const res = await fetch(`${BACKEND_URL}/api/access-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestReason: 'Request access to the system',
          username: form.username,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      toast({ 
        title: 'Request sent', 
        description: 'Your access request has been submitted. You will be notified when approved.' 
      });

      // Redirect to login after successful submission
      setSubmitting(false);
      navigate('/login', { 
        state: { 
          message: 'Access request submitted successfully. Please wait for approval.' 
        }
      });
    } catch (err) {
      setSubmitting(false);
      toast({ title: 'Submission failed', description: err.message || 'An error occurred', variant: 'destructive' });
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white">Request Access</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Join the Aegis Fraud Detection Platform
            </CardDescription>
          </div>
        </CardHeader>        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300 text-sm font-medium">
                Create Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Create Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                  disabled={submitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  disabled={submitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-6 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02]"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Request Access'}
            </Button>

            <div className="text-center mt-3 text-sm text-slate-400">
              Already authorized? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 underline">Back to login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestAccess;
