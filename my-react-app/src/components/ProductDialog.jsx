import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'

function buildInitialValues(initialValues) {
  return {
    title: initialValues?.title ?? '',
    category: initialValues?.category ?? '',
    brand: initialValues?.brand ?? '',
    price: initialValues?.price ?? '',
    stock: initialValues?.stock ?? '',
    rating: initialValues?.rating ?? '',
    description: initialValues?.description ?? '',
    thumbnail: initialValues?.thumbnail ?? '',
  }
}

function ProductDialog({ mode, open, initialValues, pending, onClose, onSubmit }) {
  const [formValues, setFormValues] = useState(() => buildInitialValues(initialValues))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
  }

  const submitForm = () => {
    const nextErrors = {}

    if (!formValues.title.trim()) {
      nextErrors.title = 'Title is required.'
    }

    if (!formValues.category.trim()) {
      nextErrors.category = 'Category is required.'
    }

    if (formValues.price === '' || Number(formValues.price) < 0) {
      nextErrors.price = 'Price must be a valid positive number.'
    }

    if (formValues.stock === '' || Number(formValues.stock) < 0) {
      nextErrors.stock = 'Stock must be a valid positive number.'
    }

    if (!formValues.description.trim()) {
      nextErrors.description = 'Description is required.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      title: formValues.title.trim(),
      category: formValues.category.trim(),
      brand: formValues.brand.trim(),
      description: formValues.description.trim(),
      thumbnail: formValues.thumbnail.trim(),
      price: Number(formValues.price),
      stock: Number(formValues.stock),
      rating: formValues.rating === '' ? 0 : Number(formValues.rating),
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitForm()
  }

  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{mode === 'create' ? 'Create product' : 'Update product'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            error={Boolean(errors.title)}
            helperText={errors.title}
            required
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Category"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              error={Boolean(errors.category)}
              helperText={errors.category}
              required
              fullWidth
            />
            <TextField
              label="Brand"
              name="brand"
              value={formValues.brand}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formValues.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              required
              fullWidth
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={formValues.stock}
              onChange={handleChange}
              error={Boolean(errors.stock)}
              helperText={errors.stock}
              required
              fullWidth
            />
            <TextField
              label="Rating"
              name="rating"
              type="number"
              value={formValues.rating}
              onChange={handleChange}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              fullWidth
            />
          </Stack>
          <TextField
            label="Thumbnail URL"
            name="thumbnail"
            value={formValues.thumbnail}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            multiline
            minRows={4}
            error={Boolean(errors.description)}
            helperText={errors.description}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button type="button" variant="contained" disabled={pending} onClick={submitForm}>
          {mode === 'create' ? 'Save product' : 'Update product'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductDialog
