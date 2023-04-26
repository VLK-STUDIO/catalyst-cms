# Catalyst CMS

Catalyst is a content management system that can be plugged to Next.js apps. 

Its main focus is end-to-end type safety using a code-first approach to configuration and React Server Components for data fetching.

## Focus

Catalyst tries to compete with existing CMS's on the following features:

- Zero-latency live preview when editing (even in production)
- Internationalization out of the box
- End-to-end type safety
- Fine-grained access control for collection and fields
- Wide range of authentication options (via [Auth.js](https://authjs.dev/))
- Pluggability into existing Next.js apps
- Ease of initial setup and deployment

## Project structure

The project is a Turborepo monorepo containing the following:
- An `examples` folder to both showcase Catalyst in different scenarios and to allow developers to test changes as they code (this is necessary because the Catalyst package needs to hook into a Next.js app to function)
- A `packages` folder that houses the core `catalyst-cms` package.

## Contributing

#### Installing dependencies

When working on Catalyst you'll need to clone the repo and run `pnpm install` from the root folder.

#### Environment variables

Catalyst expects a MongoDB connection and all the Auth.js-specific environment variables to work correctly. The `.env.example` files in each example show what the setup for a successful login looks like.

#### Starting up

After installing the dependencies and setting up the env variables, navigate to the folder of the example you want to work with and run `pnpm dev` to start it locally. The Catalyst dashboard should be available under the `/catalyst` route.
