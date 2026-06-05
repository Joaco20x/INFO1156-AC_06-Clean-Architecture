/**
 * Resultado normalizado de moderación.
 * El ModerationAdapter siempre devuelve esta estructura,
 * independientemente de lo que retorne la API legacy subyacente.
 */
export interface ModerationResult {
    /** true si el contenido fue bloqueado, false si está aprobado */
    blocked: boolean
    /** Motivo del bloqueo (solo presente cuando blocked === true) */
    reason?: string
}
