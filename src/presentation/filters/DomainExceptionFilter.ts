import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common"
import type { Response } from "express"
import { DomainError, NotFoundError } from "@/domain/errors"

const PRISMA_RECORD_NOT_FOUND = "P2025"

const isPrismaRecordNotFound = (error: unknown): boolean =>
    error instanceof Error &&
    "code" in error &&
    (error as { code: string }).code === PRISMA_RECORD_NOT_FOUND

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>()

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json(exception.getResponse())
            return
        }

        if (
            exception instanceof NotFoundError ||
            isPrismaRecordNotFound(exception)
        ) {
            response.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                error: "Not Found",
                message:
                    exception instanceof Error
                        ? exception.message
                        : "Recurso no encontrado",
            })
            return
        }

        if (exception instanceof DomainError) {
            response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                error: "Bad Request",
                message: exception.message,
            })
            return
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Internal Server Error",
            message: "Error interno del servidor",
        })
    }
}
