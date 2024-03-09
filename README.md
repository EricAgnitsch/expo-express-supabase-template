# expo-template

## Description

Ready to kickstart your full-stack journey with just one line? This project rolls out the red carpet for an Expo mobile
app and an Express server backend. Just tweak a few environment variables, create a Supabase table, and voila! You're
the proud owner of a full-fledged mobile application.

### Features

- Easy-peasy authentication (using Supabase's auth)
- Alerts on your phone with mobile notifications
- Smooth sailing with Expo page routing
- Styling with Nativewind (tailwindcss)
- Dockerized for easy deployment and hosting

### Requirements

Before starting, ensure you have the following installed and configured:

- **Node.js**: [Installation guide](https://nodejs.org/en/download/)
- **Yarn**: Run `npm install --global yarn` to install Yarn via npm.
- **Expo CLI**: Run `yarn global add expo-cli` to install Expo CLI.
- **Supabase**: A [Supabase](https://supabase.com/) project.
- **Expo**: An [Expo](https://expo.dev/) project.

---

## Getting Started

To create your project with this template, run `npx @autom8te/expo-template@latest <project_name>`,
replacing `project_name` with your camelcase project name. This will create an `expo-<project_name>` for the Expo mobile
front-end and `express-<project_name>` folder containing Express server back-end.

### Supabase Project Setup

1. Create a new project in Supabase.
2. Create a `users` table with a `push_notification_token` column in your Supabase instance.

Here's a SQL query to quickly create this table in Supabase's SQL editor.

```sql
create table
  public.users (
    id uuid not null default auth.uid (),
    created_at timestamp with time zone not null default now(),
    push_notification_token text null,
    constraint users_pkey primary key (id),
  ) tablespace pg_default;
```

### Expo Project Setup

In [Expo.dev](https://expo.dev/), create a new project! The only thing you'd need is the project ID for mobile
notification setup.

- Found at https://expo.dev/accounts/<account_name>/projects/<project_name>