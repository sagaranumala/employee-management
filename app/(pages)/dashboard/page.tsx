"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/auth/AuthContext";
import { useDashboardData } from "./useDashboardData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as DepartmentIcon,
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  NotificationsActive as ActivityIcon,
  Person as UserIcon,
  AccessTime as PendingIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  AttachMoney as MoneyIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  Notifications as NotificationIcon,
  Rocket as RocketIcon,
  Star as StarIcon,
  FlashOn as FlashIcon,
  Speed as SpeedIcon,
  Work as WorkIcon,
  Group as GroupIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  BusinessCenter,
  Groups,
  CorporateFare,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from 'react-countup';

// Vibrant Color Palette
const VIBRANT_COLORS = {
  primary: "#7C3AED",
  secondary: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  dark: "#1F2937",
  
  gradients: {
    purplePink: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
    blueCyan: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
    orangeRed: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    greenEmerald: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    pinkRose: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
    indigoPurple: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    yellowOrange: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
    tealCyan: "linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)",
  },
  
  chartColors: [
    "#7C3AED", "#EC4899", "#10B981", "#F59E0B",
    "#3B82F6", "#8B5CF6", "#EF4444", "#06B6D4",
    "#F97316", "#8B5CF6", "#14B8A6", "#EC4899"
  ],
  
  backgrounds: {
    dark: "#0F172A",
    cardDark: "#1E293B",
    light: "#F8FAFC",
  }
};

interface Department {
  departmentId: string;
  name: string;
  description?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  status?: number;
  createdAt?: string;
  profilePicture?: string | null;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  pendingTasks: number;
  completedTasks: number;
  totalProjects: number;
  revenue: number;
  attendance: number;
  productivity: number;
  activeEmployees: number;
  managers: number;
  interns: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  profit: number;
}

interface DepartmentData {
  name: string;
  employees: number;
  projects: number;
  color: string;
}

interface DepartmentEmployeeCount {
  name: string;
  employeeCount: number;
  color: string;
  percentage: number;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "task" | "department" | "profile" | "employee" | "project" | "meeting";
  user: string;
  avatarColor: string;
}

interface Project {
  id: number;
  name: string;
  progress: number;
  status: "active" | "completed" | "pending";
  deadline: string;
  team: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { departments, employees, loading: dataLoading } = useDashboardData();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentData[]>([]);
  const [departmentEmployeeCounts, setDepartmentEmployeeCounts] = useState<DepartmentEmployeeCount[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [animate, setAnimate] = useState(false);

  // Process dashboard data when departments and employees are loaded
  useEffect(() => {
    if (dataLoading || !departments || !employees) return;

    const processDashboardData = () => {
      try {
        setAnimate(false);

        // Calculate statistics
        const totalEmployees = employees.length;
        const totalDepartments = departments.length;
        
        // Count active employees (assuming status 1 is active)
        const activeEmployees = employees.filter(emp => emp.status === 1).length;
        
        // Count by role
        const managers = employees.filter(emp => 
          emp.role?.toLowerCase().includes('manager') || 
          emp.designation?.toLowerCase().includes('manager')
        ).length;
        
        const interns = employees.filter(emp => 
          emp.role?.toLowerCase().includes('intern') || 
          emp.designation?.toLowerCase().includes('intern')
        ).length;

        // Calculate department-wise employee counts for the new card
        const deptCounts = departments.map((dept, index) => {
          const employeeCount = employees.filter(emp => emp.departmentId === dept.departmentId).length;
          const percentage = totalEmployees > 0 ? Math.round((employeeCount / totalEmployees) * 100) : 0;
          return {
            name: dept.name,
            employeeCount,
            color: VIBRANT_COLORS.chartColors[index % VIBRANT_COLORS.chartColors.length],
            percentage
          };
        })
        .filter(dept => dept.employeeCount > 0) // Only show departments with employees
        .sort((a, b) => b.employeeCount - a.employeeCount); // Sort by employee count
        setDepartmentEmployeeCounts(deptCounts);

        // Calculate department-wise employee counts for charts
        const departmentEmployeeCount = new Map<string, number>();
        employees.forEach(emp => {
          if (emp.departmentId) {
            departmentEmployeeCount.set(
              emp.departmentId, 
              (departmentEmployeeCount.get(emp.departmentId) || 0) + 1
            );
          }
        });

        // Prepare department data for charts
        const departmentData: DepartmentData[] = departments.map((dept, index) => ({
          name: dept.name,
          employees: departmentEmployeeCount.get(dept.departmentId) || 0,
          projects: Math.floor(Math.random() * 10) + 1, // Mock data for projects
          color: VIBRANT_COLORS.chartColors[index % VIBRANT_COLORS.chartColors.length]
        }));

        // Sort departments by employee count
        departmentData.sort((a, b) => b.employees - a.employees);

        // Set stats
        setStats({
          totalEmployees,
          totalDepartments,
          pendingTasks: Math.floor(Math.random() * 30) + 10, // Mock data
          completedTasks: Math.floor(Math.random() * 200) + 50, // Mock data
          totalProjects: Math.floor(Math.random() * 50) + 20, // Mock data
          revenue: totalEmployees * 15000, // Mock revenue calculation
          attendance: Math.floor(Math.random() * 20) + 80, // Mock attendance
          productivity: Math.floor(Math.random() * 30) + 70, // Mock productivity
          activeEmployees,
          managers,
          interns,
        });

        // Set department statistics
        setDepartmentStats(departmentData);

        // Generate revenue data (mock)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const revenueData: RevenueData[] = months.map((month, index) => ({
          month,
          revenue: Math.floor(Math.random() * 80000) + 20000,
          target: Math.floor(Math.random() * 60000) + 30000,
          profit: Math.floor(Math.random() * 40000) + 10000,
        }));
        setRevenue(revenueData);

        // Generate recent activities from actual employees
        const recentActivitiesData: Activity[] = employees.slice(0, 6).map((emp, index) => {
          const activityTypes: Activity["type"][] = ["employee", "department", "task", "project", "meeting", "profile"];
          const titles = [
            "New Employee Joined",
            "Department Update",
            "Task Completed",
            "Project Launch",
            "Team Meeting",
            "Profile Updated"
          ];
          const descriptions = [
            "Welcome to the team!",
            "Department structure updated",
            "Completed assigned task",
            "New project initiated",
            "Weekly team sync completed",
            "Profile information updated"
          ];
          
          return {
            id: index + 1,
            title: titles[index % titles.length],
            description: `${emp.name} ${descriptions[index % descriptions.length]}`,
            time: `${index + 1} day${index > 0 ? 's' : ''} ago`,
            type: activityTypes[index % activityTypes.length],
            user: emp.name,
            avatarColor: VIBRANT_COLORS.chartColors[index % VIBRANT_COLORS.chartColors.length]
          };
        });
        setRecentActivities(recentActivitiesData);

        // Generate projects (mock)
        const projectNames = [
          "Mobile App Development",
          "Website Redesign",
          "Cloud Migration",
          "AI Implementation",
          "Marketing Campaign",
          "System Upgrade"
        ];
        const projectsData: Project[] = projectNames.map((name, index) => ({
          id: index + 1,
          name,
          progress: Math.floor(Math.random() * 100),
          status: index === 2 ? "completed" : index === 4 ? "pending" : "active",
          deadline: `2024-0${Math.floor(Math.random() * 6) + 3}-${Math.floor(Math.random() * 28) + 1}`,
          team: Math.floor(Math.random() * 10) + 3,
        }));
        setProjects(projectsData);

        setAnimate(true);
      } catch (err) {
        toast.error("Failed to process dashboard data");
        console.error("Dashboard data processing error:", err);
      }
    };

    processDashboardData();
  }, [departments, employees, dataLoading]);

  const getActivityIcon = (type: Activity["type"]) => {
    const icons = {
      task: <TaskIcon />,
      department: <DepartmentIcon />,
      profile: <UserIcon />,
      employee: <PeopleIcon />,
      project: <BarChartIcon />,
      meeting: <CalendarIcon />,
    };
    return icons[type];
  };

  const getStatusColor = (status: Project["status"]) => {
    return status === "active" ? VIBRANT_COLORS.success : 
           status === "completed" ? VIBRANT_COLORS.info : VIBRANT_COLORS.warning;
  };

  const statsCards = [
    { 
      label: "Total Employees", 
      value: stats?.totalEmployees || 0, 
      icon: <PeopleIcon />, 
      change: `+${stats?.activeEmployees || 0} active`,
      gradient: VIBRANT_COLORS.gradients.indigoPurple,
      delay: 0.1,
      description: `${stats?.activeEmployees || 0} active employees`
    },
    { 
      label: "Departments", 
      value: stats?.totalDepartments || 0, 
      icon: <DepartmentIcon />, 
      change: `${departmentStats.length} units`,
      gradient: VIBRANT_COLORS.gradients.greenEmerald,
      delay: 0.2,
      description: "Functional departments"
    },
    { 
      label: "Managers", 
      value: stats?.managers || 0, 
      icon: <GroupIcon />, 
      change: `${Math.round((stats?.managers || 0) / (stats?.totalEmployees || 1) * 100)}%`,
      gradient: VIBRANT_COLORS.gradients.blueCyan,
      delay: 0.3,
      description: "Leadership team"
    },
    { 
      label: "Pending Tasks", 
      value: stats?.pendingTasks || 0, 
      icon: <PendingIcon />, 
      change: "-5% this week",
      gradient: VIBRANT_COLORS.gradients.orangeRed,
      delay: 0.4,
      description: "Awaiting completion"
    },
    { 
      label: "Active Projects", 
      value: stats?.totalProjects || 0, 
      icon: <RocketIcon />, 
      change: "+3 new",
      gradient: VIBRANT_COLORS.gradients.purplePink,
      delay: 0.5,
      description: "Ongoing initiatives"
    },
    { 
      label: "Revenue", 
      value: `$${((stats?.revenue || 0) / 1000).toFixed(0)}K`, 
      icon: <MoneyIcon />, 
      change: "+23% this quarter",
      gradient: VIBRANT_COLORS.gradients.tealCyan,
      delay: 0.6,
      description: "Annual projection"
    },
    { 
      label: "Attendance", 
      value: `${stats?.attendance || 0}%`, 
      icon: <AssignmentTurnedInIcon />, 
      change: "+3% this month",
      gradient: VIBRANT_COLORS.gradients.pinkRose,
      delay: 0.7,
      description: "Current month average"
    },
    { 
      label: "Productivity", 
      value: `${stats?.productivity || 0}%`, 
      icon: <SpeedIcon />, 
      change: "+7% improvement",
      gradient: VIBRANT_COLORS.gradients.yellowOrange,
      delay: 0.8,
      description: "Team efficiency score"
    },
  ];

  const loading = authLoading || dataLoading;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col justify-center items-center"
        style={{ background: VIBRANT_COLORS.gradients.purplePink }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm" />
          <div className="absolute inset-0 w-40 h-40 rounded-full border-8 border-transparent border-t-white border-r-white/50 animate-spin" />
          <FlashIcon className="absolute inset-0 m-auto text-6xl text-white" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-3xl font-black text-white"
        >
          Loading Dashboard...
        </motion.p>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col justify-center items-center p-8"
        style={{ background: VIBRANT_COLORS.gradients.orangeRed }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 20, -20, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity 
          }}
          className="text-9xl mb-8 text-white"
        >
          ⚠️
        </motion.div>
        <Typography variant="h1" className="font-black text-7xl mb-4 text-white">
          404
        </Typography>
        <Typography variant="h4" className="text-white/90 mb-8">
          Dashboard Access Denied
        </Typography>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            className="bg-white text-black font-bold px-8 py-3 rounded-full shadow-2xl hover:bg-gray-100"
          >
            Return to Login
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8"
      style={{ 
        background: theme === "dark" 
          ? VIBRANT_COLORS.backgrounds.dark 
          : VIBRANT_COLORS.backgrounds.light 
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Top Navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="mb-8 p-6 rounded-3xl shadow-2xl"
        style={{ 
          background: theme === "dark" 
            ? VIBRANT_COLORS.backgrounds.cardDark
            : "white",
          border: theme === "dark" 
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-2xl"
              style={{ background: VIBRANT_COLORS.gradients.purplePink }}
            >
              <DashboardIcon className="text-3xl text-white" />
            </motion.div>
            <div>
              <Typography 
                variant="h4" 
                className="font-black"
                style={{ 
                  background: VIBRANT_COLORS.gradients.purplePink,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {user.role === "admin" ? "Enterprise Dashboard" : "My Workspace"}
              </Typography>
              <Typography 
                variant="body2" 
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                Welcome back, <span className="font-bold text-white">{user.name || user.email.split('@')[0]}</span>! 
                <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    background: VIBRANT_COLORS.gradients.greenEmerald,
                    color: "white"
                  }}
                >
                  {user.role === "admin" ? "👑 Administrator" : "👤 Team Member"}
                </span>
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge badgeContent={recentActivities.length} color="error">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton 
                  className="shadow-lg"
                  style={{ 
                    background: VIBRANT_COLORS.gradients.blueCyan,
                    color: "white"
                  }}
                >
                  <NotificationIcon />
                </IconButton>
              </motion.div>
            </Badge>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton 
                className="shadow-lg"
                style={{ 
                  background: VIBRANT_COLORS.gradients.greenEmerald,
                  color: "white"
                }}
                onClick={() => window.location.reload()}
              >
                <RefreshIcon />
              </IconButton>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton 
                className="shadow-lg"
                style={{ 
                  background: VIBRANT_COLORS.gradients.orangeRed,
                  color: "white"
                }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Avatar 
                className="w-14 h-14 shadow-2xl"
                style={{ 
                  background: VIBRANT_COLORS.gradients.purplePink,
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
              </Avatar>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-3 border-white"
                style={{ background: VIBRANT_COLORS.success }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <AnimatePresence>
        {stats && (
          <Grid container spacing={3} className="mb-8">
            {statsCards.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                  animate={animate ? { scale: 1, opacity: 1, rotateY: 0 } : {}}
                  transition={{ delay: stat.delay, duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    rotateX: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  }}
                >
                  <Card 
                    className="rounded-3xl overflow-hidden border-0 h-full"
                    style={{ 
                      background: stat.gradient,
                      boxShadow: "0 20px 40px rgba(124, 58, 237, 0.3)"
                    }}
                  >
                    <CardContent className="text-white p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                          >
                            {stat.icon}
                          </motion.div>
                        </div>
                        <Chip 
                          label={stat.change}
                          className="bg-white/30 text-white font-bold backdrop-blur-sm border border-white/20"
                          size="small"
                        />
                      </div>
                      
                      <motion.div
                        key={stat.value}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: stat.delay + 0.3 }}
                      >
                        <Typography variant="h2" className="font-black mb-1 text-white">
                          <CountUp 
                            end={typeof stat.value === 'string' ? parseInt(stat.value.replace(/[^0-9]/g, '')) : stat.value} 
                            duration={2.5} 
                            suffix={typeof stat.value === 'string' && stat.value.includes('%') ? '%' : 
                                   typeof stat.value === 'string' && stat.value.includes('K') ? 'K' : ''} 
                          />
                        </Typography>
                      </motion.div>
                      
                      <Typography variant="h6" className="font-bold mb-2 text-white">
                        {stat.label}
                      </Typography>
                      
                      <Typography variant="body2" className="opacity-90 mb-4 text-white/80">
                        {stat.description}
                      </Typography>
                      
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: stat.delay + 0.5, duration: 1.5 }}
                        className="h-2 bg-white/30 rounded-full overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-white rounded-full"
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{ delay: stat.delay + 0.8, duration: 2 }}
                        />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </AnimatePresence>

      {/* Charts Section with Department-wise Employee Count */}
      <Grid container spacing={4} className="mb-8">
        {/* Employee Distribution Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={animate ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Card 
              className="rounded-3xl shadow-2xl overflow-hidden border-0 h-full"
              style={{ 
                background: theme === "dark" 
                  ? VIBRANT_COLORS.backgrounds.cardDark
                  : "white",
                border: theme === "dark" 
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h5" className="font-black mb-1"
                      style={{ 
                        background: VIBRANT_COLORS.gradients.blueCyan,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      📈 Employee Distribution
                    </Typography>
                    <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      Employees per department (from API)
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Chip 
                      icon={<TrendingUpIcon />} 
                      label={`${stats?.totalEmployees} total`} 
                      style={{ 
                        background: VIBRANT_COLORS.gradients.greenEmerald,
                        color: "white",
                        fontWeight: "bold"
                      }}
                    />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ 
                        fill: theme === "dark" ? '#cbd5e1' : '#4b5563', 
                        fontWeight: 'bold',
                        fontSize: 12
                      }} 
                    />
                    <YAxis 
                      tick={{ 
                        fill: theme === "dark" ? '#cbd5e1' : '#4b5563', 
                        fontWeight: 'bold' 
                      }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '15px',
                        border: 'none',
                        background: theme === "dark" ? '#1e293b' : 'white',
                        color: theme === "dark" ? 'white' : 'black',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                      }}
                      formatter={(value) => [`${value} employees`, 'Count']}
                    />
                    <Bar 
                      dataKey="employees" 
                      radius={[8, 8, 0, 0]}
                    >
                      {departmentStats.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Department Summary */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {departmentStats.slice(0, 3).map((dept, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 rounded-xl text-center"
                      style={{ 
                        background: theme === "dark" ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        border: `1px solid ${dept.color}30`
                      }}
                    >
                      <Typography variant="body2" className="font-bold mb-1"
                        style={{ color: theme === "dark" ? '#e2e8f0' : '#374151' }}
                      >
                        {dept.name}
                      </Typography>
                      <Typography variant="h5" className="font-black"
                        style={{ color: dept.color }}
                      >
                        {dept.employees}
                      </Typography>
                      <Typography variant="caption" className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                        employees
                      </Typography>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Side Charts */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Department Distribution Pie Chart */}
            <Grid item xs={12}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={animate ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
              >
                <Card 
                  className="rounded-3xl shadow-2xl overflow-hidden border-0"
                  style={{ 
                    background: theme === "dark" 
                      ? VIBRANT_COLORS.backgrounds.cardDark
                      : "white",
                    border: theme === "dark" 
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" className="font-bold"
                        style={{ 
                          background: VIBRANT_COLORS.gradients.purplePink,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}
                      >
                        👥 Department Overview
                      </Typography>
                      <PieChartIcon className="text-purple-500" />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={departmentStats}
                          dataKey="employees"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          label={false}
                        >
                          {departmentStats.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke={theme === "dark" ? "#0f172a" : "white"}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '10px',
                            border: 'none',
                            background: theme === "dark" ? '#1e293b' : 'white',
                            color: theme === "dark" ? 'white' : 'black',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                          }}
                          formatter={(value, name) => [`${value} employees`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {departmentStats.slice(0, 4).map((dept, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + idx * 0.1 }}
                          whileHover={{ 
                            x: 5,
                            background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                          }}
                          className="flex items-center justify-between p-2 rounded-xl transition-all duration-300"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                            <Typography variant="body2" className="font-medium truncate"
                              style={{ color: theme === "dark" ? '#e2e8f0' : '#374151' }}
                            >
                              {dept.name}
                            </Typography>
                          </div>
                          <Typography variant="body2" className="font-bold"
                            style={{ color: dept.color }}
                          >
                            {dept.employees}
                          </Typography>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Productivity Chart */}
            <Grid item xs={12}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={animate ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 1.4 }}
              >
                <Card 
                  className="rounded-3xl shadow-2xl overflow-hidden border-0"
                  style={{ 
                    background: theme === "dark" 
                      ? VIBRANT_COLORS.backgrounds.cardDark
                      : "white",
                    border: theme === "dark" 
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <CardContent className="p-6">
                    <Typography variant="h6" className="font-bold mb-4"
                      style={{ 
                        background: VIBRANT_COLORS.gradients.tealCyan,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      ⚡ Team Productivity
                    </Typography>
                    <ResponsiveContainer width="100%" height={150}>
                      <RadialBarChart 
                        innerRadius="30%" 
                        outerRadius="90%" 
                        data={[{ name: 'Productivity', value: stats?.productivity || 0, fill: VIBRANT_COLORS.success }]}
                        startAngle={180}
                        endAngle={0}
                      >
                        <RadialBar 
                          background={{ fill: theme === "dark" ? '#334155' : '#e5e7eb' }}
                          dataKey="value" 
                          cornerRadius={10}
                        />
                        <text 
                          x="50%" 
                          y="50%" 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          className="text-3xl font-black"
                          fill={VIBRANT_COLORS.success}
                        >
                          {stats?.productivity}%
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between items-center mt-2">
                      <Typography variant="body2" className="font-bold"
                        style={{ color: theme === "dark" ? '#cbd5e1' : '#6b7280' }}
                      >
                        Overall Efficiency
                      </Typography>
                      <Chip 
                        label={`${stats?.activeEmployees || 0}/${stats?.totalEmployees || 0} active`}
                        size="small"
                        style={{ 
                          background: VIBRANT_COLORS.success + '20',
                          color: VIBRANT_COLORS.success,
                          fontWeight: 'bold'
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Department-wise Employee Count Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={animate ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        className="mb-8"
      >
        <Card 
          className="rounded-3xl shadow-2xl overflow-hidden border-0"
          style={{ 
            background: theme === "dark" 
              ? VIBRANT_COLORS.backgrounds.cardDark
              : "white",
            border: theme === "dark" 
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)"
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-2 rounded-2xl"
                  style={{ background: VIBRANT_COLORS.gradients.purplePink }}
                >
                  <BusinessCenter className="text-white" />
                </motion.div>
                <div>
                  <Typography variant="h5" className="font-bold"
                    style={{ 
                      background: VIBRANT_COLORS.gradients.purplePink,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    🏢 Department-wise Employee Count
                  </Typography>
                  <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                    Detailed breakdown of employees across departments
                  </Typography>
                </div>
              </div>
              <Chip 
                label={`${departmentEmployeeCounts.length} Departments`}
                style={{ 
                  background: VIBRANT_COLORS.gradients.blueCyan,
                  color: "white",
                  fontWeight: "bold"
                }}
              />
            </div>

            <Grid container spacing={3}>
              {/* Department List */}
              <Grid item xs={12} md={7}>
                <List className="space-y-2">
                  {departmentEmployeeCounts.map((dept, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <ListItem 
                        className="rounded-xl mb-2"
                        style={{ 
                          background: theme === "dark" 
                            ? "rgba(255, 255, 255, 0.03)" 
                            : "rgba(0, 0, 0, 0.02)",
                          border: `1px solid ${dept.color}20`
                        }}
                      >
                        <ListItemIcon>
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: `${dept.color}20` }}
                          >
                            <CorporateFare style={{ color: dept.color }} />
                          </div>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" className="font-bold"
                              style={{ color: theme === "dark" ? '#f1f5f9' : '#111827' }}
                            >
                              {dept.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" style={{ color: theme === "dark" ? '#94a3b8' : '#6b7280' }}>
                              {dept.employeeCount} employees • {dept.percentage}% of total
                            </Typography>
                          }
                        />
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Typography variant="h6" className="font-black" style={{ color: dept.color }}>
                              {dept.employeeCount}
                            </Typography>
                            <Typography variant="caption" className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                              Employees
                            </Typography>
                          </div>
                          <div className="w-2 h-10 rounded-full" style={{ background: dept.color }} />
                        </div>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Grid>

              {/* Summary Stats */}
              <Grid item xs={12} md={5}>
                <div className="h-full flex flex-col justify-between">
                  <div className="p-4 rounded-2xl mb-4"
                    style={{ 
                      background: theme === "dark" 
                        ? "rgba(124, 58, 237, 0.1)" 
                        : "rgba(124, 58, 237, 0.05)",
                      border: "1px solid rgba(124, 58, 237, 0.2)"
                    }}
                  >
                    <Typography variant="h6" className="font-bold mb-3 text-center"
                      style={{ color: VIBRANT_COLORS.primary }}
                    >
                      📊 Department Summary
                    </Typography>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          Total Departments:
                        </Typography>
                        <Typography variant="body1" className="font-bold"
                          style={{ color: theme === "dark" ? '#e2e8f0' : '#374151' }}
                        >
                          {stats?.totalDepartments || 0}
                        </Typography>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          Departments with Employees:
                        </Typography>
                        <Typography variant="body1" className="font-bold"
                          style={{ color: VIBRANT_COLORS.success }}
                        >
                          {departmentEmployeeCounts.length}
                        </Typography>
                      </div>
                      
                      <Divider style={{ background: theme === "dark" ? '#334155' : '#e5e7eb' }} />
                      
                      <div className="flex justify-between items-center">
                        <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          Average Employees per Dept:
                        </Typography>
                        <Typography variant="body1" className="font-bold"
                          style={{ color: VIBRANT_COLORS.info }}
                        >
                          {stats && stats.totalDepartments > 0 
                            ? Math.round(stats.totalEmployees / stats.totalDepartments)
                            : 0}
                        </Typography>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          Largest Department:
                        </Typography>
                        <Typography variant="body1" className="font-bold"
                          style={{ color: VIBRANT_COLORS.secondary }}
                        >
                          {departmentEmployeeCounts[0]?.name || 'N/A'}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Visualization */}
                  <div className="p-4 rounded-2xl"
                    style={{ 
                      background: theme === "dark" 
                        ? "rgba(255, 255, 255, 0.03)" 
                        : "rgba(0, 0, 0, 0.02)"
                    }}
                  >
                    <Typography variant="body2" className="font-semibold mb-3"
                      style={{ color: theme === "dark" ? '#cbd5e1' : '#4b5563' }}
                    >
                      Employee Distribution Progress
                    </Typography>
                    
                    {departmentEmployeeCounts.slice(0, 3).map((dept, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: theme === "dark" ? '#94a3b8' : '#6b7280' }}>
                            {dept.name}
                          </span>
                          <span className="font-bold" style={{ color: dept.color }}>
                            {dept.percentage}%
                          </span>
                        </div>
                        <LinearProgress 
                          variant="determinate" 
                          value={dept.percentage} 
                          className="h-2 rounded-full"
                          sx={{
                            backgroundColor: theme === "dark" ? '#334155' : '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${dept.color} 0%, ${dept.color}80 100%)`,
                              borderRadius: '4px'
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Section */}
      <Grid container spacing={4}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={animate ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 2.0 }}
          >
            <Card 
              className="rounded-3xl shadow-2xl overflow-hidden border-0 h-full"
              style={{ 
                background: theme === "dark" 
                  ? VIBRANT_COLORS.backgrounds.cardDark
                  : "white",
                border: theme === "dark" 
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-2 rounded-2xl"
                      style={{ background: VIBRANT_COLORS.gradients.pinkRose }}
                    >
                      <ActivityIcon className="text-white" />
                    </motion.div>
                    <div>
                      <Typography variant="h6" className="font-bold"
                        style={{ 
                          background: VIBRANT_COLORS.gradients.pinkRose,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}
                      >
                        🔔 Recent Activities
                      </Typography>
                      <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                        Based on {employees.length} employees
                      </Typography>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Chip 
                      label="Live" 
                      style={{ 
                        background: VIBRANT_COLORS.gradients.orangeRed,
                        color: "white",
                        fontWeight: "bold"
                      }}
                    />
                  </motion.div>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {recentActivities.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ 
                          x: 10,
                          background: theme === "dark" 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "rgba(0, 0, 0, 0.05)"
                        }}
                        className="flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300"
                        style={{ 
                          border: theme === "dark" 
                            ? "1px solid rgba(255, 255, 255, 0.05)"
                            : "1px solid rgba(0, 0, 0, 0.05)"
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="p-3 rounded-xl"
                          style={{ 
                            background: `${activity.avatarColor}20`,
                            color: activity.avatarColor
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <Typography variant="subtitle1" className="font-bold truncate"
                              style={{ color: theme === "dark" ? '#f1f5f9' : '#111827' }}
                            >
                              {activity.title}
                            </Typography>
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="text-xs font-bold px-2 py-1 rounded-full"
                              style={{ 
                                background: theme === "dark" ? '#334155' : '#e5e7eb',
                                color: theme === "dark" ? '#cbd5e1' : '#6b7280'
                              }}
                            >
                              {activity.time}
                            </motion.span>
                          </div>
                          <Typography variant="body2" className="mb-2"
                            style={{ color: theme === "dark" ? '#cbd5e1' : '#6b7280' }}
                          >
                            {activity.description}
                          </Typography>
                          <div className="flex items-center">
                            <Avatar 
                              className="w-6 h-6 mr-2 text-xs font-bold"
                              style={{ 
                                background: activity.avatarColor,
                                color: 'white'
                              }}
                            >
                              {activity.user.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" className="font-medium"
                              style={{ color: theme === "dark" ? '#94a3b8' : '#9ca3af' }}
                            >
                              {activity.user}
                            </Typography>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Active Projects */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={animate ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 2.2 }}
          >
            <Card 
              className="rounded-3xl shadow-2xl overflow-hidden border-0 h-full"
              style={{ 
                background: theme === "dark" 
                  ? VIBRANT_COLORS.backgrounds.cardDark
                  : "white",
                border: theme === "dark" 
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-2 rounded-2xl"
                      style={{ background: VIBRANT_COLORS.gradients.indigoPurple }}
                    >
                      <RocketIcon className="text-white" />
                    </motion.div>
                    <div>
                      <Typography variant="h6" className="font-bold"
                        style={{ 
                          background: VIBRANT_COLORS.gradients.indigoPurple,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}
                      >
                        🚀 Active Projects
                      </Typography>
                      <Typography variant="body2" className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                        Department initiatives
                      </Typography>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="contained"
                      className="rounded-full font-bold"
                      style={{ 
                        background: VIBRANT_COLORS.gradients.blueCyan,
                        color: "white"
                      }}
                    >
                      View All
                    </Button>
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  {projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 + idx * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="p-4 rounded-2xl transition-all duration-300"
                      style={{ 
                        background: theme === "dark" 
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                        border: `1px solid ${getStatusColor(project.status)}30`
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle1" className="font-bold"
                          style={{ color: theme === "dark" ? '#f1f5f9' : '#111827' }}
                        >
                          {project.name}
                        </Typography>
                        <Chip 
                          label={project.status.toUpperCase()}
                          size="small"
                          style={{ 
                            background: `${getStatusColor(project.status)}20`,
                            color: getStatusColor(project.status),
                            fontWeight: 'bold',
                            border: `1px solid ${getStatusColor(project.status)}40`
                          }}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: theme === "dark" ? '#cbd5e1' : '#6b7280' }}>
                            Progress
                          </span>
                          <span className="font-bold" style={{ color: getStatusColor(project.status) }}>
                            {project.progress}%
                          </span>
                        </div>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.progress} 
                          className="h-2 rounded-full"
                          sx={{
                            backgroundColor: theme === "dark" ? '#334155' : '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${getStatusColor(project.status)} 0%, ${getStatusColor(project.status)}80 100%)`,
                              borderRadius: '4px'
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1"
                            style={{ color: theme === "dark" ? '#94a3b8' : '#9ca3af' }}
                          >
                            <CalendarIcon fontSize="small" />
                            <span>{project.deadline}</span>
                          </div>
                          <div className="flex items-center space-x-1"
                            style={{ color: theme === "dark" ? '#94a3b8' : '#9ca3af' }}
                          >
                            <PeopleIcon fontSize="small" />
                            <span>{project.team} members</span>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconButton 
                            size="small" 
                            style={{ 
                              background: `${getStatusColor(project.status)}20`,
                              color: getStatusColor(project.status)
                            }}
                          >
                            <MoreIcon />
                          </IconButton>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Floating Quick Actions */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="fixed bottom-8 right-8 z-10"
      >
        <Button
          variant="contained"
          className="rounded-full px-8 py-4 shadow-2xl font-bold text-lg flex items-center space-x-2"
          style={{
            background: VIBRANT_COLORS.gradients.purplePink,
          }}
        >
          <FlashIcon />
          <span>Quick Actions</span>
        </Button>
      </motion.div>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${VIBRANT_COLORS.chartColors[i % VIBRANT_COLORS.chartColors.length]}20, transparent)`,
              filter: 'blur(40px)',
              opacity: 0.3,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}