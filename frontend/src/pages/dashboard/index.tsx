import React, { useContext, useState } from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Card,
    CardContent,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    useMediaQuery,
    Container,
    Grid // Correct import from @mui/material
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    AccountCircle,
    TrendingUp,
    TrendingDown,
    AttachMoney,
    Person,
    LocalShipping
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../layout/Layout';
import { DashboardContext } from '../../context/dashboard-context';
import { useDashboard } from '../../hooks/useDashboard';

const drawerWidth = 240;

// Sample data
const salesData = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
];

const pieData = [
    { name: 'Desktop', value: 400, color: '#0088FE' },
    { name: 'Mobile', value: 300, color: '#00C49F' },
    { name: 'Tablet', value: 200, color: '#FFBB28' },
    { name: 'Other', value: 100, color: '#FF8042' },
];

const recentOrders = [
    { id: '#001', customer: 'John Doe', product: 'Laptop Pro', amount: '$1,299', status: 'Completed', date: '2024-01-15' },
    { id: '#002', customer: 'Jane Smith', product: 'Wireless Headphones', amount: '$199', status: 'Pending', date: '2024-01-14' },
    { id: '#003', customer: 'Bob Johnson', product: 'Smart Watch', amount: '$299', status: 'Shipped', date: '2024-01-13' },
    { id: '#004', customer: 'Alice Brown', product: 'Tablet', amount: '$599', status: 'Completed', date: '2024-01-12' },
    { id: '#005', customer: 'Charlie Wilson', product: 'Gaming Mouse', amount: '$79', status: 'Processing', date: '2024-01-11' },
];

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon, color }) => (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                        {value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                        {trend === 'up' ? (
                            <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
                        ) : (
                            <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 18 }} />
                        )}
                        <Typography
                            variant="body2"
                            sx={{
                                color: trend === 'up' ? 'success.main' : 'error.main',
                                fontWeight: 'medium'
                            }}
                        >
                            {change}
                        </Typography>
                    </Box>
                </Box>
                <Avatar sx={{ bgcolor: color, width: 56, height: 56, boxShadow: 2 }}>
                    {icon}
                </Avatar>
            </Box>
        </CardContent>
    </Card>
);

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'shipped':
            return 'info';
        case 'processing':
            return 'secondary';
        default:
            return 'default';
    }
};

const Dashboard: React.FC = () => {
    const theme = useTheme();
    const {
        dashboardData,
        loading,
        error,
        computedStats,
        refreshDashboard
    } = useDashboard();
    return (
        <Layout>
            <Box py={2} px={4}>
                <Box width="100%">
                    <Box width="100%">
                        <Container maxWidth="xl" sx={{ py: 2 }}>
                            {/* Metrics Cards */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <MetricCard
                                        title="Tickets Résolut"
                                        value={""+dashboardData?.resolvedTickets}
                                        change="+20.1%"
                                        trend="up"
                                        icon={<AttachMoney />}
                                        color={theme.palette.primary.main}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <MetricCard
                                        title="Total Users"
                                        value={""+dashboardData?.totalUsers}
                                        change="+15.3%"
                                        trend="up"
                                        icon={<Person />}
                                        color={theme.palette.success.main}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <MetricCard
                                        title="Total Tickets"
                                        value={""+dashboardData?.ticketsCreatedByMonth?.length}
                                        change="-3.2%"
                                        trend="down"
                                        icon={<ShoppingCartIcon />}
                                        color={theme.palette.warning.main}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <MetricCard
                                        title="Pending Shipments"
                                        value="152"
                                        change="+8.1%"
                                        trend="up"
                                        icon={<LocalShipping />}
                                        color={theme.palette.info.main}
                                    />
                                </Grid>
                            </Grid>

                            {/* Charts Row */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={8}>
                                    <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Sales Overview
                                        </Typography>
                                        <ResponsiveContainer width="100%" height="90%">
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                                                <YAxis stroke={theme.palette.text.secondary} />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: 6,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        boxShadow: theme.shadows[2]
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="sales"
                                                    stroke={theme.palette.primary.main}
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: theme.palette.primary.main }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke={theme.palette.secondary.main}
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: theme.palette.secondary.main }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Traffic Sources
                                        </Typography>
                                        <ResponsiveContainer width="100%" height="90%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: 6,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        boxShadow: theme.shadows[2]
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default Dashboard;