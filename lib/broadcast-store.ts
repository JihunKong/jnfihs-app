import { EventEmitter } from 'events';

// SSE 이벤트 에미터 (세션별 실시간 푸시용)
export const broadcastEmitter = new EventEmitter();
broadcastEmitter.setMaxListeners(100); // 동시 리스너 수 증가

// In-memory store for active sessions (use Redis in production)
export const activeSessions = new Map<string, {
  messages: Array<{
    original: string;
    translations: Record<string, string>;
    timestamp: number;
  }>;
  createdAt: number;
}>();

export type BroadcastMessage = {
  original: string;
  translations: Record<string, string>;
  timestamp: number;
};
