"use client";

import React, { useState } from 'react';
import { useAdmin } from '@/context/admin-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Login context handles redirect
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900/30 z-0"></div>
      
      <Card className="w-full max-w-[480px] relative z-10 border-slate-700 bg-slate-800/90 backdrop-blur-md text-white shadow-2xl p-2 sm:p-4">
        <CardHeader className="space-y-4 pb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
            <Leaf className="text-white h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">Dose care</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Secure Admin Login
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-300 font-medium text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dosecare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/60 border-slate-700 h-12 text-base text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 font-medium text-sm">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/60 border-slate-700 h-12 text-base text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="pt-6 pb-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base shadow-lg shadow-orange-500/25 transition-all rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
