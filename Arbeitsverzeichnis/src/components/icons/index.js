// Selektive Icon Re-Exports – erleichtert künftiges Swappen oder On-Demand Laden.
// Aktuell direkte Re-Exports aus lucide-react; optional: eigene Wrapper mit <Icon name="..."/> lazy.
export { 
  // Core UI
  Sun, Phone, Mail, ChevronDown, ChevronUp, Menu, X, Zap, Battery, Award, Shield, Home as HomeIcon, Calculator as CalcIcon, Users, Star, Globe, ArrowUp, MessageSquare, Wrench,
  MessageCircle, PhoneCall, MapPin, TrendingUp, CheckCircle, BarChart, Clock, Quote, ArrowRight, Euro, Heart, Gift, ShieldCheck, FileCheck, HelpCircle, ChevronLeft, ChevronRight, Leaf, AlertTriangle, Calendar, Send, AlertCircle, ArrowLeft,
  // Extended (aktiv genutzt in Features / Seiten)
  Car, BatteryCharging, PanelTop, Cpu, // Tech + Planner
  BookOpen, BadgeCheck // Sidebar / Navigation & Testimonials (Quote oben bereits enthalten)
} from 'lucide-react';
// On-Demand Loader (Phase 2b) – für sehr selten genutzte Icons
export { DynamicIcon } from './dynamic-icon.jsx';
// Pruned unbenutzte/derzeit nicht referenzierte Icons: DollarSign, FileText, PieChart, HardDrive, Server, Smartphone, Thermometer, Activity, Cloud, Truck, Building, Factory
// Falls künftig benötigt → wieder hinzufügen (Audit Script kann warnen)
// Hinweis: Einige Komponenten aliasen Icons lokal (z.B. CalcIcon, HomeIcon)
