# Contributing

The intention of this document is to provide a quick guide for developers in contributing to this library.

Contributions are welcome and are greatly appreciated! Every little bit helps,
and credit will always be given.

## Development

First setup the projects mono repo

```bash
yarn bootstrap
```

## Branching and Pull Requests

All new branches should be created off `master` with a descriptive branch name.

All commits should be squashed to a single commit before a PR is raised.

```bash
git fetch
git reset --soft main
yarn cz
```

## Committing standard

As we are following the semantic versioning the content of the commit messages
are very important. So, we are using `commitizen`. The correct way of committing
is hence via

```
yarn cz
```

This will run an interactive commit prompt where you can choose the type of your
commit and add descriptions.

According to SemVer, `feat` will cause a minor update and `fix` will cause the
patch number to bump up.

If in the interactive commit you answer yes to **any breaking changes** it will
bump up the major version of the package.

If you commit fails for any reason you can retry without filling in commitizen question again with

```
yarn czr
```

Thank you for contributing!
