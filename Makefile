all: build

dist:
	yarn
	yarn build

build:
	yarn && RAZZLE_API_PATH=http://localhost:55001/plone yarn build

start: dist
	yarn start:prod

start-api-docker:
	docker-compose -f api/docker-compose.yml up

clean-api-docker:
	docker-compose -f api/docker-compose.yml rm -vf

test-acceptance: dist api/bin/pybot
	PYTHONPATH=$$(pwd)/tests api/bin/pybot tests

test-acceptance-start-backend:
	docker-compose -f api/docker-compose.yml up

test-acceptance-start-frontend:
	yarn && yarn build && RAZZLE_API_PATH=http://localhost:55001/plone yarn start:prod

test-acceptance-build:
	api/bin/pip install -r api/requirements-robot-framework.txt

api/bin/pybot:
	make -C api

.PHONY: all start test-acceptance
