export class IdleStateModel {
    idleState!: string;
    isTimedOut!: boolean;
    timeoutWarning!: string;
    lastPing: Date | undefined;
}
