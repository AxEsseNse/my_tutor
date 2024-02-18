import asyncio
from typing import Any

import json
from fastapi import Depends, WebSocketDisconnect
from fastapi.websockets import WebSocket, WebSocketState
from sqlalchemy.ext.asyncio import AsyncSession
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK

from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session


class ConnectionManager:
    def __init__(self):
        self.connections: dict[int, list[WebSocket]] = dict()  # TODO use redis
        self.timeout = 5

    async def connect(self, lesson_id: int, websocket: WebSocket):
        await websocket.accept()
        if lesson_id not in self.connections:
            self.connections[lesson_id] = [websocket]
        else:
            self.connections[lesson_id].append(websocket)

    async def disconnect(self, lesson_id: int, websocket: WebSocket):
        try:
            if lesson_id in self.connections:
                if len(self.connections[lesson_id]) == 1:
                    del self.connections[lesson_id]
                else:
                    self.connections[lesson_id].remove(websocket)
            await websocket.close()
        except:  # todo correct exception
            pass
        #
        # try:
        #     self.connections.remove(websocket)
        #     await websocket.close()
        # except:  # todo correct exception
        #     pass

    async def broadcast(self, lesson_id: int, action: str, data: Any = None):
        await asyncio.gather(*(self.send(lesson_id, conn, action, data) for conn in self.connections[lesson_id]))

    async def send(self, lesson_id: int, connection: WebSocket, action: str, data: Any = None):
        if connection.application_state == WebSocketState.DISCONNECTED:
            await self.disconnect(lesson_id, connection)
            return
        elif connection.application_state != WebSocketState.CONNECTED:
            await asyncio.sleep(self.timeout)
        payload = {"action": action} | ({"data": data} if data else {})
        try:
            await asyncio.wait_for(connection.send_json(payload), timeout=self.timeout)
        except TimeoutError:
            await self.disconnect(lesson_id, connection)


connection_manager = ConnectionManager()


@lessons_router.websocket("/ws/{lesson_id:int}/")
async def lesson_websocket(
        lesson_id: int,
        websocket: WebSocket,
        session: AsyncSession = Depends(get_db_session)
):
    try:
        await connection_manager.connect(lesson_id, websocket)
        while True:
            data = await websocket.receive_text()
            for connection in connection_manager.connections[lesson_id]:
                if connection != websocket:
                    await connection.send_text(data)
    except (WebSocketDisconnect, ConnectionClosedOK, ConnectionClosedError):
        await connection_manager.disconnect(lesson_id, websocket)
