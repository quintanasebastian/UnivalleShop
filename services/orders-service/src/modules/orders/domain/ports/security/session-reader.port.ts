export interface SessionReader {
  readUserId(cookieHeader: string | undefined): string | null;
}

export const SESSION_READER = Symbol('SESSION_READER');
