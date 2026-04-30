import { Stack, Typography } from '@mui/material'

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      spacing={2}
    >
      <Stack spacing={0.75}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: '0.12em', color: 'text.secondary', fontWeight: 700 }}
        >
          {eyebrow}
        </Typography>
        <Typography variant="h4">{title}</Typography>
        <Typography sx={{ maxWidth: 760, color: 'text.secondary' }}>{description}</Typography>
      </Stack>
      {action}
    </Stack>
  )
}

export default PageHeader
