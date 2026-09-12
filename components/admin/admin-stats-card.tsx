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
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
};

export function AdminStatsCard({ title, value, icon: Icon, trend, trendValue, color = 'orange' }: AdminStatsCardProps) {
  const colorStyle = colorMaps[color];

  return (
    <Card className="shadow-sm border-gray-100">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-4 rounded-xl ${colorStyle.bg} ${colorStyle.text}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && trendValue && (
              <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {trendValue}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
