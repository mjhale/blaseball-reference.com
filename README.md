# Blaseball Reference

[Blaseball Reference](https://blaseball-reference.com) is a website that provides statistics for every\* player in [Blaseball](https://www.blaseball.com) history.

## Getting Started

### Prerequisites

- Git
- Node: 16.14.0 minimum
- Yarn
- A fork of the repo, if you wish to contribute

### Installation

1. `cd blaseball-reference.com` to go into the project root
1. `yarn` to install the website's npm dependencies

### Running Locally

1. `yarn dev` to start the development server
1. `open http://localhost:3000/` to open the development server

## Contribute

### Create a branch

1. `git checkout dev` from any folder in your local repo
1. `git pull origin dev` to ensure you have the latest code
1. `git checkout -b your-feature-branch dev` to create your feature branch

### Make your changes

1. Follow the ["Running Locally"](#running-locally) instructions
1. Save the changed files and check `http://localhost:3000/`
1. Test any visual changes in desktop and mobile viewports
1. Test if changes meet [accessibility standards](https://www.a11yproject.com/checklist/)

### Push your changes

1. `git add -A && git commit -m "A title for your changes"` to stage and commit your changes
1. `git push your-fork your-feature-branch`
1. Visit [github.com/mjhale/blaseball-reference.com](https://github.com/mjhale/blaseball-reference.com) and submit a pull request

## Dependencies

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses [Chakra UI](https://next.chakra-ui.com/) as a modular component library.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Chakra UI Documentation](https://next.chakra-ui.com/) - learn more about Chakra UI components

## Project Sponsors

We'd like to thank [Vercel](https://vercel.com/?utm_source=blaseball-reference-com&utm_campaign=oss), [Algolia](https://algolia.com), and [Heap.io](https://heap.io/?utm_source=badge) for supporting Blaseball Reference as well as the wider open source community.

[![Powered by Vercel](./public/powered-by-vercel.svg)](https://vercel.com/?utm_source=blaseball-reference-com&utm_campaign=oss)

[![Search by Algolia](./public/search-by-algolia.svg)](https://algolia.com)
