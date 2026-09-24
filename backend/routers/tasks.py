from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.orm import Session

from db import get_db
from models import TaskStatus
from schemas import TaskCreate, TaskList, TaskRead, TaskUpdate
from services import create_task, delete_task, get_task, list_tasks, update_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=TaskList)
def get_tasks(
    status: TaskStatus | None = Query(default=None),
    db: Session = Depends(get_db),
) -> TaskList:
    tasks = list_tasks(db, status=status)
    return TaskList(tasks=tasks)


@router.post("", response_model=TaskRead, status_code=http_status.HTTP_201_CREATED)
def post_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskRead:
    return create_task(db, payload)


@router.get("/{task_id}", response_model=TaskRead)
def get_task_by_id(task_id: int, db: Session = Depends(get_db)) -> TaskRead:
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskRead)
def patch_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
) -> TaskRead:
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return update_task(db, task, payload)


@router.delete("/{task_id}", status_code=http_status.HTTP_204_NO_CONTENT)
def remove_task(task_id: int, db: Session = Depends(get_db)) -> None:
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    delete_task(db, task)
