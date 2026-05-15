# MCP Dev Board

Kanban board for development task management, with automatic AI suggestions (**Gemini 2.5 Flash**) and an **MCP Server** to integrate it directly with Cursor or Claude Desktop.

## Stack

- Python
- Django Rest Framework
- React
- PostgreSQL
- Docker
- Gemini
- MCP Server

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

## Installation

### 1. Clone and configure environment variables

```bash
git clone <repo>
cd ai-dev-board
cp .env.example .env
```

Edit `.env` and add your `GEMINI_API_KEY` ([aistudio.google.com](https://aistudio.google.com/api-keys)).

### 2. Start with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/tasks/

## API Endpoints

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/api/tasks/`            | List tasks                   |
| POST   | `/api/tasks/`            | Create task                  |
| PATCH  | `/api/tasks/{id}/`       | Update task                  |
| DELETE | `/api/tasks/{id}/`       | Delete task                  |
| POST   | `/api/tasks/ai-suggest/` | AI suggestion for a task     |

### Example: AI suggestion

```bash
curl -X POST http://localhost:8000/api/tasks/ai-suggest/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Implement JWT authentication"}'
```

```json
{
  "description": "Implement a JWT-based authentication system using djangorestframework-simplejwt.",
  "estimated_hours": 6,
  "subtasks": [
    "Install and configure simplejwt in Django",
    "Create login and refresh token endpoints",
    "Implement authentication middleware in the frontend"
  ]
}
```

## MCP Server — Cursor Integration

The MCP Server allows Cursor to manage board tasks directly from the chat.

### Configure in Cursor

`Cursor Settings → MCP → New MCP Server`:

```json
{
  "ai-dev-board": {
    "command": "uv",
    "args": [
      "--directory",
      "/absolute/path/to/project/mcp_server",
      "run",
      "server.py"
    ]
  }
}
```

### Available tools

| Tool                 | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `list_tasks`         | List tasks, with optional filter by status           |
| `create_task`        | Create a task with title, description, and priority  |
| `update_task_status` | Change the status of a task                          |
| `delete_task`        | Delete a task by ID                                  |
| `get_board_summary`  | Board summary by status and priority                 |

### Usage example in Cursor

```
You: "Create a task to implement the authentication endpoint with high priority"
Cursor: [uses create_task] → Task created on the board in real time
```
