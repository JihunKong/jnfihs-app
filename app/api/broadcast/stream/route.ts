import { NextRequest } from 'next/server';
import { activeSessions, broadcastEmitter, BroadcastMessage } from '@/lib/broadcast-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SSE 스트리밍 엔드포인트: 학생이 실시간으로 번역된 자막 수신
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  const locale = req.nextUrl.searchParams.get('locale') || 'ko';

  if (!sessionId) {
    return new Response('Session ID required', { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 초기 연결 확인 메시지
      const session = activeSessions.get(sessionId);
      const connected = {
        type: 'connected',
        active: !!session,
        timestamp: Date.now(),
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(connected)}\n\n`));

      // 새 메시지 리스너
      const messageHandler = (message: BroadcastMessage) => {
        const data = {
          type: 'message',
          original: message.original,
          translated: message.translations[locale] || message.original,
          timestamp: message.timestamp,
          provisional: message.provisional || false, // 초벌 번역 여부
          interim: message.interim || false, // 중간 전사 여부
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // 이벤트 구독
      broadcastEmitter.on(`session:${sessionId}`, messageHandler);

      // 연결 종료 시 정리
      req.signal.addEventListener('abort', () => {
        broadcastEmitter.off(`session:${sessionId}`, messageHandler);
        controller.close();
      });

      // 30초마다 하트비트 전송 (연결 유지)
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // 클린업
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // nginx 버퍼링 비활성화
    },
  });
}
