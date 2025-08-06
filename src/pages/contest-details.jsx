import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Chip,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Avatar,
  Paper,
  Alert,
  IconButton,
  Grid
} from "@mui/material";
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  CurrencyRupee as RupeeIcon,
  Key as KeyIcon,
  Tag as HashIcon,
  Person as UserIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import ContestDeclareResult from './content-Result';

export default function ContestDetail({ onUpdate, onCreate }) {
    const [contest, setContest] = useState(null);
    const [prizeDistribution, setPrizeDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id: contestId } = useParams();
    const [showResultDeclaration, setShowResultDeclaration] = useState(false);
    const [roomCredentials, setRoomCredentials] = useState({
        room_id: '',
        room_password: '',
        room_created_by: ''
    });
    const [isEditingRoom, setIsEditingRoom] = useState(false);
    const [loadingRoom, setLoadingRoom] = useState(false);

    // Mock auth token - replace with your actual auth implementation
    const token = localStorage.getItem('authToken');

    const showToast = (title, description, variant = "default") => {
        // Replace with your toast implementation
        console.log(`[${variant}] ${title}: ${description}`);
    };

    useEffect(() => {
        if (contest) {
            loadRoomCredentials();
        }
    }, [contest]);

    const loadRoomCredentials = async () => {
        try {
            setLoadingRoom(true);
            const res = await fetch(`http://localhost:5000/api/contest/admin/${contestId}/room`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to load room credentials');
            }

            const data = await res.json();
            setRoomCredentials({
                room_id: data.room_id || '',
                room_password: data.room_password || '',
                room_created_by: data.room_created_by || ''
            });
        } catch (error) {
            showToast(
                "Error",
                error.message || "Failed to load room credentials",
                "destructive"
            );
        } finally {
            setLoadingRoom(false);
        }
    };

    const handleUpdateRoomCredentials = async () => {
        try {
            setLoadingRoom(true);
            const res = await fetch(`http://localhost:5000/api/contest/${contestId}/room`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomCredentials)
            });

            if (!res.ok) {
                throw new Error('Failed to update room credentials');
            }

            showToast(
                "Success",
                "Room credentials updated successfully!"
            );
            setIsEditingRoom(false);
            loadRoomCredentials();
            if (onUpdate) onUpdate();
        } catch (error) {
            showToast(
                "Error",
                error.message || "Failed to update room credentials",
                "destructive"
            );
        } finally {
            setLoadingRoom(false);
        }
    };

    useEffect(() => {
        loadContestDetails();
    }, [contestId]);

    const loadContestDetails = async () => {
        try {
            setLoading(true);

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [contestRes, prizeRes] = await Promise.all([
                fetch(`http://localhost:5000/api/contest/${contestId}`, { headers }),
                fetch(`http://localhost:5000/api/prize/${contestId}`, { headers })
            ]);

            if (!contestRes.ok || !prizeRes.ok) {
                throw new Error('Failed to fetch contest details');
            }

            const contestData = await contestRes.json();
            const prizeData = await prizeRes.json();

            setContest(contestData);
            setPrizeDistribution(prizeData);
        } catch (error) {
            showToast(
                "Error",
                error.message || "Failed to load contest details",
                "destructive"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleJoinContest = async () => {
        setShowResultDeclaration(true);
    };

    const handleBackToList = () => {
        setShowResultDeclaration(false);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/contest/${contestId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ match_status: newStatus })
            });

            if (!res.ok) {
                throw new Error('Failed to update status');
            }

            showToast(
                "Success",
                "Contest status updated successfully!"
            );
            loadContestDetails();
            if (onUpdate) onUpdate();
        } catch (error) {
            showToast(
                "Error",
                error.message || "Failed to update contest status",
                "destructive"
            );
        }
    };

    const handleDeleteContest = async () => {
        if (!window.confirm("Are you sure you want to delete this contest?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/contest/${contestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to delete contest');
            }

            showToast(
                "Success",
                "Contest deleted successfully!"
            );

            if (onUpdate) {
                onUpdate();
            }

            setTimeout(() => {
                navigate("/contest-list");
            }, 1500);

        } catch (error) {
            showToast(
                "Error",
                error.message || "Failed to delete contest",
                "destructive"
            );
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            live: 'success',
            upcoming: 'primary',
            completed: 'default',
            cancelled: 'error',
            delayed: 'warning'
        };
        return statusColors[status] || 'default';
    };

    const canJoinContest = (contest) => {
        if (!contest) return false;
        const now = new Date();
        const matchTime = new Date(contest.match_schedule);
        const thirtyMinsBefore = new Date(matchTime.getTime() - 30 * 60 * 1000);

        return contest.remaining_seats > 0 && now < thirtyMinsBefore && contest.match_status === 'upcoming';
    };

    if (showResultDeclaration && contest) {
        return <ContestDeclareResult contest={contest} onBack={handleBackToList} />;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (!contest) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <ErrorIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Contest Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    The requested contest could not be loaded.
                </Typography>
            </Box>
        );
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card>
                <CardHeader
                    title={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <IconButton onClick={() => navigate(-1)} size="small">
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant="h5" component="div">
                                    {contest.event_name}
                                </Typography>
                                <Chip 
                                    label={contest.match_status.toUpperCase()} 
                                    color={getStatusColor(contest.match_status)}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Chip label={contest.game} variant="outlined" size="small" />
                                <Chip label={contest.team} variant="outlined" size="small" />
                                <Chip label={contest.map} variant="outlined" size="small" />
                            </Box>
                        </Box>
                    }
                    action={
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/admin/games/contest/edit/${contestId}`)}
                            sx={{ bgcolor: 'black', color: 'white' }}
                        >
                            Edit Contest
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Left column - Contest info */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Basic info table */}
                                <Paper>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Match Schedule</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarIcon fontSize="small" color="action" />
                                                        {formatDate(contest.match_schedule)}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Entry Fee</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <RupeeIcon fontSize="small" color="action" />
                                                        {contest.joining_fee}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Prize Pool</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TrophyIcon fontSize="small" color="action" />
                                                        ₹{contest.prize_pool}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Participants</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PeopleIcon fontSize="small" color="action" />
                                                        {contest.joined_count} / {contest.room_size}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            {contest.match_sponsor && (
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Sponsor</TableCell>
                                                    <TableCell>{contest.match_sponsor}</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </Paper>

                                {/* Description card */}
                                {contest.match_description && (
                                    <Card variant="outlined">
                                        <CardHeader 
                                            title="Description" 
                                            titleTypographyProps={{ variant: 'subtitle2' }}
                                            sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
                                        />
                                        <CardContent sx={{ py: 2 }}>
                                            <Typography variant="body2">
                                                {contest.match_description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Room Credentials Section */}
                                <Card variant="outlined">
                                    <CardHeader 
                                        title="Room Credentials" 
                                        titleTypographyProps={{ variant: 'subtitle2' }}
                                        action={
                                            isEditingRoom ? (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => setIsEditingRoom(false)}
                                                        disabled={loadingRoom}
                                                        startIcon={<CloseIcon />}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={handleUpdateRoomCredentials}
                                                        disabled={loadingRoom}
                                                        startIcon={<CheckIcon />}
                                                    >
                                                        {loadingRoom ? <CircularProgress size={20} /> : "Save"}
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => setIsEditingRoom(true)}
                                                    startIcon={<EditIcon />}
                                                >
                                                    Edit
                                                </Button>
                                            )
                                        }
                                        sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
                                    />
                                    <CardContent sx={{ py: 2 }}>
                                        {isEditingRoom ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <TextField
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <HashIcon fontSize="small" />
                                                            Room ID
                                                        </Box>
                                                    }
                                                    value={roomCredentials.room_id}
                                                    onChange={(e) => setRoomCredentials({ ...roomCredentials, room_id: e.target.value })}
                                                    placeholder="Enter room ID"
                                                    fullWidth
                                                    size="small"
                                                />
                                                <TextField
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <KeyIcon fontSize="small" />
                                                            Room Password
                                                        </Box>
                                                    }
                                                    value={roomCredentials.room_password}
                                                    onChange={(e) => setRoomCredentials({ ...roomCredentials, room_password: e.target.value })}
                                                    placeholder="Enter room password"
                                                    fullWidth
                                                    size="small"
                                                />
                                                <TextField
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <UserIcon fontSize="small" />
                                                            Created By
                                                        </Box>
                                                    }
                                                    value={roomCredentials.room_created_by}
                                                    onChange={(e) => setRoomCredentials({ ...roomCredentials, room_created_by: e.target.value })}
                                                    placeholder="Enter creator name"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <HashIcon color="action" />
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Room ID
                                                        </Typography>
                                                        <Typography>
                                                            {roomCredentials.room_id || 'Not set'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <KeyIcon color="action" />
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Room Password
                                                        </Typography>
                                                        <Typography>
                                                            {roomCredentials.room_password ? '••••••••' : 'Not set'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <UserIcon color="action" />
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Created By
                                                        </Typography>
                                                        <Typography>
                                                            {roomCredentials.room_created_by || 'Not set'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Right column - Stats and actions */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Stats cards */}
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <StatCard
                                            icon={<PeopleIcon />}
                                            value={contest.remaining_seats}
                                            label="Seats Left"
                                            color="blue"
                                            compact
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <StatCard
                                            icon={<TrophyIcon />}
                                            value={contest.total_winners}
                                            label="Winners"
                                            color="purple"
                                            compact
                                        />
                                    </Grid>
                                </Grid>

                                {/* Financial breakdown */}
                                <Card variant="outlined">
                                    <CardHeader 
                                        title="Financial Breakdown" 
                                        titleTypographyProps={{ variant: 'subtitle2' }}
                                        sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
                                    />
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Total Collection</TableCell>
                                                <TableCell sx={{ textAlign: 'right' }}>₹{contest.total_collection}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Platform Cut (30%)</TableCell>
                                                <TableCell sx={{ textAlign: 'right' }}>₹{contest.platform_cut}</TableCell>
                                            </TableRow>
                                            <TableRow sx={{ bgcolor: 'success.light' }}>
                                                <TableCell sx={{ fontWeight: 'bold', color: 'success.dark' }}>Prize Pool (70%)</TableCell>
                                                <TableCell sx={{ textAlign: 'right', fontWeight: 'bold', color: 'success.dark' }}>
                                                    ₹{contest.prize_pool}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Card>

                                {/* Action buttons */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => handleJoinContest(contest.id)}
                                        fullWidth
                                    >
                                        Declare Result
                                    </Button>

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={contest.match_status}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                                label="Status"
                                            >
                                                <MenuItem value="upcoming">Upcoming</MenuItem>
                                                <MenuItem value="live">Live</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                                <MenuItem value="delay">Delayed</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleDeleteContest}
                                            fullWidth
                                            startIcon={<DeleteIcon />}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Prize distribution card */}
            <Card>
                <CardHeader
                    title="Prize Distribution"
                    subheader="How the prize pool will be distributed to winners"
                />
                <CardContent>
                    <Paper>
                        <Table>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ width: '100px', fontWeight: 'bold' }}>Rank</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Percentage</TableCell>
                                    <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>Prize Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prizeDistribution.map((prize, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {prize.rank.includes('-') ? (
                                                <Chip label={prize.rank} variant="outlined" />
                                            ) : (
                                                <Chip label={`#${prize.rank}`} />
                                            )}
                                        </TableCell>
                                        <TableCell>{(prize.percentage * 100).toFixed(1)}%</TableCell>
                                        <TableCell sx={{ textAlign: 'right', fontWeight: 'bold', color: 'success.main' }}>
                                            ₹{prize.winning_amount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </CardContent>
            </Card>
        </Box>
    );
}

function StatCard({ icon, value, label, color = 'blue', compact = false }) {
    const colorStyles = {
        blue: {
            bg: 'primary.light',
            iconBg: 'primary.main',
            text: 'primary.main'
        },
        green: {
            bg: 'success.light',
            iconBg: 'success.main',
            text: 'success.main'
        },
        purple: {
            bg: 'secondary.light',
            iconBg: 'secondary.main',
            text: 'secondary.main'
        },
        orange: {
            bg: 'warning.light',
            iconBg: 'warning.main',
            text: 'warning.main'
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: compact ? 2 : 3,
                bgcolor: colorStyles[color].bg,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}
        >
            <Avatar sx={{ 
                width: compact ? 32 : 40,
                height: compact ? 32 : 40,
                bgcolor: colorStyles[color].iconBg,
                color: 'white'
            }}>
                {React.cloneElement(icon, { fontSize: compact ? 'small' : 'medium' })}
            </Avatar>
            <Box>
                <Typography 
                    variant={compact ? 'h6' : 'h5'} 
                    component="div" 
                    fontWeight="bold"
                    color={colorStyles[color].text}
                >
                    {value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
}