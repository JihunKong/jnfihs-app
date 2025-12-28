import { EventEmitter } from 'events';
import { LRUCache } from 'lru-cache';

// SSE 이벤트 에미터 (세션별 실시간 푸시용)
export const broadcastEmitter = new EventEmitter();
broadcastEmitter.setMaxListeners(100); // 동시 리스너 수 증가

// LRU 캐시: 번역 결과 캐싱 (최대 500개, 30분 TTL)
export const translationCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 30, // 30분
});

// In-memory store for active sessions (use Redis in production)
export const activeSessions = new Map<string, {
  messages: Array<{
    original: string;
    translations: Record<string, string>;
    timestamp: number;
    provisional?: boolean;
  }>;
  createdAt: number;
}>();

export type BroadcastMessage = {
  original: string;
  translations: Record<string, string>;
  timestamp: number;
  provisional?: boolean; // 초벌 번역 여부
  interim?: boolean; // 중간 전사 여부 (말하는 중)
};

// 세션별 마지막 interim 메시지 저장 (새 연결자에게 전송용)
export const lastInterimMessages = new Map<string, BroadcastMessage>();
