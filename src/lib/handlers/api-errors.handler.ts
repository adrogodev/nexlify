import { logoutAction } from "@/src/features/auth/actions";
import { ApiResponseError } from "../clients/fetch/types";
import { redirect } from "next/navigation";

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
    401: 'Debe iniciar sesión para continuar',
    403: 'No tiene permiso para realizar esta acción',
    404: 'El recurso solicitado no fue encontrado',
    500: 'Error interno del servidor, vuelva a intentarlo.',
};

async function parseErrorResponse(response?: Response): Promise<Nullable<string>> {
    if (!response) return null;

    try {
        const content_type = response.headers.get('content-type')?.toLocaleLowerCase() ?? '';

        if (content_type.includes('json')) {
            const data = await response.json();
            console.log('Api Error Data:', data);

            return (
                data?.message ||
                data?.error ||
                data?.Message ||
                data?.detail ||
                data?.title ||
                null
            );

        }

        const raw_text = await response.text();
        if (raw_text) return raw_text;

    } catch (error) {
        console.log('Error al obtener respuesta de error:', error);
    }

    return null;
}

export const handleApiResponseError = async (error: unknown): Promise<string> => {
    if (error instanceof ApiResponseError) {
        const { status, response } = error;

        if (status === 401) {
            console.warn('Sesión expirada o no válida (401)');
            await logoutAction();
            redirect('/auth?session=expired')
            return DEFAULT_ERROR_MESSAGES[401];
        }

        const server_message = await parseErrorResponse(response);
        if (server_message) return server_message;

        return DEFAULT_ERROR_MESSAGES[status] || 'Error inesperado, vuelve a intentarlo.'
    }

    if (error instanceof Error) {
        console.error('Generic Error:', error.message);
        return error.message;
    }

    return 'Error menssage, vuelve a intentarlo.'
}