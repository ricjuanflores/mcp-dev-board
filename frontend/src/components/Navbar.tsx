interface NavbarProps {
  onNewTask: () => void
}

export default function Navbar({ onNewTask }: NavbarProps) {
  return (
    <div className="navbar bg-neutral text-neutral-content px-6 shadow-lg">
      <div className="flex-1 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="text-xl font-semibold tracking-tight">AI Dev Board</span>
        <span className="badge badge-accent badge-sm gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4zm0 3a1 1 0 011 1v4l3 1.5-.9 1.8L12 14V8a1 1 0 01-1-1z"/>
          </svg>
          Gemini 2.5 Flash
        </span>
      </div>
      <div className="flex-none">
        <button className="btn btn-primary btn-sm gap-2" onClick={onNewTask}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Tarea
        </button>
      </div>
    </div>
  )
}
