export const RESERVATION_STATUS = {
    PENDING: 1,
    CONFIRMED: 2,
    CANCELLED_BY_USER: 3,
    CANCELLED_BY_SYSTEM: 4,
    COMPLETED: 5,
    NO_SHOW: 6,
    EXPIRED: 7
} as const;

export type ReservationStatusId =
    (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS];

export const RESERVATION_STATUS_LIST = [
    {
        id: RESERVATION_STATUS.PENDING,
        name: "Pendiente",
        description: "Reserva creada pero aún no confirmada"
    },
    {
        id: RESERVATION_STATUS.CONFIRMED,
        name: "Confirmada",
        description: "Reserva confirmada y vigente"
    },
    {
        id: RESERVATION_STATUS.CANCELLED_BY_USER,
        name: "Cancelada por el usuario",
        description: "Reserva cancelada por el cliente"
    },
    {
        id: RESERVATION_STATUS.CANCELLED_BY_SYSTEM,
        name: "Cancelada por el sistema",
        description: "Reserva cancelada por el sistema o administrador"
    },
    {
        id: RESERVATION_STATUS.COMPLETED,
        name: "Completada",
        description: "Servicio realizado correctamente"
    },
    {
        id: RESERVATION_STATUS.NO_SHOW,
        name: "No asistió",
        description: "El cliente no se presentó a la reserva"
    },
    {
        id: RESERVATION_STATUS.EXPIRED,
        name: "Expirada",
        description: "La reserva venció sin ser confirmada"
    }
] as const;
