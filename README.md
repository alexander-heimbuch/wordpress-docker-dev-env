# Klaus

*Wordpress Development Environment*

## Installation

1. Install [Node.js](https://nodejs.org/)

2. Clone it: ``git clone https://github.com/zusatzstoff/klaus.git``  

3. Run ``npm install``

4. Install [boot2docker](https://docs.docker.com/installation/)

5. Run ``gulp``

6. Access the instance on ``dockerHost:8080``

### Docker Host

You can easily retrieve the ``docker host ip`` with the following command: ``boot2docker ip``.

For convenience purposes add the boot2docker ip to your ``hosts`` file.

### Development

Klaus will watch the ``src`` folder for changes on default, but you can easily adjust the gulp tasks to your needs.
You should keep your ``wp-content`` directory in the ``src`` folder because the default ``buildpath`` is the mounted ``wp-content`` folder of the Wordpress that is running in the docker container.

On every restart the docker containers will be recreated. If you want to save a specific state, you have to run ``gulp save``. This task will create a snapshot of the current database state that will be loaded on the next startup.
