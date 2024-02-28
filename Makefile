DOCKER_CMD=docker-compose

db-up:
	${DOCKER_CMD} up -d cockroach
db-down:
	${DOCKER_CMD} down cockroach

qdrant-up:
	${DOCKER_CMD} up -d qdrant

qdrant-down:
	${DOCKER_CMD} down qdrant

docker-up:
	${DOCKER_CMD} up -d

docker-down:
	${DOCKER_CMD} down