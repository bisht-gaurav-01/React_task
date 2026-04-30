import { startTransition, useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import { fetchProducts, selectProductsState } from '../features/products/productsSlice'

function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items, total, status, error } = useAppSelector(selectProductsState)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [activeQuery, setActiveQuery] = useState('')

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        query: activeQuery,
        select: ['title', 'category', 'price', 'stock', 'brand', 'rating', 'thumbnail'],
      }),
    )
  }, [activeQuery, dispatch, page, rowsPerPage])

  const handleSearch = () => {
    startTransition(() => {
      setPage(0)
      setActiveQuery(searchInput.trim())
    })
  }

  const handleReset = () => {
    startTransition(() => {
      setSearchInput('')
      setActiveQuery('')
      setPage(0)
    })
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Products"
        title="API-backed product table"
        description="This page fetches product rows through Redux Toolkit async thunks and renders them in a responsive Material UI table with pagination and search."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <MetricCard
          label="Matched records"
          value={total}
          helper="Total records returned by the current API query."
        />
        <MetricCard
          label="Current page rows"
          value={items.length}
          helper="Rows currently rendered from Redux state."
          accent="secondary.main"
        />
        <MetricCard
          label="Search mode"
          value={activeQuery ? 'Filtered' : 'All'}
          helper={activeQuery ? `Search term: ${activeQuery}` : 'Showing the default product feed.'}
        />
      </Box>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(31, 24, 18, 0.08)' }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <TextField
              label="Search products"
              placeholder="Try phone, watch, or beauty"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" startIcon={<SearchRoundedIcon />} onClick={handleSearch}>
                Search
              </Button>
              <Button variant="outlined" startIcon={<RestartAltRoundedIcon />} onClick={handleReset}>
                Reset
              </Button>
            </Stack>
          </Stack>

          {activeQuery ? (
            <Chip
              label={`Searching DummyJSON for "${activeQuery}"`}
              color="secondary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
          ) : null}

          {status === 'pending' ? <LinearProgress color="secondary" /> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((product) => (
                  <TableRow hover key={product.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          src={product.thumbnail}
                          alt={product.title}
                          variant="rounded"
                          sx={{ width: 52, height: 52, bgcolor: 'secondary.light' }}
                        >
                          {product.title?.[0]}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>{product.title}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            ID #{product.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell>{product.brand || '-'}</TableCell>
                    <TableCell align="right">${Number(product.price || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock ?? '-'}</TableCell>
                    <TableCell align="right">{Number(product.rating || 0).toFixed(1)}</TableCell>
                  </TableRow>
                ))}

                {items.length === 0 && status !== 'pending' ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                        No products matched this query.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Stack>
      </Paper>
    </Stack>
  )
}

export default ProductsPage
