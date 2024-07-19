import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (!req.headers['x-role'] && (req.headers['x-role'] != 'admin' || req.headers['x-role'] != 'user')) {
      throw new UnauthorizedException('Acceso no Autorizado');
    }
    next();
  }
}
