from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from models import TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = ""
    status: TaskStatus = TaskStatus.todo


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    position: int | None = Field(default=None, ge=0)


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: TaskStatus
    position: int
    created_at: datetime
    updated_at: datetime


class TaskList(BaseModel):
    tasks: list[TaskRead]


class HealthResponse(BaseModel):
    status: str
