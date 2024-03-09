# express-template

## Description

This project is a subset of [expo-express-template](https://github.com/EricAgnitsch/expo-express-template), and it's
your go-to for the backend side of things in this ecosystem. Just tweak a few environment variables, create a Supabase
table, and bam! You've got yourself a backend server with Supabase.

### Features

- Easy-peasy authentication (using Supabase's auth)
- Mobile notifications in any endpoint
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
SUPABASE_URL=<Your Supabase URL>
SUPABASE_KEY=<Your Supabase Service Role Key>
SUPABASE_JWT_SECRET=<Your Supabase JWT Secret>
```

## Supabase Project Setup

1. Create a new project in Supabase.
2. Navigate to the Project settings > API section and find your project's URL, Service Role Key, and JWT Secret.
3. Replace `SUPABASE_URL`, `SUPABASE_KEY` and `SUPABASE_JWT_SECRET` in the .env.local file with your project's details.
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

This command will start the Express server on `http://localhost:3000`.

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

This will run on `http://localhost:3001`.

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