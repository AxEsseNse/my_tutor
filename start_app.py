import os
import uvicorn


if __name__ == "__main__":
    os.chdir("/root/projects/my_tutor")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
