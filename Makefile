DOCKER_CMD=docker-compose

db-up:
	${DOCKER_CMD} up cockroach
db-down:
	${DOCKER_CMD} down cockroach

