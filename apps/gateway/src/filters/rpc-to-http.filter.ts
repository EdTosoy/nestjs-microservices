import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from 'libs/rpc/errors';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const error = exception.getError() as RpcErrorPayload;

    const status = this.mapStatus(error.code);

    response.status(status).json({
      code: error.code,
      message: error.message,
    });
  }

  private mapStatus(code: string): number {
    switch (code) {
      case 'BAD_REQUEST':
        return HttpStatus.BAD_REQUEST;
      case 'UNAUTHORIZED':
        return HttpStatus.UNAUTHORIZED;
      case 'FORBIDDEN':
        return HttpStatus.FORBIDDEN;
      case 'NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
