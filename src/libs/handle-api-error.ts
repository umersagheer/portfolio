import { addToast } from '@heroui/react'
import axios from 'axios'

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    // Check if the response contains a validation errors array
    if (Array.isArray(error.response.data?.errors)) {
      // Extract validation errors and display them
      console.log(error.response.data.errors[0])
      error.response.data.errors.forEach((validationError: any) => {
        addToast({
          title: validationError,
          color: 'danger'
        })
      })
    } else {
      // For other error types, use the default message handling
      const errorMessage =
        typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data?.message || 'An unexpected error occurred'
      addToast({
        title: errorMessage,
        color: 'warning'
      })
    }
  } else {
    addToast({
      title: 'An unexpected error occurred',
      color: 'warning'
    })
  }
}
