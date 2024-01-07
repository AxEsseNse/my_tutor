from psycopg2 import connect

DATABASE_NAME = "my_tutor"
DATABASE_USER = "axessense"
DATABASE_PASSWORD = "itarmenia"
DATABASE_HOST = "127.0.0.1"
DATABASE_PORT = "5432"


def create_project_db():
    conn = connect(
        database="postgres",
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        host=DATABASE_HOST,
        port=DATABASE_PORT
    )
    conn.autocommit = True
    cursor = conn.cursor()

    cursor.execute(query="SELECT 1 FROM pg_database WHERE datname = %s", vars=(DATABASE_NAME,))
    is_database_exist = cursor.fetchall()
    if not is_database_exist:
        cursor.execute(query="CREATE database %s", vars=(DATABASE_NAME,))
        print(f"Database '{DATABASE_NAME}' was created.")
    else:
        print(f"Database '{DATABASE_NAME}' already created.")


if __name__ == "__main__":
    create_project_db()
