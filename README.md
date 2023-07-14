# NextAuth Redirect

This is a template with Next Auth, which automatically redirects a user to `/dashboard` if they are logged in, and to `/` if they are not.

---

You need to add a few environment variables for this to work:
- `NEXTAUTH_URL`: The url of your website
- `NEXTAUTH_SECRET`: A random secret to keep your website safe
- `GITHUB_ID`: The ID of your GitHub OAuth app
- `GITHUB_SECRET`: The secret of your GitHub OAuth app
