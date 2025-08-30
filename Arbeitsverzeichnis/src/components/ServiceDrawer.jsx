import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { ChevronLeft, ChevronRight, ArrowRight, Phone, ShieldCheck, Clock, MessageCircle, HelpCircle } from 'lucide-react';

const ServiceDrawer = () => {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth >= 1024; // nur auf Desktop initial offen
    });
    const PANEL_WIDTH = 320; // px
    const HANDLE_WIDTH = 40; // px

    // Beim Scrollen automatisch schließen
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 60 && isOpen) setIsOpen(false);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isOpen]);

    // Beim Resize auf Mobile einklappen
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth < 1024 && isOpen) setIsOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [isOpen]);

    // Diese Pfade sollten zu den entsprechenden Seiten in Ihrer App führen
    const onlineServices = [
        { name: "Solarrechner", path: "Calculator" },
        { name: "Online Kontaktanfrage", path: "Contact" },
        { name: "Häufige Fragen (FAQ)", path: "Faq" },
        { name: "Unser Serviceversprechen", path: "Service" },
        { name: "Kundeninformationen", path: "About" },
    ];

    return (
        <div
            className="fixed top-1/2 -translate-y-1/2 right-0 z-[60]"
            style={{ width: isOpen ? PANEL_WIDTH + HANDLE_WIDTH : HANDLE_WIDTH }}
        >
            {/* Wrapper anchored to right; only panel slides */}
            <div className="relative" style={{ width: PANEL_WIDTH + HANDLE_WIDTH }}>
                {/* Panel */}
                <div id="service-drawer-panel"
                    className="bg-white text-gray-900 border border-gray-200 rounded-l-2xl shadow-xl p-5 will-change-transform"
                    style={{
                        width: PANEL_WIDTH,
                        position: 'absolute',
                        right: HANDLE_WIDTH,
                        transform: `translateX(${isOpen ? 0 : PANEL_WIDTH}px)`,
                        transition: 'transform 300ms ease-out'
                    }}
                    aria-hidden={!isOpen}
                >
                    <div className="mb-4">
                        <div className="text-xs sm:text-sm text-gray-500 font-semibold">Schnell erledigen</div>
                        <h2 className="text-lg font-bold mt-1">Unsere Online-Dienste</h2>
                    </div>

                    <ul className="space-y-2 mb-5 text-base sm:text-lg">
                        {onlineServices.map((service) => (
                            <li key={service.name}>
                                <Link to={createPageUrl(service.path)} className="group flex items-center justify-between rounded-lg border border-transparent hover:border-gray-200 bg-gray-50 hover:bg-white px-3 py-2 transition-colors">
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <ArrowRight className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">{service.name}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm sm:text-base">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>Ø Antwortzeit: 2h</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>DSGVO-konform</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-base sm:text-lg">
                        <div className="text-xs text-gray-500 mb-1 font-semibold">Persönlich für Sie da</div>
                        <a href="tel:+49123456789" className="flex items-center gap-2 font-semibold text-blue-700 hover:underline">
                            <Phone className="w-4 h-4" /> 0123 456 789
                        </a>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1 ml-6">Mo–Fr, 8–18 Uhr · Rückruf innerhalb 24h</div>
                    </div>
                </div>

                {/* Handle/Trigger fixed at screen edge, visually attached */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 text-gray-700 border border-gray-200 py-4 w-10 rounded-l-full shadow-sm hover:shadow transition-all flex items-center justify-center"
                    style={{ writingMode: 'vertical-rl' }}
                    aria-controls="service-drawer-panel"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Service einfahren' : 'Service ausfahren'}
                >
                    {/* Chevron: when open, points right (close). when closed, points left (open) */}
                    {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    <span className="mt-2 font-semibold tracking-wide text-[10px] uppercase">Service</span>
                </button>
            </div>
        </div>
    );
};

export default ServiceDrawer;
