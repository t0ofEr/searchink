const LEGAL_ADULT_AGE = 18;

export function isMinor(birthday: Date): boolean {
    const today = new Date();
    const age =
        today.getFullYear() -
        birthday.getFullYear() -
        (today < new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate()) ? 1 : 0);

    return age < LEGAL_ADULT_AGE;
}