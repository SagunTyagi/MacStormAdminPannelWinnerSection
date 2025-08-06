import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  CurrencyRupee as RupeeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function ContestList({ onContestSelect, refreshTrigger, isAdmin = false, onCreate }) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contestToDelete, setContestToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); // Replace with your auth token logic

  useEffect(() => {
    loadContests();
  }, [refreshTrigger]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const loadContests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/contest', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load contests');
      setContests(data);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinContest = async contestId => {
    try {
      const response = await fetch(`/api/contest/${contestId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to join contest');

      showSnackbar('Successfully joined the contest!');
      loadContests();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleStatusChange = async (contestId, newStatus) => {
    try {
      const response = await fetch(`/api/contest/${contestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update status');

      showSnackbar('Contest status updated successfully!');
      loadContests();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleDeleteContest = async () => {
    try {
      const response = await fetch(`/api/contest/${contestToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete contest');

      showSnackbar('Contest deleted successfully!');
      setDeleteDialogOpen(false);
      loadContests();
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleViewDetails = contestId => {
    navigate(`/admin/games/contest/${contestId}`);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'live':
        return 'success';
      case 'upcoming':
        return 'primary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      case 'delayed':
        return 'warning';
      default:
        return 'default';
    }
  };

  const canJoinContest = contest => {
    if (!contest) return false;
    const now = new Date();
    const matchTime = new Date(contest.match_schedule);
    const thirtyMinsBefore = new Date(matchTime.getTime() - 30 * 60 * 1000);
    return (
      contest.remaining_seats > 0 &&
      now < thirtyMinsBefore &&
      contest.match_status === 'upcoming'
    );
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton width="80%" />}
                subheader={<Skeleton width="60%" />}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={100} />
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                  <Skeleton width="100%" height={36} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            All Contests
          </Typography>
          <Chip
            label={`${contests.length} Total Contests`}
            variant="outlined"
            size="small"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/contest-create')}
        >
          Create Contest
        </Button>
      </Box>

      <Grid container spacing={3}>
        {contests.map(contest => (
          <Grid item xs={12} sm={6} md={4} key={contest.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardHeader
                title={contest.event_name}
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrophyIcon fontSize="small" />
                    <Typography variant="body2">{contest.game}</Typography>
                  </Box>
                }
                action={
                  <Chip
                    label={contest.match_status.toUpperCase()}
                    color={getStatusColor(contest.match_status)}
                    size="small"
                    sx={{ textTransform: 'uppercase' }}
                  />
                }
                sx={{ pb: 1 }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                {contest.banner_image_url && (
                  <Box
                    component="img"
                    src={contest.banner_image_url || '/placeholder.svg'}
                    alt={contest.event_name}
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 2
                    }}
                  />
                )}

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {contest.remaining_seats}/{contest.room_size}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RupeeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {contest.joining_fee}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {new Date(contest.match_schedule).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Prize Pool:
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      ₹{contest.prize_pool}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Winners:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {contest.total_winners}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => handleViewDetails(contest.id)}
                  sx={{ mb: 1 }}
                >
                  View Details
                </Button>

                {isAdmin && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <FormControl size="small" sx={{ flexGrow: 1 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={contest.match_status}
                          onChange={e => handleStatusChange(contest.id, e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="upcoming">Upcoming</MenuItem>
                          <MenuItem value="live">Live</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                          <MenuItem value="delayed">Delayed</MenuItem>
                        </Select>
                      </FormControl>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/admin/contests/edit/${contest.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setContestToDelete(contest.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {contests.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <TrophyIcon sx={{ fontSize: 48, color: 'grey.400' }} />
          <Typography variant="h6" color="text.secondary">
            No Contests Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your first contest to get started!
          </Typography>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete the contest and all its data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteContest}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}