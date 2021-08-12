import React, { useEffect } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";
import { useParams } from "react-router";
import { ExplorerURLParams } from "../Editor/Explorer/helpers";
import { Colors } from "constants/Colors";
import { APP_COLLAB_EVENTS } from "constants/AppCollabConstants";

const POINTER_COLORS = [
  Colors.JAFFA,
  Colors.SLATE_GRAY,
  Colors.DANUBE,
  Colors.JUNGLE_GREEN,
  Colors.JAFFA_DARK,
  Colors.PURPLE,
  Colors.BUTTER_CUP,
];
const COLOR_COUNT = 7;
const POINTER_MARGIN = 12;
const POINTER_PADDING_X = 15;
const POINTER_PADDING_Y = 5;
const PX_PER_CHAR = 8.67;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% + ${(props) => props.theme.canvasBottomPadding}px);
  width: 100%;
  overflow-y: auto;
  z-index: 1;
  pointer-events: none;
`;

const drawMousePointer = (
  idx: number,
  ctx: any,
  x: number,
  y: number,
  width: number,
  height = 24,
  radius = 2,
) => {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.fillStyle = POINTER_COLORS[idx % COLOR_COUNT];
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + POINTER_PADDING_X, y + POINTER_PADDING_Y);
  ctx.lineTo(x + POINTER_PADDING_Y, y + POINTER_PADDING_X);
  ctx.fill();
  x = x + POINTER_MARGIN;
  y = y + POINTER_MARGIN;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
};

function CanvasMultiPointerArena({
  pageEditSocket,
}: {
  pageEditSocket: Socket;
}) {
  const { pageId } = useParams<ExplorerURLParams>();
  let pointerData: { [s: string]: any } = {};

  let selectionCanvas: any;
  useEffect(() => {
    selectionCanvas = document.getElementById("multiplayer-canvas");
    const rect = selectionCanvas.getBoundingClientRect();
    if (!!selectionCanvas) {
      selectionCanvas.width = rect.width;
      selectionCanvas.height = rect.height;
    }
    pageEditSocket.connect();
    pageEditSocket.emit(APP_COLLAB_EVENTS.START_EDITING_APP, pageId);
    return () => {
      pageEditSocket.emit(APP_COLLAB_EVENTS.STOP_EDITING_APP);
      pageEditSocket.disconnect();
    };
  }, []);

  const drawPointers = async () => {
    const ctx = selectionCanvas.getContext("2d");
    const rect = selectionCanvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.font = "14px Verdana";
    Object.keys(pointerData).forEach((socId: string, idx: number) => {
      const eventData = pointerData[socId];
      const userName = eventData?.user?.name || eventData?.user?.email;
      drawMousePointer(
        idx,
        ctx,
        eventData.data.x,
        eventData.data.y,
        userName.length * PX_PER_CHAR * 1.054 || 0,
      );
      ctx.fillStyle = Colors.BLACK;
      ctx.fillText(
        `${userName}`,
        eventData.data.x + POINTER_MARGIN + POINTER_PADDING_Y,
        eventData.data.y + POINTER_MARGIN + POINTER_PADDING_X,
      );
    });
  };

  useEffect(() => {
    const drawingInterval = setInterval(() => drawPointers(), 50);
    const clearPointerDataInterval = setInterval(() => {
      pointerData = {};
    }, 120000);
    return () => {
      clearInterval(drawingInterval);
      clearInterval(clearPointerDataInterval);
    };
  }, []);

  useEffect(() => {
    pageEditSocket.on(
      APP_COLLAB_EVENTS.SHARE_USER_POINTER,
      (eventData: {
        data: { x: number; y: number };
        socketId: string;
        user: any;
      }) => {
        if (
          eventData &&
          selectionCanvas &&
          pageEditSocket.id !== eventData.socketId
        ) {
          pointerData[eventData.socketId] = eventData;
        }
      },
    );
  }, []);

  return <Canvas id="multiplayer-canvas" />;
}

export default CanvasMultiPointerArena;