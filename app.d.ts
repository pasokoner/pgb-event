/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("@/server/auth").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = Record<string, never>;
}
