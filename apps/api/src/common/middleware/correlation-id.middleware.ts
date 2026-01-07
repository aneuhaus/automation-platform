import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      (req.headers['x-correlation-id'] as string) || randomUUID()

    req.headers['x-correlation-id'] = correlationId
    res.setHeader('x-correlation-id', correlationId)

    // Attach to request object for easy access in controllers/services if needed
    ;(req as unknown as { correlationId: string }).correlationId = correlationId

    next()
  }
}
