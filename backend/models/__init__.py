from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import DateTime, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (Index("ix_tasks_status_position", "status", "position"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default=TaskStatus.todo.value)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=_utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=_utc_now, onupdate=_utc_now
    )
