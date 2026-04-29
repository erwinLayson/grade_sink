type PasswordResetEmailParams = {
    to: string;
    resetLink: string;
    username?: string | null;
};
export declare function sendPasswordResetEmail({ to, resetLink, username }: PasswordResetEmailParams): Promise<void>;
export {};
//# sourceMappingURL=mail.service.d.ts.map