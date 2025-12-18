// filters/prisma-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { Response } from 'express';
import { PrismaErrors } from 'src/users/enums/prisma-errors.enum';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status;
        let message;

        switch (exception.code) {
            case PrismaErrors.UNIQUE_CONSTRAINT_VIOLATION:
                const field = exception.meta?.target?.[0];
                status = HttpStatus.CONFLICT;
                message = `Ya existe un usuario con ese ${field}`;
                break;
            
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Error interno del servidor';
                break;
        }

        response.status(status).json({
            statusCode: status,
            message,
        });
    }
}
