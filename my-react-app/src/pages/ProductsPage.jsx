import { startTransition, useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Snackbar,
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
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ProductDialog from '../components/ProductDialog'
import {
  clearProductsFeedback,
  createProduct,
  deleteProduct,
  fetchProducts,
  selectProductsState,
  updateProduct,
} from '../features/products/productsSlice'

function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items, total, status, error, mutationError, mutationStatus } =
    useAppSelector(selectProductsState)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [dialogMode, setDialogMode] = useState('create')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        query: activeQuery,
        select: ['id', 'title', 'category', 'price', 'stock', 'brand', 'rating', 'thumbnail', 'description'],
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

  const handleCreateClick = () => {
    setDialogMode('create')
    setSelectedProduct(null)
    setDialogOpen(true)
  }

  const handleEditClick = (product) => {
    setDialogMode('edit')
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleDeleteClick = async (product) => {
    const confirmed = window.confirm(`Delete "${product.title}" from the product table?`)

    if (!confirmed) {
      return
    }

    const result = await dispatch(deleteProduct(product.id))

    if (deleteProduct.fulfilled.match(result)) {
      setSnackbarMessage(`Deleted ${product.title}.`)
    }
  }

  const handleDialogClose = () => {
    if (mutationStatus === 'pending') {
      return
    }

    setDialogOpen(false)
    setSelectedProduct(null)
  }

  const handleDialogSubmit = async (payload) => {
    const action =
      dialogMode === 'create'
        ? createProduct(payload)
        : updateProduct({ id: selectedProduct.id, payload })

    const result = await dispatch(action)

    if (createProduct.fulfilled.match(result)) {
      setSearchInput('')
      setActiveQuery('')
      setPage(0)
      setDialogOpen(false)
      setSnackbarMessage(`Created ${result.payload.title}.`)
    }

    if (updateProduct.fulfilled.match(result)) {
      setDialogOpen(false)
      setSnackbarMessage(`Updated ${result.payload.title}.`)
    }
  }

  return (
    <Stack spacing={3}>
<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleCreateClick}>
            Add product
          </Button>
   

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
          {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Rating</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">${Number(product.price || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock ?? '-'}</TableCell>
                    <TableCell align="right">{Number(product.rating || 0).toFixed(1)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          startIcon={<EditRoundedIcon />}
                          onClick={() => handleEditClick(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteRoundedIcon />}
                          onClick={() => handleDeleteClick(product)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {items.length === 0 && status !== 'pending' ? (
                  <TableRow>
                    <TableCell colSpan={8}>
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

      {dialogOpen ? (
        <ProductDialog
          key={`${dialogMode}-${selectedProduct?.id ?? 'new'}`}
          mode={dialogMode}
          open={dialogOpen}
          initialValues={selectedProduct}
          pending={mutationStatus === 'pending'}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      ) : null}

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3000}
        onClose={() => {
          setSnackbarMessage('')
          dispatch(clearProductsFeedback())
        }}
        message={snackbarMessage}
      />
    </Stack>
  )
}

export default ProductsPage
