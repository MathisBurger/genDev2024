# GenDev

This is my project approach for the [GenDev](https://www.talents.check24.de/gendev) scholarship 2024.

- [Technology and framework choice](#technology-and-framework-choice)
- [Project in action](#project-in-action)
- [Deployment](#deployment)
- [Application scaling](#application-scaling)
- [Possible improvements](#possible-improvements)

## Technology and framework choice

I have chosen kotlin as my backend programing language and quarkus as my framework of choice for backend 
development. I am very familiar with Quarkus. Initially, I wanted to use PHP together with the 
symfony framework, but PHP is not that good at handling websocket connections.

As the technology for real-time updates I used both, websockets and polling to demonstrate I am able to work and implement both.
I have chosen websockets for the community and the global leaderboard, because it transfers large amount of data if the user expands it very fast.
Therefore, I have chosen websockets for this feature. I used polling for the live updates of games and the dashboard, because these requests return a limited
amount of data which is easier to handle with simple polling, because it is not as complex as a websocket connection.

For the frontend of the application I have chosen Next.JS which is a superset of React. Furthermore, I used typescript to
bring a nearly typesafe system into my frontend to decrease the risk of type errors. For the UI I used a library 
called Joy UI which is similar to Material UI. It made the workflow of designing the application user interface much easier for me, even if I know CSS well. 

## Project in action

You can find the YouTube video which is an introduction into the project and my local setup [here](Link).

## Deployment

This application uses docker for deployment, because I am very familiar with Docker and docker compose.
You can pull the image with following command:
```shell
docker pull ghcr.io/MathisBurger/genDev2024:latest
```

If you want to start the application just run the application with the provided `docker-compose.yml`:
```shell
docker-compose up -d
```

## Possible improvements

Although the docker container is able to handle 10.000 Websocket connections and 2.000.000 active users it uses
a vast amount of RAM and is currently limited to physically one server to work properly. It is possible to scale 
horizontally using something kubernetes or docker swarm, but then not all websocket connections will provide real-time updates
and the website needs to be refreshed, but the dashboard still provides real time updates, because the polling requests are stateless.
This problem can be solved by implementing a messaging microservice like Apache Kafka to trigger all running instances of the backend to send
updates though the websockets to the clients.

Not all the database queries are well optimized. There is some potential to prevent fetching unnecessary data and remove redundant
`WHERE` clauses. This could lower the database load and query complexity.

Although, the application frontend is kind of responsive, there are some components that are not really optimized for mobile devices.
Therefore, there should be a mobile app or a better optimized web application. I would build a mobile app using react native, because it is capable 
of cross-platform (IOS and Android) and core components like the APIService of the web application can be reused.