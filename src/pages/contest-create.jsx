import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  AttachMoney as DollarIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function ContestForm({ onSuccess }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const contestId = id;
  const isEditMode = !!contestId;
  const token = localStorage.getItem('authToken'); // Replace with your auth token logic

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    room_size: 100,
    joining_fee: 50,
    total_winners: 10,
    game: '',
    team: '',
    map: '',
    match_schedule: '',
    banner_image_url: '',
    prize_description: '',
    match_sponsor: '',
    match_description: '',
    match_private_description: '',
  });

  const [distributionRows, setDistributionRows] = useState([
    { id: '1', rank: '1', percentage: 40 },
    { id: '2', rank: '2', percentage: 25 },
    { id: '3', rank: '3', percentage: 15 },
    { id: '4', rank: '4-10', percentage: 20 },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isEditMode) {
      const loadContestData = async () => {
        try {
          setLoading(true);
          const [contestRes, prizeRes] = await Promise.all([
            fetch(`https://macstormbattle-backend.onrender.com/api/contest/${contestId}`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch(`https://macstormbattle-backend.onrender.com/api/prize/${contestId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          if (!contestRes.ok || !prizeRes.ok) {
            throw new Error('Failed to load contest data');
          }

          const contestData = await contestRes.json();
          const prizeData = await prizeRes.json();

          setFormData({
            event_name: contestData.event_name,
            room_size: contestData.room_size,
            joining_fee: contestData.joining_fee,
            total_winners: contestData.total_winners,
            game: contestData.game,
            team: contestData.team,
            map: contestData.map,
            match_schedule: contestData.match_schedule,
            banner_image_url: contestData.banner_image_url || '',
            prize_description: contestData.prize_description || '',
            match_sponsor: contestData.match_sponsor || '',
            match_description: contestData.match_description || '',
            match_private_description: contestData.match_private_description || '',
          });

          setDistributionRows(
            prizeData.map((prize, index) => ({
              id: index.toString(),
              rank: prize.rank,
              percentage: prize.percentage
            }))
          );
        } catch (error) {
          showSnackbar(error.message || 'Failed to load contest data', 'error');
          navigate('/contest-list');
        } finally {
          setLoading(false);
        }
      };
      loadContestData();
    }
  }, [contestId, isEditMode, navigate, token]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const addDistributionRow = () => {
    const newRow = {
      id: Date.now().toString(),
      rank: '',
      percentage: 0
    };
    setDistributionRows([...distributionRows, newRow]);
  };

  const removeDistributionRow = id => {
    setDistributionRows(distributionRows.filter(row => row.id !== id));
  };

  const updateDistributionRow = (id, field, value) => {
    setDistributionRows(
      distributionRows.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const getTotalPercentage = () => {
    return distributionRows.reduce((sum, row) => sum + (Number(row.percentage) || 0), 0);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const totalPercentage = getTotalPercentage();

    if (totalPercentage !== 100) {
      showSnackbar(
        `Total percentage must equal 100%. Current total: ${totalPercentage}%`,
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      const distribution = {};
      distributionRows.forEach(row => {
        if (row.rank && row.percentage > 0) {
          distribution[row.rank] = row.percentage;
        }
      });

      const url = isEditMode
        ? `https://macstormbattle-backend.onrender.com/api/contest/${contestId}/edit`
        : 'https://macstormbattle-backend.onrender.com/api/contest/create';

      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          distribution
        })
      });

      if (!response.ok) {
        throw new Error(
          isEditMode ? 'Failed to update contest' : 'Failed to create contest'
        );
      }

      showSnackbar(
        isEditMode
          ? 'Contest updated successfully!'
          : 'Contest created successfully!',
        'success'
      );

      if (!isEditMode) {
        setFormData({
          event_name: '',
          room_size: 100,
          joining_fee: 50,
          total_winners: 10,
          game: '',
          team: '',
          map: '',
          match_schedule: '',
          banner_image_url: '',
          prize_description: '',
          match_sponsor: '',
          match_description: '',
          match_private_description: ''
        });
        setDistributionRows([
          { id: '1', rank: '1', percentage: 40 },
          { id: '2', rank: '2', percentage: 25 },
          { id: '3', rank: '3', percentage: 15 },
          { id: '4', rank: '4-10', percentage: 20 }
        ]);
      }

      if (onSuccess) onSuccess();
      setTimeout(() => navigate('/contest-list'), 1500);
    } catch (error) {
      showSnackbar(
        error.message ||
          (isEditMode
            ? 'Failed to update contest. Please try again.'
            : 'Failed to create contest. Please try again.'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPercentage = getTotalPercentage();
  const isValidDistribution = totalPercentage === 100;

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', p: 2 }}>
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


      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, bgcolor: 'black', color: 'white' }}
      >
        Back
      </Button>

      <Card
        sx={{
          border: 'none',
          boxShadow: 3,
          background: 'linear-gradient(to bottom right, #f0f4ff, #f9f0ff)'
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" component="div">
              {isEditMode ? 'Edit Contest' : 'Create New Contest'}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? 'Update the contest details'
                : 'Fill in the details to create an exciting tournament'}
            </Typography>
          }
          sx={{
            color: 'white',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)'
          }}
        />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                bgcolor: 'white',
                p: 3,
                mb: 3,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <InfoIcon color="primary" sx={{ mr: 1 }} />
                Basic Information
              </Typography>

              <Box
                sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 3 }}
              >
                <TextField
                  label="Event Name *"
                  value={formData.event_name}
                  onChange={e =>
                    setFormData({ ...formData, event_name: e.target.value })
                  }
                  fullWidth
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Game *</InputLabel>
                  <Select
                    value={formData.game}
                    onChange={e =>
                      setFormData({ ...formData, game: e.target.value })
                    }
                    label="Game *"
                  >
                    <MenuItem value="PUBG Mobile">PUBG Mobile</MenuItem>
                    <MenuItem value="Free Fire">Free Fire</MenuItem>
                    <MenuItem value="Call of Duty">Call of Duty</MenuItem>
                    <MenuItem value="Valorant">Valorant</MenuItem>
                    <MenuItem value="CS:GO">CS:GO</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr 1fr 1fr' },
                  gap: 3,
                  mt: 3
                }}
              >
                <TextField
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                      Room Size *
                    </Box>
                  }
                  type="number"
                  value={formData.room_size}
                  onChange={e =>
                    setFormData({ ...formData, room_size: parseInt(e.target.value) })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />

                <TextField
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DollarIcon color="success" sx={{ mr: 1, fontSize: '1rem' }} />
                      Joining Fee (₹) *
                    </Box>
                  }
                  type="number"
                  value={formData.joining_fee}
                  onChange={e =>
                    setFormData({ ...formData, joining_fee: parseFloat(e.target.value) })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 0, step: '0.01' }}
                />

                <TextField
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrophyIcon color="warning" sx={{ mr: 1, fontSize: '1rem' }} />
                      Total Winners *
                    </Box>
                  }
                  type="number"
                  value={formData.total_winners}
                  onChange={e =>
                    setFormData({ ...formData, total_winners: parseInt(e.target.value) })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr 1fr 1fr' },
                  gap: 3,
                  mt: 3
                }}
              >
                <TextField
                  label="Team *"
                  value={formData.team}
                  onChange={e => setFormData({ ...formData, team: e.target.value })}
                  fullWidth
                  required
                />

                <TextField
                  label="Map *"
                  value={formData.map}
                  onChange={e => setFormData({ ...formData, map: e.target.value })}
                  fullWidth
                  required
                />

                <TextField
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon color="error" sx={{ mr: 1, fontSize: '1rem' }} />
                      Match Schedule *
                    </Box>
                  }
                  type="datetime-local"
                  value={formData.match_schedule}
                  onChange={e =>
                    setFormData({ ...formData, match_schedule: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: 'white',
                p: 3,
                mb: 3,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <TrophyIcon color="warning" sx={{ mr: 1 }} />
                  Prize Distribution
                </Typography>
                <Chip
                  label={`Total: ${totalPercentage.toFixed(2)}% ${
                    isValidDistribution ? '✓' : '(Must equal 100%)'
                  }`}
                  color={isValidDistribution ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {distributionRows.map(row => (
                  <Box
                    key={row.id}
                    sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                  >
                    <TextField
                      placeholder="Rank (e.g., 1 or 4-10)"
                      value={row.rank}
                      onChange={e =>
                        updateDistributionRow(row.id, 'rank', e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      type="number"
                      placeholder="Percentage"
                      value={row.percentage || ''}
                      onChange={e =>
                        updateDistributionRow(
                          row.id,
                          'percentage',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      fullWidth
                      InputProps={{
                        endAdornment: <Typography variant="body2">%</Typography>
                      }}
                      inputProps={{ min: 0, max: 100, step: '0.1' }}
                    />
                    <IconButton
                      onClick={() => removeDistributionRow(row.id)}
                      disabled={distributionRows.length <= 1}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={addDistributionRow}
                sx={{ mt: 2, color: 'primary.main', borderColor: 'primary.main' }}
              >
                Add Rank
              </Button>
            </Box>

            <Box
              sx={{
                bgcolor: 'white',
                p: 3,
                mb: 3,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <ImageIcon color="primary" sx={{ mr: 1 }} />
                Additional Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Banner Image URL"
                  value={formData.banner_image_url}
                  onChange={e =>
                    setFormData({ ...formData, banner_image_url: e.target.value })
                  }
                  fullWidth
                />

                <Box
                  sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 3 }}
                >
                  <TextField
                    label="Prize Description"
                    value={formData.prize_description}
                    onChange={e =>
                      setFormData({ ...formData, prize_description: e.target.value })
                    }
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <TextField
                    label="Match Sponsor"
                    value={formData.match_sponsor}
                    onChange={e =>
                      setFormData({ ...formData, match_sponsor: e.target.value })
                    }
                    fullWidth
                  />
                </Box>

                <TextField
                  label="Match Description"
                  value={formData.match_description}
                  onChange={e =>
                    setFormData({ ...formData, match_description: e.target.value })
                  }
                  multiline
                  rows={4}
                  fullWidth
                />

                <TextField
                  label="Private Description"
                  value={formData.match_private_description}
                  onChange={e =>
                    setFormData({ ...formData, match_private_description: e.target.value })
                  }
                  multiline
                  rows={4}
                  fullWidth
                />
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !isValidDistribution}
              sx={{
                py: 2,
                background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  background: 'linear-gradient(to right, #4338ca, #6d28d9)'
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                  {isEditMode ? 'Updating Contest...' : 'Creating Contest...'}
                </Box>
              ) : (
                isEditMode ? 'Update Contest' : 'Create Contest'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}