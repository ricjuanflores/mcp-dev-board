import { useState } from 'react'
import type { Task } from './types/task'
import Navbar from './components/Navbar'
import TaskBoard from './components/TaskBoard'
import TaskModal from './components/TaskModal'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const openNew = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar onNewTask={openNew} />
      <main className="flex-1">
        <TaskBoard onEditTask={openEdit} />
      </main>
      {modalOpen && <TaskModal task={editingTask} onClose={closeModal} />}
    </div>
  )
}
