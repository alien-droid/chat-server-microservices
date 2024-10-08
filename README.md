This project serves as a comprehensive boilderplate for building and deploying microservices using Node.js, RabbitMQ, Nginx, and Docker.

-- Node.js -> Runtime environment for running JavaScript files.
-- Nginx -> API Gateway that serves as a the entry point that redirects to the necessary microservices.
-- RabbitMQ -> Allows communication between microservices based on the messaging queue protocol.
-- Docker -> Standard containerization of the project, allows to be run as a Docker image.

Once the application is up and running, you can interact with the microservices using Postman or any API tool of your choice. The application is accessible at http://localhost:85 and routes requests to the appropriate microservice based on the endpoint.
