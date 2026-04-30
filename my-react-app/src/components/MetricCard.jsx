import { Paper, Stack, Typography } from '@mui/material'

function MetricCard({ label, value, helper, accent = 'primary.main' }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid rgba(31, 24, 18, 0.08)',
      }}
    >
      <Stack spacing={0.75}>
        <Typography variant="overline" sx={{ letterSpacing: '0.1em', color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ color: accent }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {helper}
        </Typography>
      </Stack>
    </Paper>
  )
}

export default MetricCard
