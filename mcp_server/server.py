"""
AI Dev Board — MCP Server

Exposes tools so Cursor (or any MCP client)
can manage board tasks directly from the IDE.

Configure in Cursor → Settings → MCP → Add server:
{
  "mcp-dev-board": {
    "command": "uv",
    "args": [
      "--directory",
      "/absolute/path/to/project/mcp_server",
      "run",
      "server.py"
    ]
  }
}
"""
import os
import httpx
from mcp.server.fastmcp import FastMCP

API_URL = os.getenv("API_URL", "http://localhost:8000")

mcp = FastMCP("mcp-dev-board")


@mcp.tool()
def list_tasks(status: str = "") -> list[dict]:
    """
    List all board tasks.
    Optional status filter: 'todo' | 'in_progress' | 'done'
    """
    params = {"status": status} if status else {}
    with httpx.Client(timeout=10) as client:
        response = client.get(f"{API_URL}/api/tasks/", params=params)
        response.raise_for_status()
        return response.json()


@mcp.tool()
def create_task(
    title: str,
    description: str = "",
    priority: str = "medium",
    status: str = "todo",
) -> dict:
    """
    Create a new task on the board.
    priority: 'low' | 'medium' | 'high'
    status: 'todo' | 'in_progress' | 'done'
    """
    with httpx.Client(timeout=10) as client:
        response = client.post(
            f"{API_URL}/api/tasks/",
            json={"title": title, "description": description, "priority": priority, "status": status},
        )
        response.raise_for_status()
        return response.json()


@mcp.tool()
def update_task_status(task_id: int, status: str) -> dict:
    """
    Update the status of a task.
    status: 'todo' | 'in_progress' | 'done'
    """
    with httpx.Client(timeout=10) as client:
        response = client.patch(
            f"{API_URL}/api/tasks/{task_id}/",
            json={"status": status},
        )
        response.raise_for_status()
        return response.json()


@mcp.tool()
def delete_task(task_id: int) -> dict:
    """Delete a task by its ID."""
    with httpx.Client(timeout=10) as client:
        response = client.delete(f"{API_URL}/api/tasks/{task_id}/")
        response.raise_for_status()
        return {"deleted": True, "task_id": task_id}


@mcp.tool()
def get_board_summary() -> dict:
    """
    Returns a summary of the current board state:
    task counts grouped by status and priority.
    """
    with httpx.Client(timeout=10) as client:
        response = client.get(f"{API_URL}/api/tasks/")
        response.raise_for_status()
        tasks = response.json()

    summary: dict = {
        "total": len(tasks),
        "by_status": {"todo": 0, "in_progress": 0, "done": 0},
        "by_priority": {"low": 0, "medium": 0, "high": 0},
    }
    for task in tasks:
        summary["by_status"][task["status"]] = summary["by_status"].get(task["status"], 0) + 1
        summary["by_priority"][task["priority"]] = summary["by_priority"].get(task["priority"], 0) + 1

    return summary


if __name__ == "__main__":
    mcp.run()
