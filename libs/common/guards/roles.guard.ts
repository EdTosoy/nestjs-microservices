import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AuthRequest, RoleEnum } from "../interfaces/user.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY, [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true;
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const user = req.user

    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role))

    return hasRequiredRole
  }
}
