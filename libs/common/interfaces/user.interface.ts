
export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}


export enum PermissionEnum {
  CREATE_POST = 'create_post',
  DELETE_POST = 'delete_post',
  UPDATE_USER = 'update_user',
  READ_USER = 'read_user',
}

export interface User {
  sub: string;
  email: string;
  roles: RoleEnum[],
  permissions?: PermissionEnum[]
}
export interface AuthRequest extends Request {
  user: User
}
