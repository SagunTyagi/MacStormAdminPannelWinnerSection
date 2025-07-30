"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  InputAdornment,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Apps as AppsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import { useTheme, useMediaQuery } from "@mui/material"

export default function General() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [formData, setFormData] = useState({
    leagueName: "BattleNation Championship",
    appName: "BattleNation",
    supportEmail: "support@battlenation.com",
    supportPhone: "+1-800-BATTLE",
    timezone: "Eastern Time (ET)",
  })

  const [lastSaved, setLastSaved] = useState(new Date())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      setShowSuccessMessage(true)
      console.log("Settings saved:", formData)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false)
  }

  const timezones = [
    "Eastern Time (ET)",
    "Central Time (CT)",
    "Mountain Time (MT)",
    "Pacific Time (PT)",
    "Alaska Time (AKT)",
    "Hawaii Time (HT)",
    "Greenwich Mean Time (GMT)",
    "Central European Time (CET)",
    "Japan Standard Time (JST)",
    "Australian Eastern Time (AET)",
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "95%",
          maxWidth: "95%",
          mx: "auto",
          px: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        {/* Header */}
        <Card
          elevation={2}
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            backgroundColor: "#ffffff",
            border: "1px solid #f0f0f0",
            mb: 3,
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingsIcon sx={{ fontSize: 24 }} color="primary" />
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  mb: 0.5,
                }}
              >
                General Settings
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Basic application configuration with manual and auto-save functionality
              </Typography>
            </Box>
          </CardContent>

          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<SaveIcon />}
                label={`Last saved: ${lastSaved.toLocaleTimeString()}`}
                size="small"
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1a1a1a",
                  "& .MuiChip-icon": { color: "#1976d2" },
                }}
              />
              {hasUnsavedChanges && (
                <Chip
                  label="Unsaved changes"
                  size="small"
                  color="warning"
                  sx={{
                    color: "white",
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            backgroundColor: "#ffffff",
            border: "1px solid #f0f0f0",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
              {/* Application Info Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <BusinessIcon color="primary" />
                    Application Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>
              </Grid>

              {/* Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="League Name"
                  value={formData.leagueName}
                  onChange={(e) => handleInputChange("leagueName", e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="App Name"
                  value={formData.appName}
                  onChange={(e) => handleInputChange("appName", e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AppsIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <EmailIcon color="primary" />
                    Support Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Support Email"
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Support Phone"
                  type="tel"
                  value={formData.supportPhone}
                  onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ScheduleIcon color="primary" />
                    System Configuration
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                    label="Timezone"
                  >
                    {timezones.map((timezone) => (
                      <MenuItem key={timezone} value={timezone}>
                        {timezone}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button
  onClick={handleSave}
  disabled={isSaving || !hasUnsavedChanges}
  startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
  disableElevation
  sx={{
    background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
    color: "#ffffff",
    fontWeight: 600,
    textTransform: "none",
    px: 4,
    py: 1.5,
    borderRadius: "8px",
    fontSize: "0.95rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    "&:disabled": {
      background: "#1A1A1A",
      color: "#ffffff",
      boxShadow: "none",
    },
  }}
>
  {isSaving ? "Saving..." : "Save Settings"}
</Button>

                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {hasUnsavedChanges
              ? "You have unsaved changes. Click 'Save Settings' to save your changes."
              : "All changes have been saved successfully."}
          </Typography>
        </Box>

        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={4000}
          onClose={handleCloseSuccessMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSuccessMessage}
            severity="success"
            variant="filled"
            icon={<CheckCircleIcon />}
            sx={{ width: "100%" }}
          >
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
