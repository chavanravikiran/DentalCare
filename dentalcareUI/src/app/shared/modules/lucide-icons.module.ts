import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { icons} from 'lucide';

const selectedIcons = {
  // Basic icons
  Calendar: icons.Calendar,
  CalendarDays: icons.CalendarDays,
  ChevronRight: icons.ChevronRight,
  UserPlus: icons.UserPlus,

  // Icons for statistics
  Users: icons.Users,
  DollarSign: icons.DollarSign,
  AlertTriangle: icons.AlertTriangle,
  Clock: icons.Clock,
  ArrowUpRight: icons.ArrowUpRight,

  // Icons for the theme
  Sun: icons.Sun,
  Moon: icons.Moon,

  // Medical icons
  Stethoscope: icons.Stethoscope,
  Pill: icons.Pill,
  HeartPulse: icons.HeartPulse,
  Activity: icons.Activity,
  Sparkles: icons.Sparkles,
  Stars: icons.Stars,

  // Icons for the stock
  Box: icons.Box,
  Package: icons.Package,

  // Icons for staff
  Users2: icons.Users2,
  UserCog: icons.UserCog,
  UserCheck: icons.UserCheck,

  // Notification icons
  Bell: icons.Bell,
  BellRing: icons.BellRing,
  BellOff: icons.BellOff,

  // Navigation icons
  LayoutDashboard: icons.LayoutDashboard,
  Home: icons.Home,
  Settings: icons.Settings,
  LogOut: icons.LogOut,
  ArrowLeft: icons.ArrowLeft,


  // Icons for actions
  Plus: icons.Plus,
  Search: icons.Search,
  Filter: icons.Filter,
  MoreVertical: icons.MoreVertical,
  User: icons.User,
  Sliders: icons.Sliders,
  Shield: icons.Shield,

  // Icons for statuses
  Check: icons.Check,
  CheckCircle: icons.CheckCircle,
  X: icons.X,
  XCircle: icons.XCircle,
  AlertCircle: icons.AlertCircle,
  Info: icons.Info,

  // Icons for files and documents
  File: icons.File,
  FileText: icons.FileText,
  FileCheck: icons.FileCheck,
  FileX: icons.FileX,
  FilePlus: icons.FilePlus,
  FileMinus: icons.FileMinus,

  // Additional icons
  MessageSquare: icons.MessageSquare,
  Printer: icons.Printer,
  Download: icons.Download,
  Upload: icons.Upload,
  RefreshCw: icons.RefreshCw,
  Trash2: icons.Trash2,
  Edit: icons.Edit,
  Eye: icons.Eye,
  Lock: icons.Lock,
  Unlock: icons.Unlock,
  Star: icons.Star,
  HelpCircle: icons.HelpCircle,
  ExternalLink: icons.ExternalLink,
  Menu: icons.Menu,
  BarChart2: icons.BarChart2,
  PieChart: icons.PieChart,
  LineChart: icons.LineChart,
  TrendingUp: icons.TrendingUp,
  TrendingDown: icons.TrendingDown,
  CreditCard: icons.CreditCard,
  Mail: icons.Mail,
  Phone: icons.Phone,
  MapPin: icons.MapPin,
  Globe: icons.Globe,

};

@NgModule({
  imports: [LucideAngularModule.pick(selectedIcons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
