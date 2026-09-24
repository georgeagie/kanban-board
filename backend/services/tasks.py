from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Task, TaskStatus
from schemas import TaskCreate, TaskUpdate


def list_tasks(db: Session, status: TaskStatus | None = None) -> list[Task]:
    stmt = select(Task).order_by(Task.status, Task.position, Task.id)
    if status is not None:
        stmt = stmt.where(Task.status == status.value)
    return list(db.scalars(stmt).all())


def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)


def _next_position(db: Session, status: str) -> int:
    current_max = db.scalar(
        select(func.max(Task.position)).where(Task.status == status)
    )
    return 0 if current_max is None else current_max + 1


def _tasks_in_status(db: Session, status: str) -> list[Task]:
    stmt = (
        select(Task)
        .where(Task.status == status)
        .order_by(Task.position, Task.id)
    )
    return list(db.scalars(stmt).all())


def _compact_positions(tasks: list[Task]) -> None:
    for index, task in enumerate(tasks):
        task.position = index


def create_task(db: Session, payload: TaskCreate) -> Task:
    status = payload.status.value
    task = Task(
        title=payload.title,
        description=payload.description,
        status=status,
        position=_next_position(db, status),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, payload: TaskUpdate) -> Task:
    data = payload.model_dump(exclude_unset=True)

    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]

    new_status = data["status"].value if "status" in data else task.status
    moving = "status" in data or "position" in data

    if moving:
        old_status = task.status
        old_position = task.position
        target_status = new_status

        source_tasks = [t for t in _tasks_in_status(db, old_status) if t.id != task.id]
        _compact_positions(source_tasks)

        if target_status == old_status:
            target_tasks = source_tasks
        else:
            target_tasks = _tasks_in_status(db, target_status)

        max_index = len(target_tasks)
        requested = data.get("position", max_index if target_status != old_status else old_position)
        new_position = max(0, min(requested, max_index))

        target_tasks.insert(new_position, task)
        task.status = target_status
        _compact_positions(target_tasks)

        if target_status != old_status:
            _compact_positions(source_tasks)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    status = task.status
    db.delete(task)
    db.flush()
    remaining = _tasks_in_status(db, status)
    _compact_positions(remaining)
    db.commit()
