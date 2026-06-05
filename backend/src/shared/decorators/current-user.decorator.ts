import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return undefined;

    if (data === 'id') {
      return user.sub;
    }

    if (data && data in user) {
      return user[data];
    }

    return user;
  },
);
