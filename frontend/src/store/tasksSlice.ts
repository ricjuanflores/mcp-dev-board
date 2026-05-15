import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Task, CreateTaskInput, AISuggestion } from '../types/task'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface TasksState {
  items: Task[]
  loading: boolean
  error: string | null
  aiSuggestion: AISuggestion | null
  aiLoading: boolean
  aiError: string | null
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  aiSuggestion: null,
  aiLoading: false,
  aiError: null,
}

export const fetchTasks = createAsyncThunk<Task[]>('tasks/fetchAll', async () => {
  const res = await fetch(`${API_URL}/api/tasks/`)
  if (!res.ok) throw new Error('Error al cargar tareas')
  return res.json()
})

export const createTask = createAsyncThunk<Task, CreateTaskInput>(
  'tasks/create',
  async (data) => {
    const res = await fetch(`${API_URL}/api/tasks/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al crear tarea')
    return res.json()
  }
)

export const updateTask = createAsyncThunk<Task, { id: number; data: Partial<CreateTaskInput> }>(
  'tasks/update',
  async ({ id, data }) => {
    const res = await fetch(`${API_URL}/api/tasks/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al actualizar tarea')
    return res.json()
  }
)

export const deleteTask = createAsyncThunk<number, number>('tasks/delete', async (id) => {
  const res = await fetch(`${API_URL}/api/tasks/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar tarea')
  return id
})

export const suggestTask = createAsyncThunk<AISuggestion, string>(
  'tasks/suggest',
  async (title) => {
    const res = await fetch(`${API_URL}/api/tasks/ai-suggest/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Error al obtener sugerencia')
    }
    return res.json()
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearAISuggestion(state) {
      state.aiSuggestion = null
      state.aiError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error' })

      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload) })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload)
      })

      .addCase(suggestTask.pending, (state) => { state.aiLoading = true; state.aiError = null; state.aiSuggestion = null })
      .addCase(suggestTask.fulfilled, (state, action) => { state.aiLoading = false; state.aiSuggestion = action.payload })
      .addCase(suggestTask.rejected, (state, action) => { state.aiLoading = false; state.aiError = action.error.message ?? 'Error' })
  },
})

export const { clearAISuggestion } = tasksSlice.actions
export default tasksSlice.reducer
