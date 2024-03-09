# expo-template

## Description

This project is a subset of [expo-template](https://github.com/EricAgnitsch/expo-template), and it's your go-to for the
mobile side of things in this ecosystem. Just tweak a few environment variables, create a Supabase table, and bam!
You've got yourself a mobile app with Supabase.

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

### Dependencies

All the dependencies are already in `package.json`! Just hit up `yarn` and watch the red squigglies disappear.

### Environment Variables

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

- Run `yarn` to install all the required packages.
- Run `yarn start` to start the project

You will see a QR code to start developing on an external device, or use one of the Expo options to launch the app in
your iOS/Android emulator!

### Docker

> [!IMPORTANT]
> Your machine requires [Docker](https://www.docker.com/get-started/) to be able to use this part.

#### Locally hosted

The template comes with a ready-to-use `docker-compose-dev.yml` that uses `Dockerfile.dev`. This container is ready to
be deployed anywhere!

To start the container locally, run:

```
docker compose -f docker-compose-dev.yml up -d --build
```

This will run an Expo app with a QR code that can be used ***anywhere***. The reason is the Expo start script is run
with `--tunnel` so it's actually using a remote Expo server! You can go to the logs of the Expo app's Docker container
to see the QR code.

#### CI/CD deployed and hosted

This template also comes with a *commented* GitHub workflows file -- `develop.yml`. This workflow will build and run the
docker container on a dedicated self-hosted server of your choice! By default, it is set to run on a GitHub release
publish event.

These requirements need to exist for this workflow to work:

- A [self-hosted GitHub runner](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners#adding-a-self-hosted-runner-to-a-repository)
on a dedicated machine.
- The [3 environment variables](#environment-variables) to exist
  as [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

> [!NOTE]
> The `self-hosted` setup is just something quick you can do with a spare laptop, Raspberry PI, NAS etc etc. You could
> definitely set up a more robust pipeline to deploy the image to a Docker registry using GitHub's default hosted
> machines
> to build your project! 