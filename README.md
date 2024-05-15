# GenDev

***NOTE: This project approach has not been submitted***

This is my project approach for the [GenDev](https://www.talents.check24.de/gendev) scholarship 2024.

- [Technology and framework choice](#technology-and-framework-choice)
- [Project in action](#project-in-action)
- [Deployment](#deployment)
- [Application scaling](#application-scaling)
- [Possible improvements](#possible-improvements)

## Technology and framework choice

I've selected Kotlin as my backend programming language and Quarkus as my preferred framework for backend development.
My familiarity with Quarkus is quite extensive. Initially, I considered using PHP in conjunction with the
Symfony framework. However, given PHP's subpar performance in handling WebSocket connections, I opted for the former options.

I utilized both WebSockets and polling technology for real-time updates to showcase my proficiency in implementing both methods.
I selected WebSockets for the community and global leaderboard, as it efficiently handles large data transfers particularly when users expand it rapidly.
Hence, WebSockets was the optimal choice for this feature. Conversely, I opted for polling for the live updates of games
and the dashboard. This is because these requests yield a limited amount of data, which is more manageable through 
simple polling due to its lower complexity compared to a WebSocket connection.

For the frontend of the application, I selected Next.JS, which is a superset of React. I also employed TypeScript to ensure nearly typesafe
system implementation in my frontend, effectively minimizing the risk of type errors. For the UI,
I utilized a library called Joy UI, which bears similarity to Material UI. This significantly simplified the process of designing
the application's user interface, even though I am well-versed in CSS. 

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

## Load testing

Due to the need for 2,000,000 active users and an additional 10,000 currently active individuals, it was necessary for me to thoroughly
test the application and check its scaling capabilities. I established a Kubernetes environment with a standalone PostgreSQL database and five
instances of the server container. All websocket connections were redirected to the first instance, while other web requests were load balanced.
I tested a variety of scenarios with 100, 1,000, 10,000, and 100,000 users, monitoring the CPU and RAM usage of my docker cluster throughout.
Subsequently, I defined a mathematical function to depict the incremental requirement for resources. The results indicated that the application
is capable of supporting 2,000,000 users. However, this requires considerable memory that my laptop cannot provide, though a robust server can.

## Possible improvements

Even though the Docker container is capable of handling 10,000 WebSocket connections and 2,000,000 active users, it uses a considerable amount
of RAM and is currently confined to a single physical server for proper operation. Though it's possible to scale
horizontally using services such as Kubernetes or Docker Swarm, not all WebSocket connections would provide real-time
updates in this scenario. Consequently, the website would need to be refreshed, although the dashboard would still provide real-time updates, given that
the polling requests are stateless. This issue could be resolved by implementing a messaging microservice, like Apache Kafka. 
This would prompt all active instances of the backend to send updates through the WebSockets to the clients.

Furthermore, the game update functionality takes a lot of time and resources which could be optimized by implementing multithreading
for the sort and database transactions.

Some of the database queries are not fully optimized. There is potential to prevent the fetching of unnecessary data and eliminate
redundant `WHERE` clauses. Implementing these changes could decrease database load and reduce query complexity.

Furthermore, I should have implemented caching for load-heavy requests to improve the overall performance of the application.
Although it seemed too complex to implement caching for these highly user-individual queries, this could be a challenge 
to tackle in the future.

While the application's frontend is somewhat responsive, certain components aren't optimized for mobile devices. 
Therefore, there could be a mobile app or a better-optimized web application. In the case of building a mobile app, I would use 
React Native due to its cross-platform capability (both iOS and Android), and the fact that core components, like the APIService
of the web application, can still be reused.

Furthermore, to ensure that the application functions correctly even after updating
some software components, I would carry out testing through both UnitTests and end-to-end (e2e) tests.
