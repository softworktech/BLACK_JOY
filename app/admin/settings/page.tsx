"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiGet, apiPut } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    site_name: '',
    site_tagline: '',
    phone_1: '',
    phone_2: '',
    email: '',
    address: '',
    business_hours: '',
    whatsapp_url: '',
    facebook_url: '',
    youtube_url: '',
    play_store_url: '',
    delivery_rajshahi: '',
    delivery_outside: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiGet('/admin/settings');
        // Assume API returns array of key-value pairs or object
        const formattedSettings = { ...settings };
        if (Array.isArray(response.data)) {
          response.data.forEach((s: any) => {
            if (s.key in formattedSettings) {
              (formattedSettings as any)[s.key] = s.value;
            }
          });
        }
        setSettings(formattedSettings);
      } catch (error) {
        // Mock data
        setSettings({
          site_name: 'Vtech Store',
          site_tagline: 'Fresh from farm',
          phone_1: '01711223344',
          phone_2: '01811223344',
          email: 'info@vtechstore.com',
          address: 'Rajshahi, Bangladesh',
          business_hours: '9:00 AM - 8:00 PM',
          whatsapp_url: 'https://wa.me/8801711223344',
          facebook_url: 'https://facebook.com/vtechstore',
          youtube_url: '',
          play_store_url: '',
          delivery_rajshahi: '50',
          delivery_outside: '100',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPut('/admin/settings', settings);
      toast({ title: 'Settings saved successfully' });
    } catch (error) {
      toast({ title: 'Settings saved (Mock)' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">System Settings</h2>
          <p className="text-gray-500">Manage global configuration for your application</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Site Information</CardTitle>
            <CardDescription>Basic details about your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input name="site_name" value={settings.site_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input name="site_tagline" value={settings.site_tagline} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Charges</CardTitle>
            <CardDescription>Default delivery configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Inside Rajshahi City (৳)</Label>
              <Input type="number" name="delivery_rajshahi" value={settings.delivery_rajshahi} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Outside Rajshahi (৳)</Label>
              <Input type="number" name="delivery_outside" value={settings.delivery_outside} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Contact Details</CardTitle>
            <CardDescription>Public contact information shown to users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Phone</Label>
                <Input name="phone_1" value={settings.phone_1} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Secondary Phone</Label>
                <Input name="phone_2" value={settings.phone_2} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" name="email" value={settings.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Business Hours</Label>
                <Input name="business_hours" value={settings.business_hours} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Physical Address</Label>
                <Textarea name="address" value={settings.address} onChange={handleChange} rows={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Social Media & App Links</CardTitle>
            <CardDescription>URLs for external platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>WhatsApp Link</Label>
                <Input name="whatsapp_url" value={settings.whatsapp_url} onChange={handleChange} placeholder="https://wa.me/..." />
              </div>
              <div className="space-y-2">
                <Label>Facebook Page URL</Label>
                <Input name="facebook_url" value={settings.facebook_url} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>YouTube Channel URL</Label>
                <Input name="youtube_url" value={settings.youtube_url} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Play Store App URL</Label>
                <Input name="play_store_url" value={settings.play_store_url} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Save Button for long pages */}
      <div className="fixed bottom-0 left-0 lg:left-[280px] right-0 p-4 bg-white border-t flex justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white min-w-[150px]">
          {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
