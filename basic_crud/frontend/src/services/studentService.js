import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getStudents = async () => {
  const response = await api.get('/api/students')
  return response.data
}

export const createStudent = async (student) => {
  const response = await api.post('/api/students', student)
  return response.data
}

export const updateStudent = async (id, student) => {
  const response = await api.put(`/api/students/${id}`, student)
  return response.data
}

export const deleteStudent = async (id) => {
  await api.delete(`/api/students/${id}`)
}

export const getApiErrorMessage = (error) => {
  const response = error.response?.data
  if (response?.validationErrors) {
    return Object.values(response.validationErrors).join(' ')
  }
  return response?.message || 'The request could not be completed. Please try again.'
}
