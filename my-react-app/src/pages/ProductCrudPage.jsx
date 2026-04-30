import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import ProductDialog from '../components/ProductDialog'
import {
  clearProductsFeedback,
  createProduct,
  deleteProduct,
  fetchProducts,
  selectProductsState,
  updateProduct,
} from '../features/products/productsSlice'

function ProductCrudPage() {
  const dispatch = useAppDispatch()
  const { items, total, status, mutationStatus, mutationError } = useAppSelector(selectProductsState)
  const [dialogMode, setDialogMode] = useState('create')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    dispatch(fetchProducts({ limit: 0, skip: 0, query: '' }))
  }, [dispatch])

  const filteredProducts = items.filter((product) => {
    const query = searchText.trim().toLowerCase()

    if (!query) {
      return true
    }

    return [product.title, product.category, product.brand, product.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query))
  })

  const categoryCount = new Set(items.map((item) => item.category).filter(Boolean)).size
  const averagePrice = items.length
    ? (items.reduce((sum, item) => sum + Number(item.price || 0), 0) / items.length).toFixed(2)
    : '0.00'
  const lowStockItems = items.filter((item) => Number(item.stock || 0) < 20).length

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
    const confirmed = window.confirm(`Delete "${product.title}" from the local Redux view?`)

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
      <PageHeader
        eyebrow="CRUD"
        title="Product management studio"
        description="This view fetches the broader product dataset into Redux, surfaces total records clearly, and supports create, update, and delete flows against DummyJSON's simulated endpoints."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleCreateClick}>
            Add product
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        <MetricCard
          label="Total records"
          value={total}
          helper="Total products currently represented in Redux."
        />
        <MetricCard
          label="Visible rows"
          value={filteredProducts.length}
          helper="Rows matching the current local filter."
          accent="secondary.main"
        />
        <MetricCard
          label="Categories"
          value={categoryCount}
          helper="Distinct categories across the loaded dataset."
        />
        <MetricCard
          label="Low stock"
          value={lowStockItems}
          helper={`Average price: $${averagePrice}`}
          accent="warning.main"
        />
      </Box>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(31, 24, 18, 0.08)' }}>
        <Stack spacing={2.5}>
          <Alert severity="info">
            DummyJSON simulates create, update, and delete. The UI immediately reflects those
            operations in Redux, but a page refresh will pull the original dataset back from the
            API.
          </Alert>

          {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

          <TextField
            label="Filter loaded products"
            placeholder="Search by title, category, brand, or description"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow hover key={product.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          src={product.thumbnail}
                          variant="rounded"
                          sx={{ bgcolor: 'primary.light', width: 50, height: 50 }}
                        >
                          {product.title?.[0]}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>{product.title}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {product.brand || 'Independent label'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell align="right">${Number(product.price || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock ?? '-'}</TableCell>
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

                {filteredProducts.length === 0 && status !== 'pending' ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                        No loaded products matched the current filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
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

export default ProductCrudPage
