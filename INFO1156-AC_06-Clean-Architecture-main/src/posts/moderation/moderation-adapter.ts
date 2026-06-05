import { Injectable } from "@nestjs/common"
import { ModerationService } from "@/moderation/moderation.service"
import { ModerationResult } from "@/posts/moderation/moderation.types"

/**
 * Adapter Pattern — Tarea 3 (Integrante 3)
 *
 * Problema original: el controlador interpretaba directamente la respuesta
 * de ModerationService con lógica if/else para cada posible forma del retorno
 * (string, number, object). Eso hacía el código frágil: cualquier cambio en
 * la API de moderación rompía el controlador.
 *
 * Solución: ModerationAdapter envuelve ModerationService y traduce cualquier
 * respuesta a la interfaz ModerationResult { blocked, reason }.
 * El controlador (y PostsService) solo conocen esta interfaz; si la API de
 * moderación cambia en el futuro, únicamente se modifica este adapter.
 */
@Injectable()
export class ModerationAdapter {
    constructor(private readonly moderationService: ModerationService) {}

    /**
     * Modera el texto dado y devuelve un ModerationResult normalizado.
     * Traduce la respuesta de ModerationService (que puede variar) a la
     * interfaz estable { blocked, reason }.
     */
    async moderate(text: string): Promise<ModerationResult> {
        const raw = await this.moderationService.moderate(text)

        // La API legacy puede retornar distintas formas; las normalizamos aquí.
        // Caso 1: objeto con propiedad approved (forma actual de ModerationService)
        if (typeof raw === "object" && raw !== null && "approved" in raw) {
            const result = raw as { approved: boolean; reason?: string }
            return {
                blocked: !result.approved,
                reason: result.reason,
            }
        }

        // Caso 2: string — se considera bloqueado si el string no está vacío
        if (typeof raw === "string") {
            const isBlocked = raw.trim().length > 0
            return {
                blocked: isBlocked,
                reason: isBlocked ? raw : undefined,
            }
        }

        // Caso 3: number — convención legacy: 0 = aprobado, cualquier otro = bloqueado
        if (typeof raw === "number") {
            return {
                blocked: raw !== 0,
                reason: raw !== 0 ? `Código de rechazo: ${raw}` : undefined,
            }
        }

        // Caso 4: cualquier otro valor inesperado — asumir aprobado por seguridad
        return { blocked: false }
    }
}
