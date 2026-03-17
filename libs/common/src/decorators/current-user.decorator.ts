import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthRequest } from "../interfaces/user.interface";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {

    const req = context.switchToHttp().getRequest<AuthRequest>()

    return req.user

  })
