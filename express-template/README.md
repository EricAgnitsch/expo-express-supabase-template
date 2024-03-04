## Notifications

A few prerequisites needed for mobile notifications to work

1. Logged in to Expo via CLI.
2. Update `app.json`'s `extra.eas.projectId` to the project ID from your Expo's Project ID.
    - Can be found at example url: https://expo.dev/accounts/<account_name>/projects/<project_name>
3. Connection details to Supabase in `.env.local` is filled in.
4. A `users` table with `push_notification_token` needs to exist in your Supabase instance.

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