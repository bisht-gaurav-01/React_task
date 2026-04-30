const PRODUCT_STORAGE_KEY = 'northstar-product-overrides'
const PRODUCT_STORAGE_VERSION = 2

export function loadStoredProductOverrides() {
  try {
    const storedValue = window.localStorage.getItem(PRODUCT_STORAGE_KEY)

    if (!storedValue) {
      return null
    }

    const parsedValue = JSON.parse(storedValue)

    if (parsedValue?.version !== PRODUCT_STORAGE_VERSION) {
      window.localStorage.removeItem(PRODUCT_STORAGE_KEY)
      return null
    }

    return parsedValue.data ?? null
  } catch {
    return null
  }
}

export function saveStoredProductOverrides(overrides) {
  window.localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify({
      version: PRODUCT_STORAGE_VERSION,
      data: overrides,
    }),
  )
}

export function clearStoredProductOverrides() {
  window.localStorage.removeItem(PRODUCT_STORAGE_KEY)
}
