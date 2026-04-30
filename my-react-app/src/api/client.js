const API_BASE_URL = 'https://dummyjson.com'

async function request(path, options = {}) {
  const { method = 'GET', body, token, signal } = options
  const headers = {}

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    signal,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

function buildProductQuery(params) {
  const searchParams = new URLSearchParams()

  if (typeof params.limit === 'number') {
    searchParams.set('limit', params.limit)
  }

  if (typeof params.skip === 'number') {
    searchParams.set('skip', params.skip)
  }

  if (params.select?.length) {
    searchParams.set('select', params.select.join(','))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export const authApi = {
  login(credentials, signal) {
    return request('/auth/login', {
      method: 'POST',
      body: { ...credentials, expiresInMins: 30 },
      signal,
    })
  },

  getCurrentUser(token, signal) {
    return request('/auth/me', { token, signal })
  },

  register(payload, signal) {
    return request('/users/add', {
      method: 'POST',
      body: payload,
      signal,
    })
  },
}

export const productsApi = {
  getProducts(params, signal) {
    const query = params.query?.trim()
    const queryString = buildProductQuery(params)
    const path = query
      ? `/products/search${queryString}${queryString ? '&' : '?'}q=${encodeURIComponent(query)}`
      : `/products${queryString}`

    return request(path, { signal })
  },

  createProduct(payload, signal) {
    return request('/products/add', {
      method: 'POST',
      body: payload,
      signal,
    })
  },

  updateProduct(id, payload, signal) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: payload,
      signal,
    })
  },

  deleteProduct(id, signal) {
    return request(`/products/${id}`, {
      method: 'DELETE',
      signal,
    })
  },
}
