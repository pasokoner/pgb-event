/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("@/server/auth").Auth;
  type DatabaseUserAttributes = {
    username: string;
    role: import("@prisma/client").UserRole;
  };
  type DatabaseSessionAttributes = Record<string, never>;
}
