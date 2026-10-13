import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-6 h-6' }) => {
  // @ts-ignore
  const IconComponent = (Icons as Record<string, React.ElementType>)[name] || Icons.GraduationCap;
  return <IconComponent className={className} />;
};

export const availableIconNames = [
  'GraduationCap',
  'Users',
  'BookOpen',
  'HeartHandshake',
  'Award',
  'Building',
  'Calendar',
  'CheckCircle',
  'ShieldCheck',
  'Sparkles',
  'Compass',
  'Library',
  'Clock',
  'FileText',
];
