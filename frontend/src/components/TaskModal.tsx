import { useState, useEffect } from "react";
import type {
  Task,
  CreateTaskInput,
  TaskStatus,
  TaskPriority,
} from "../types/task";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createTask,
  updateTask,
  suggestTask,
  clearAISuggestion,
} from "../store/tasksSlice";

interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
}

const defaultForm: CreateTaskInput = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  estimated_hours: null,
};

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const dispatch = useAppDispatch();
  const { aiSuggestion, aiLoading, aiError } = useAppSelector((s) => s.tasks);
  const [form, setForm] = useState<CreateTaskInput>(defaultForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        estimated_hours: task.estimated_hours,
      });
    } else {
      setForm(defaultForm);
    }
    dispatch(clearAISuggestion());
  }, [task, dispatch]);

  useEffect(() => {
    if (aiSuggestion) {
      setForm((prev) => ({
        ...prev,
        description: aiSuggestion.description,
        estimated_hours: aiSuggestion.estimated_hours,
      }));
    }
  }, [aiSuggestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (task) {
      await dispatch(updateTask({ id: task.id, data: form }));
    } else {
      await dispatch(createTask(form));
    }
    onClose();
  };

  const handleSuggest = () => {
    if (form.title.trim()) {
      dispatch(suggestTask(form.title));
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-full max-w-lg bg-base-200">
        <h3 className="font-bold text-lg mb-4 text-base-content">
          {task ? "Editar tarea" : "Nueva tarea"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="form-control gap-1">
            <label className="label-text font-medium text-sm">Título *</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ej. Implementar autenticación JWT"
                className="input input-bordered flex-1 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <button
                type="button"
                className={`btn btn-accent btn-sm whitespace-nowrap gap-1 ${aiLoading ? "loading" : ""}`}
                onClick={handleSuggest}
                disabled={!form.title.trim() || aiLoading}
                title="Sugerir con Gemini AI"
              >
                {!aiLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                {aiLoading ? "Analizando..." : "Sugerir IA"}
              </button>
            </div>
          </div>

          {/* AI error */}
          {aiError && (
            <div className="alert alert-error py-2 text-sm">
              <span>{aiError}</span>
            </div>
          )}

          {/* AI Subtasks suggestion */}
          {aiSuggestion?.subtasks && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-accent mb-2">
                Subtareas sugeridas por Gemini:
              </p>
              <ul className="list-none flex flex-col gap-1">
                {aiSuggestion.subtasks.map((s, i) => (
                  <li key={i} className="text-xs text-base-content flex gap-2">
                    <span className="text-accent">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="form-control gap-1">
            <label className="label-text font-medium text-sm">
              Descripción
            </label>
            <textarea
              className="textarea textarea-bordered text-sm resize-none"
              rows={3}
              placeholder="Descripción técnica de la tarea..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-control gap-1">
              <label className="label-text font-medium text-sm">
                Prioridad
              </label>
              <select
                className="select select-bordered select-sm"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as TaskPriority })
                }
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className="form-control gap-1">
              <label className="label-text font-medium text-sm">Estado</label>
              <select
                className="select select-bordered select-sm"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as TaskStatus })
                }
              >
                <option value="todo">Por hacer</option>
                <option value="in_progress">En progreso</option>
                <option value="done">Hecho</option>
              </select>
            </div>
          </div>

          {/* Estimated hours */}
          <div className="form-control gap-1">
            <label className="label-text font-medium text-sm">
              Horas estimadas
              {aiSuggestion && (
                <span className="ml-2 badge badge-accent badge-xs">
                  sugerido por IA
                </span>
              )}
            </label>
            <input
              type="number"
              min={1}
              className="input input-bordered input-sm w-32"
              value={form.estimated_hours ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimated_hours: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>

          {/* Actions */}
          <div className="modal-action mt-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {task ? "Guardar cambios" : "Crear tarea"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
