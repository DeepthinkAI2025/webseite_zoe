import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Calculator, Award, Shield, Users, Wrench, Zap, BookOpen, BadgeCheck } from 'lucide-react';

export default function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const isActive = (p) => location.pathname === createPageUrl(p);

  const items = [
    { icon: Home, label: 'Startseite', to: 'Home' },
    { icon: Calculator, label: 'Solarrechner', to: 'Calculator' },
    { icon: Award, label: 'Unser Versprechen', to: 'WhyUs' },
    { icon: Shield, label: 'Technologie', to: 'Technology' },
    { icon: Users, label: 'Referenzen', to: 'SuccessStories' },
    { icon: BookOpen, label: 'Ratgeber & Blog', to: 'Blog' },
    { icon: Wrench, label: 'Service & Wartung', to: 'Service' },
    { icon: Zap, label: 'Preise & Finanzierung', to: 'Pricing' },
    { icon: BadgeCheck, label: 'Impressum', to: 'Imprint' },
    { icon: Shield, label: 'Datenschutz', to: 'Privacy' },
  ];

  return (
    <aside className="hidden lg:block w-12 shrink-0">
      <div className="sticky top-24 flex flex-col items-center space-y-2 py-4">
        {items.map((item, index) => (
          <div key={item.to} className="relative">
            <Link
              to={createPageUrl(item.to)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isActive(item.to)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </Link>

            {/* Tooltip */}
            {hoveredItem === index && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                <div className="bg-gray-900 text-white text-[15px] sm:text-base px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
