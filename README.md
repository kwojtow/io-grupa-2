# io-grupa-a


## Running App
### For Users

#### Requirements
- Maven
- Docker

#### I Clone the repository
#### II Use Maven to build backend service
Run following in the `io-backend` directory:
```
mvn install -DskipTests
```
#### III Use docker-compose to build application
Run in the `io-project` directory:
```
docker-compose up
```
#### IV Open application in your browser on `localhost:4200`


### For Developers
#### Requirements
- Intellij IDEA
- Spring
- node.js and npm
- Angular [install guide](https://angular.io/guide/setup-local)
#### I Run Backend
1. Open the [io-backend](https://github.com/kwojtow/io-grupa-a/tree/main/io-backend) directory in your favourite IDE (tested on **Intellij IDEA**)
2. Start the application by running main in class `IoBackendApplication`
- Or, use a docker image as described in the **Docker compose** part
#### II Run Frontend
1. Open the [frontend](https://github.com/kwojtow/io-grupa-a/tree/main/frontend) directory in your favourite IDE (tested in **vscode**)
2. run `npm install` command to install all the required dependencies
   - if you see error like `npm ERR! ERESOLVE unable to resolve dependency tree`, try running `npm config set legacy-peer-deps true` first
3. Start the frontend part by running `ng serve`
   - You should see output message like `** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **`
   - Follow the displayed link, if you followed the previous steps, the app should open in your browser successfully!



## Checkstyles

You can verify your code by executing `mvn checkstyle:checkstyle` plugin. Results can be found in `./target/site/checkstyle.html` or `./target/site/checkstyle-result.xml`.


## Example data

Use `DataGenerator` class to generate example data.
