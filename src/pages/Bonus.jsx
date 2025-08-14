"use client"

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE_URL = 'https://macstormbattle-backend.onrender.com/api/bonus'

export default function AdminBonusPanel() {
  const [bonuses, setBonuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ userId: '', amount: '' })
  const [editingBonus, setEditingBonus] = useState(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch all bonuses
  const fetchBonuses = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/all`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setBonuses(data)
    } catch (err) {
      setError('Failed to fetch bonuses: ' + err.message)
      toast.error('Failed to load bonuses!')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load bonuses on component mount
  useEffect(() => {
    fetchBonuses()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddBonus = async () => {
    if (!formData.userId || !formData.amount) {
      toast.error('Please fill in all fields!')
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(formData.userId),
          amount: parseFloat(formData.amount)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setFormData({ userId: '', amount: '' })
      toast.success('Bonus added successfully! 🎉')
      
      // Refresh the bonuses list
      await fetchBonuses()
    } catch (err) {
      toast.error('Failed to add bonus: ' + err.message)
      console.error('Add bonus error:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditClick = (bonus) => {
    setEditingBonus({
      userId: bonus.member_id,
      amount: parseFloat(bonus.bonus_balance),
      user_name: bonus.user_name
    })
    setOpenEditDialog(true)
  }

  const handleEditSave = async () => {
    if (!editingBonus) return

    try {
      setActionLoading(true)
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingBonus.userId,
          amount: editingBonus.amount
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setOpenEditDialog(false)
      setEditingBonus(null)
      toast.success('Bonus updated successfully! ✅')
      
      // Refresh the bonuses list
      await fetchBonuses()
    } catch (err) {
      toast.error('Failed to update bonus: ' + err.message)
      console.error('Update bonus error:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this bonus?')) {
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`${API_BASE_URL}/delete/${memberId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      toast.success('Bonus deleted successfully! 🗑')
      
      // Refresh the bonuses list
      await fetchBonuses()
    } catch (err) {
      toast.error('Failed to delete bonus: ' + err.message)
      console.error('Delete bonus error:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchBonuses()
    toast.info('Refreshing bonus data...')
  }

  // Calculate statistics
  const totalBonuses = bonuses.length
  const activeBonuses = bonuses.filter(bonus => parseFloat(bonus.bonus_balance) > 0).length
  const totalAmount = bonuses.reduce((sum, bonus) => sum + parseFloat(bonus.bonus_balance || 0), 0)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: '100%', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', textAlign: { xs: 'center', md: 'left' } }}
        >
          Admin Bonus Management Panel
        </Typography>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalBonuses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Users with Bonuses</Typography>
              <Typography variant="h4">{activeBonuses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Bonus Amount</Typography>
              <Typography variant="h4">₹{totalAmount.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Bonus Form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AddIcon /> Add New Bonus
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="User ID (Member ID)"
                name="userId"
                type="number"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Enter member ID"
                variant="outlined"
                disabled={actionLoading}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Bonus Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                variant="outlined"
                disabled={actionLoading}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddBonus}
                startIcon={actionLoading ? <CircularProgress size={20} /> : <AddIcon />}
                disabled={actionLoading}
                size="large"
                sx={{ height: '56px' }}
              >
                {actionLoading ? 'Adding...' : 'Add Bonus'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bonuses Table */}
      <Card sx={{ overflowX: 'auto' }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Typography variant="h6" gutterBottom>
            All Users and Their Bonuses
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Member ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bonus Balance</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bonuses.map((bonus) => (
                  <TableRow key={bonus.member_id} hover>
                    <TableCell>{bonus.member_id}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: bonus.user_name ? 'grey.100' : 'warning.light',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {bonus.user_name || 'No username'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: parseFloat(bonus.bonus_balance) > 0 ? 'success.main' : 'text.secondary'
                        }}
                      >
                        ₹{parseFloat(bonus.bonus_balance).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={parseFloat(bonus.bonus_balance) > 0 ? 'Has Bonus' : 'No Bonus'}
                        color={parseFloat(bonus.bonus_balance) > 0 ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(bonus)}
                          size="small"
                          disabled={actionLoading}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(bonus.member_id)}
                          size="small"
                          disabled={actionLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Bonus for {editingBonus?.user_name || 'User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Member ID"
                  value={editingBonus?.userId || ''}
                  disabled
                  variant="outlined"
                  helperText="Member ID cannot be changed"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bonus Amount"
                  type="number"
                  value={editingBonus?.amount || ''}
                  onChange={(e) =>
                    setEditingBonus(prev =>
                      prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                  variant="outlined"
                  disabled={actionLoading}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEditDialog(false)} 
            startIcon={<CancelIcon />}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained" 
            startIcon={actionLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={actionLoading}
          >
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  )
}