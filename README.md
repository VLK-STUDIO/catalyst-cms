# Catalyst CMS

Catalyst is a content management system that can be plugged to Next.js apps. 

Its main focus is end-to-end type safety using a code-first approach to configuration and React Server Components for data fetching.

> **Warning**
>
> Catalyst is at a very early prototype phase.
> 
> Many of its promised features work only partially or not at all. If you have questions file an issue.

## Focus

Catalyst tries to compete with existing CMS's on the following features:

- Zero-latency live preview when editing (even in production)
- Internationalization out of the box
- End-to-end type safety
- Fine-grained access control for collection and fields
- Wide range of authentication options (via [Auth.js](https://authjs.dev/))
- Pluggability into existing Next.js apps
- Ease of initial setup and deployment

## Usage goal

0. Create a Next.js app with the `app` directory.
1. Install the `catalyst-cms` package
2. Add an optional catch-all page for our dashboard: `/catalyst/[[...catalyst]]/page.tsx`
3. Add a catch-all API endpoint for our back-end (for now using the old `pages` directory): `/pages/api/[...catalyst].ts`
4. Create a CMS object somewhere using `createCatalyst` and configure it with the collections you want.
5. Import `cms.rootPage` in the catch-all page and `cms.rootEndpoint` in the endpoint you created.
6. Done! You can now use `cms.data.collection.find()` for data fetching and `cms.auth.getSession()` for authentication in Server Components!

## Project structure

The project is a Turborepo monorepo containing the following:
- An `examples` folder to both showcase Catalyst in different scenarios and to allow developers to test changes as they code (this is necessary because the Catalyst package needs to hook into a Next.js app to function)
- A `packages` folder that houses the core `catalyst-cms` package.

## Contributing

#### Installing dependencies

Run `pnpm install` from the root folder.

#### Environment variables

Catalyst expects a MongoDB connection URI and all the Auth.js-specific environment variables to work correctly. The `.env.example` files in each example show what the setup for a successful login looks like.

#### Starting up

After installing the dependencies and setting up the env variables, navigate to the folder of the example you want to work with and run `pnpm dev` to start it locally. The Catalyst dashboard should be available under the `/catalyst` route.

#### Working on the Dashboard UI

We're using the UnoCSS CLI for building the dashboard styles. This means that CSS classes you apply may not be visible if the class wasn't already built by the CLI, so if you're making changes to the dashboard styles you need to keep the CLI watch process active by running `pnpm dev` from the `packages/catalyst` folder.
