# expo-template

## Description

This project is a subset of [expo-template](https://github.com/EricAgnitsch/expo-template), and it's your go-to for the
mobile side of things in this ecosystem. Just tweak a few environment variables, create a Supabase table, and bam!
You've got yourself a mobile app with Supabase.

## Features

- Easy-peasy authentication (using Supabase's auth)
- Alerts on your phone with mobile notifications
- Smooth sailing with Expo page routing
- Styling with Nativewind (tailwindcss)

## Requirements

Before starting, ensure you have the following installed and configured:

- **Node.js**: [Installation guide](https://nodejs.org/en/download/)
- **Yarn**: Run `npm install --global yarn` to install Yarn via npm.
- **Expo CLI**: Run `yarn global add expo-cli` to install Expo CLI.
- **Supabase**: A [Supabase](https://supabase.com/) project.
- **Expo**: An [Expo](https://expo.dev/) project.

## Dependencies

All the dependencies are already in `package.json`! Just hit up `yarn` and watch the red squigglies disappear.

## Environment Variables

The `.env.local` file already exists with the required keys, just hunt down the values and plug 'em in:

```
EXPO_PUBLIC_SERVER_BASE_URL=<URL of the backend part of this template>
EXPO_PUBLIC_SUPABASE_URL=<Your Supabase URL>
EXPO_PUBLIC_SUPABASE_KEY=<Your Supabase Anon Key>
```

## Supabase Project Setup

1. Create a new project in Supabase.
2. Navigate to the Project settings > API section and find your project's URL and Anon Key.
3. Replace `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY` in the .env.local file with your project's details.
4. A `users` table with a `push_notification_token` column needs to exist in your Supabase instance.

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

## Expo Project Setup

In [Expo.dev](https://expo.dev/), create a new project! The only thing you'd need is the project ID for mobile
notification setup.

- Found at https://expo.dev/accounts/<account_name>/projects/<project_name>

## Getting Started

To start the project, run:

```
expo start
```

This command will start the Expo developer tools in your browser.