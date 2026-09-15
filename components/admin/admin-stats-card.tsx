import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'yellow';
}

const colorMaps = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-white' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-white' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-white' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-white' },
  red: { bg: 'bg-rose-50', text: 'text-rose-600', iconBg: 'bg-white' },
  yellow: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-white' },
};

export function AdminStatsCard({ title, value, icon: Icon, trend, trendValue, color = 'orange' }: AdminStatsCardProps) {
  const colorStyle = colorMaps[color];

  return (
    <Card className={`border-none rounded-2xl overflow-hidden ${colorStyle.bg} shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300`}>
      <CardContent className="p-6 flex items-center gap-5">
        <div className={`p-4 rounded-xl shadow-sm ${colorStyle.iconBg} ${colorStyle.text}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {trend && trendValue && (
              <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-md ${trend === 'up' ? 'text-emerald-600 bg-emerald-100/50' : 'text-rose-600 bg-rose-100/50'}`}>
                {trend === 'up' ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                {trendValue}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
