# Wordpress Docker Development Environment

Hassle-free Wordpress development and deployment with docker.

## Installation

1. Install Docker and Docker Compose

2. Clone it: ``git clone https://github.com/alexander-heimbuch/wordpress-docker-dev-env.git``  

3. Adapt the ``wordpress.config`` with your settings

4. Adapt the compose configs for production and development in ``docker/``

4. Run ``./wordpress`` to get an overview about available sub commands

## Work Environment

The development environment helps splitting code and content. It is meant to manage all state that is related to wordpress (content folder and database). 
Independent from production or development environment it will help to create a running instance of wordpress in the saved state. 
In combination with an git scm you should be able to incremental save your working progress and bring it up running on an production environment.

## Usage

```
usage: wordpress [options] <argv>...

Options:
  -h, --help        Show help options.

Arguments:
  dev               Fire up development mode
  prod              Fire up production mode
  database          Backup and restore wordpress database
  scm               Backup and restore files
```

### Development

```
usage: wordpress dev [options] <argv>...

Options:
  -h, --help          Show help options

Arguments:
  init                Initialises the dev environment, including a database restore
  up                  Starts the dev environment
  down                Saves the database and stops the dev environment
  pause               Pause the dev environment
  unpause             Unpause the dev environment
  restart             Restart the dev environment
```

### Production

```
usage: wordpress prod [options] <argv>...

Options:
  -h, --help          Show help options

Arguments:
  init                Initialises the prod environment, including a database restore
  up                  Starts the prod environment
  down                Saves the database and stops the prod environment
  restart             Restart the prod environment
```

### Database

```
usage: wordpress database [options] <argv>...

Options:
  -h, --help          Show help options

Arguments:
  save                Creates a snapshot of the currently running database
  restore             Restores the database to the latest or a given state
  replace_prod        Replaces the local domain with the target domain
  replace_dev         Replaces the production domain with the local domain
```

### Versioning

```
usage: wordpress scm [options] <argv>...

Options:
  -h, --help          Show help options

Arguments:
  save                Creates a snapshot of the current system
  pull                Pulls the latest snapshot
```
