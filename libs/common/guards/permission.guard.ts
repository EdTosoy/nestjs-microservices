import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { AuthRequest, PermissionEnum } from "../interfaces/user.interface";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<PermissionEnum>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (!permission) return true

    const req = context.switchToHttp().getRequest<AuthRequest>();
    const user = req.user;
    const hasRequiredPermision = Boolean(user.permissions?.includes(permission))

    return hasRequiredPermision
  }

}
