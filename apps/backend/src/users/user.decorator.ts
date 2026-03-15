import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    return request.user;
  },
);
