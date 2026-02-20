
import { RpcException } from '@nestjs/microservices';

export type RpcErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL';

export interface RpcErrorPayload {
  code: RpcErrorCode;
  message: string;
}

export function rpcBadRequest(message: string): never {
  throw new RpcException({ code: 'BAD_REQUEST', message });
}

export function rpcNotFound(message: string): never {
  throw new RpcException({ code: 'NOT_FOUND', message });
}

export function rpcUnauthorized(message: string): never {
  throw new RpcException({ code: 'UNAUTHORIZED', message });
}

export function rpcForbidden(message: string): never {
  throw new RpcException({ code: 'FORBIDDEN', message });
}

export function rpcInternal(message = 'Internal error'): never {
  throw new RpcException({ code: 'INTERNAL', message });
}
