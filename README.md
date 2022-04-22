# io-grupa-a

## Checkstyles

You can verify your code by executing `mvn checkstyle:checkstyle` plugin. Results can be found in `./target/site/checkstyle.html` or `./target/site/checkstyle-result.xml`.

## Docker compose

To run application with PostreSQL using docker-compose:

1. Add PostreSQL configuration in application.properties file (and remove H2):
```
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=test
spring.datasource.password=test
```

2. Enter those commands in the `io-backend` directory:
```
mvn install -DskipTests
docker-compose up
```


## Example data

Use `DataGenerator` class to generate example data.