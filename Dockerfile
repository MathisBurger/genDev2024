FROM node:20-alpine AS webBuild

WORKDIR /web
COPY /web .
RUN npm ci --include=dev --force
RUN NODE_ENV=production npm run build

FROM gradle:jdk21-alpine AS serverBuild

WORKDIR /app
COPY . .
RUN mkdir ./src/main/resources/META-INF.resources
RUN ./gradlew build -Dquarkus.package.type=uber-jar

FROM openjdk:21
WORKDIR /app
COPY --from=serverBuild ./app/build/tipping-1.0-SNAPSHOT-runner.jar ./server.jar
COPY ./game_schedule.csv ./game_schedule.csv
RUN mkdir static
COPY --from=webBuild ./web/out ./static

ENV DATABASE_PASSWORD=mysecretpassword
ENV DATABASE_USER=postgres
ENV DATABASE_URL=jdbc:postgresql://localhost:5432/genDev
ENV ORM_GENERATION=drop-and-create
ENV ADMIN_PW=admin123



EXPOSE 8080
CMD ["java", "-Dquarkus.datasource.username=${DATABASE_USER}", "-Dquarkus.datasource.password=${DATABASE_PASSWORD}", "-Dquarkus.datasource.jdbc.url=${DATABASE_URL}", "-Dquarkus.hibernate-orm.database.generation=${ORM_GENERATION}", "-Dc24tipping.adminPW=${ADMIN_PW}", "-Dc24tipping.loadFixtures=false", "-jar", "server.jar"]