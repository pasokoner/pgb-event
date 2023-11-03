# PGB Event App

## Installing

```bash
$ npm install
```

## Seeding With Admin Account

This is required because we need to fetch from http://localhost:3000/api/auth/admin-creation for
the creation of admin

```bash
$ npm run dev
```

On the other terminal

```bash
$ npx prisma db seed
```
