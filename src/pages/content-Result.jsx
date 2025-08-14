import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Place as MapPinIcon,
  SportsEsports as GamepadIcon,
  MilitaryTech as CrownIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function ContestResultDeclaration() {
    const [contest, setContest] = useState(null);
    const [winners, setWinners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeclared, setIsDeclared] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSearchIndex, setActiveSearchIndex] = useState(null);
    const { id: contestId } = useParams();
    const navigate = useNavigate();

    // Mock auth token - replace with your actual auth implementation
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU1MDY2Mjc5LCJleHAiOjE3NTYzNjIyNzl9.Mk47vv4heUHy56DqGYSCpLlmcweGptiqovYC6Z5rL7I";

    const joinedUsers = useMemo(() => {
        return contest?.joined_users || [];
    }, [contest]);

    const showToast = (title, description, variant = "default") => {
        // Replace with your toast implementation
        console.log(`[${variant}] ${title}: ${description}`);
    };

    const fetchContestAndResults = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch general contest details
            const contestRes = await fetch(`https://macstormbattle-backend.onrender.com/api/contest/${contestId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!contestRes.ok) {
                throw new Error('Failed to fetch contest details');
            }
            const contestData = await contestRes.json();
            setContest(contestData);

            // Fetch prize distribution template from the new API endpoint
            const templateRes = await fetch(`https://macstormbattle-backend.onrender.com/api/contest/declare/${contestId}/result-template`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!templateRes.ok) {
                throw new Error('Failed to fetch result template');
            }
            const templateData = await templateRes.json();
            setWinners(templateData.result_template);

            // Check if results are already declared based on the template data
            const resultsAreDeclared = templateData.result_template.some(w => w.userId !== null);
            setIsDeclared(resultsAreDeclared);

        } catch (err) {
            setError(err.message || "Failed to fetch contest details");
            showToast(
                "Error",
                err.message,
                "destructive"
            );
        } finally {
            setIsLoading(false);
        }
    }, [contestId, token]);

    const updateWinner = (rank, field, value) => {
        setWinners(prev =>
            prev.map(winner =>
                winner.rank === rank
                    ? { ...winner, [field]: field === "userId" ? Number.parseInt(value) || null : value }
                    : winner
            )
        );
        if (field === "name") {
            setSearchTerm(value);
            setActiveSearchIndex(null);
        }
    };

    const handleNameInput = (rank, value) => {
        updateWinner(rank, "name", value);
        if (!value.trim()) {
            updateWinner(rank, "userId", null);
            return;
        }
        const matchingUser = joinedUsers.find(user =>
            user.user_name.toLowerCase().includes(value.toLowerCase())
        );
        if (matchingUser) {
            updateWinner(rank, "userId", matchingUser.userId);
        } else {
            updateWinner(rank, "userId", null);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return joinedUsers.filter(user =>
            user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, joinedUsers]);

    const handleKeyDown = (e, rank) => {
        if (filteredUsers.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSearchIndex(prev =>
                prev === null ? 0 : Math.min(prev + 1, filteredUsers.length - 1)
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSearchIndex(prev =>
                prev === null ? filteredUsers.length - 1 : Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && activeSearchIndex !== null) {
            e.preventDefault();
            const selectedUser = filteredUsers[activeSearchIndex];
            selectUser(rank, selectedUser);
        }
    };

    const selectUser = (rank, user) => {
        updateWinner(rank, "name", user.user_name);
        updateWinner(rank, "userId", user.userId);
        setActiveSearchIndex(null);
        setSearchTerm("");
    };

    const validateWinners = () => {
        const filledWinners = winners.filter(w => w.userId && w.name.trim());
        if (filledWinners.length === 0) return "At least one winner must be declared";

        const userIds = filledWinners.map(w => w.userId).filter(Boolean);
        const uniqueUserIds = new Set(userIds);
        if (userIds.length !== uniqueUserIds.size) return "Duplicate user IDs are not allowed";

        return null;
    };

    const declareResults = async () => {
        const validationError = validateWinners();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const filledWinners = winners.filter(w => w.userId && w.name.trim());

            const res = await fetch(`https://macstormbattle-backend.onrender.com/api/contest/declare/${contestId}/declare-result`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    winners: filledWinners.map(w => ({
                        rank: w.rank,
                        userId: w.userId,
                        name: w.name,
                        winning_amount: w.winning_amount
                    }))
                })
            });

            if (!res.ok) {
                throw new Error('Failed to declare results');
            }

            setIsDeclared(true);
            setError(null);
            showToast(
                "Success",
                "Results declared successfully!"
            );
        } catch (err) {
            setError(err.message || "Failed to declare results");
            showToast(
                "Error",
                err.message,
                "destructive"
            );
        } finally {
            setIsLoading(false);
        }
    };

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

    useEffect(() => {
        if (token) {
            fetchContestAndResults();
        }
    }, [contestId, token, fetchContestAndResults]);

    if (isLoading && !contest) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #f0f4ff, #f9f0ff)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
                    <Typography variant="h6" color="text.secondary">
                        Loading contest details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!contest) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #f0f4ff, #f9f0ff)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <ErrorIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Contest Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        The requested contest could not be loaded.
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Back to Contests
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #f0f4ff, #f9f0ff)',
            py: 4
        }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        sx={{ bgcolor: 'background.paper' }}
                    >
                        Back to Contest
                    </Button>
                </Box>

                <Card sx={{ 
                    background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                    color: 'white',
                    mb: 3
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { md: 'center' },
                            justifyContent: 'space-between',
                            gap: 3
                        }}>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <Chip 
                                        label={`Contest #${contest.id}`} 
                                        size="small" 
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                                    />
                                    <Chip 
                                        label={contest.match_status.toUpperCase()} 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: contest.match_status === "live" ? 'error.main' : 'success.main',
                                            color: 'white'
                                        }} 
                                    />
                                </Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {contest.event_name}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, opacity: 0.9 }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <GamepadIcon fontSize="small" />
                                        {contest.game}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <MapPinIcon fontSize="small" />
                                        {contest.map}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarIcon fontSize="small" />
                                        {formatDate(contest.match_schedule)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Total Prize Pool
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                    <CrownIcon sx={{ fontSize: 32, color: 'yellow.300' }} />
                                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                        ₹{contest.prize_pool.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {contest.total_winners} Winners
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {isDeclared && (
                    <Alert 
                        severity="success"
                        sx={{ mb: 3 }}
                        icon={<CheckCircleIcon fontSize="inherit" />}
                    >
                        Contest results have been successfully declared for {contest.event_name}!
                    </Alert>
                )}

                {error && (
                    <Alert 
                        severity="error"
                        sx={{ mb: 3 }}
                        icon={<ErrorIcon fontSize="inherit" />}
                    >
                        {error}
                    </Alert>
                )}

                <Card sx={{ mb: 3 }}>
                    <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrophyIcon color="warning" />
                                <Typography variant="h6" component="div">
                                    Prize Distribution & Winner Declaration
                                </Typography>
                            </Box>
                        }
                        subheader={
                            isDeclared ? "Declared winners and prize amounts" : "Fill in winner details to declare results"
                        }
                    />
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {winners.map((winner) => (
                                <Paper 
                                    key={winner.rank} 
                                    elevation={2}
                                    sx={{ 
                                        p: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        position: 'relative'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        minWidth: 120
                                    }}>
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                bgcolor: winner.rank === 1
                                                    ? 'warning.main'
                                                    : winner.rank === 2
                                                        ? 'grey.500'
                                                        : winner.rank === 3
                                                            ? 'amber.700'
                                                            : 'primary.main',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {winner.rank}
                                        </Avatar>
                                        <Chip 
                                            label={`Rank ${winner.rank}`} 
                                            color={
                                                winner.rank <= 3 
                                                    ? winner.rank === 1 
                                                        ? 'warning' 
                                                        : winner.rank === 2 
                                                            ? 'default' 
                                                            : 'primary'
                                                    : 'secondary'
                                            }
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                User ID
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                placeholder="Enter user ID"
                                                value={winner.userId || ""}
                                                onChange={(e) => updateWinner(winner.rank, "userId", e.target.value)}
                                                disabled={isDeclared}
                                            />
                                        </Box>
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Player Name
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Enter player name"
                                                value={winner.name}
                                                onChange={(e) => handleNameInput(winner.rank, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, winner.rank)}
                                                disabled={isDeclared}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <SearchIcon color="action" />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            {!isDeclared && winner.name && filteredUsers.length > 0 && (
                                                <Paper 
                                                    sx={{ 
                                                        position: 'absolute',
                                                        zIndex: 1,
                                                        width: '100%',
                                                        maxHeight: 200,
                                                        overflow: 'auto',
                                                        mt: 0.5,
                                                        boxShadow: 3
                                                    }}
                                                >
                                                    {filteredUsers.map((user, index) => (
                                                        <Box
                                                            key={user.userId}
                                                            sx={{ 
                                                                p: 1.5,
                                                                cursor: 'pointer',
                                                                bgcolor: index === activeSearchIndex ? 'action.selected' : 'background.paper',
                                                                '&:hover': {
                                                                    bgcolor: 'action.hover'
                                                                }
                                                            }}
                                                            onClick={() => selectUser(winner.rank, user)}
                                                        >
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {user.user_name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                User ID: {user.userId}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Paper>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Prize Amount
                                        </Typography>
                                        <Typography variant="h6" color="success.main" fontWeight="bold">
                                            ₹{winner.winning_amount.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    {!isDeclared ? (
                        <Button
                            onClick={declareResults}
                            disabled={isLoading}
                            size="large"
                            variant="contained"
                            sx={{
                                minWidth: 200,
                                background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #4338ca, #6d28d9)'
                                }
                            }}
                            startIcon={isLoading ? null : <TrophyIcon />}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                    Declaring Results...
                                </>
                            ) : (
                                'Declare Results'
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => navigate('/contest-list')}
                            size="large"
                            variant="contained"
                            startIcon={<PeopleIcon />}
                            sx={{ minWidth: 200 }}
                        >
                            Back to Contest List
                        </Button>
                    )}
                </Box>

                {isDeclared && (
                    <Card>
                        <CardHeader title="Declaration Summary" />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
                                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                                            {winners.filter((w) => w.userId && w.name.trim()).length}
                                        </Typography>
                                        <Typography variant="body2" color="primary.dark">
                                            Winners Declared
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                                        <Typography variant="h4" color="success.main" fontWeight="bold">
                                            ₹
                                            {winners
                                                .filter((w) => w.userId && w.name.trim())
                                                .reduce((sum, w) => sum + w.winning_amount, 0)
                                                .toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="success.dark">
                                            Prize Money Distributed
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.light' }}>
                                        <Typography variant="h4" color="secondary.main" fontWeight="bold">
                                            {contest.total_winners}
                                        </Typography>
                                        <Typography variant="body2" color="secondary.dark">
                                            Total Positions
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
                                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                                            {contest.joined_count}
                                        </Typography>
                                        <Typography variant="body2" color="warning.dark">
                                            Total Participants
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}