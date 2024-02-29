from celery import Celery
from my_tutor.repositories import LessonRepository
from session import SessionLocal
from my_tutor.exceptions import LessonFinishError, LessonNotFoundError, LessonAlreadyFinished, LessonNotStarted


celery_app = Celery('сelery_app', broker='redis://localhost:6379')
lesson_repository = LessonRepository()


@celery_app.task(name='auto_finish_lesson', autoretry_for=(LessonFinishError,), retry_kwargs={'max_retries': 5, 'countdown': 60}, retry_backoff=True)
def auto_finish_lesson(lesson_id: int):
    session = SessionLocal()
    try:
        lesson_repository.auto_finish_lesson(session, lesson_id)
        session.commit()
    except LessonFinishError:
        session.rollback()
        raise
    except (LessonNotFoundError, LessonAlreadyFinished, LessonNotStarted):
        session.rollback()
    finally:
        session.close()

#  $env:PYTHONPATH="C:\it\pet_projects\my_tutor"; celery -A celery_app:celery_app worker --loglevel=INFO --pool=solo
#  $env:PYTHONPATH="C:\it\pet_projects\my_tutor"; celery -A celery_app:celery_app flower
