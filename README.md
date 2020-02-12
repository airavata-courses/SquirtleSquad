# SquirtleSquad
This project aims to build a online weather prediction hosting platform.

## Architecture
For internal messaging between the microservices we have used Kafka. The frontend communicates with the API Gateway through RESTFul calls. The following features have been implemented.
- The frontend communicates to all the microservices via passing message through APIGateway.
- The APIGateway communicates to the UserManagement service using RESTful calls since we need synchronous functionalities.
- The rest of the communication is done using Kafka asynchronously. 
- Session Management listens to each microservice and uses this to keep a track of all the services ran by the user.
- We have deployed some predifined models for Model Execution. The below figure can give a better idea of the architecture involved.

![Our Architecture](BlockDiagram.png)

### The User Management Pipeline:
- The frontend sends a post request to /login or /register. If registering a user, we save the user information in a DB connected to the UserManagement API. 
- Upon a logic request, the API Gateway sends a post request to /login. The user enters his/her information and upon verification the access to the dashboard is given. At the same time, the User Management API also sends a RESTful message the Session Management API to store the newly created session.

### The Session Restore Pipeline:
- The user logs in and this message is sent to the Session Management API via User Management API. The Session Management then retrieves the most recent session message for the recieved user through the unique userID we store in our User DB. This information is sent back to the User Management API via RESRful call. We use RESTful calls in this pipeline since it needs to synchronous and doint this through Kafka was really hard.

### The Session Logging 
- The session listens to User Management via RESTful calls because of the need of synchonous calls.
- It uses kafka consumer to listen to all the other topics to keep track of all the jobs happening in any given action. We have a seperate topic for each API. 

### The Model Execution Pipeline
- The user requests for a model to execute. This requests goes to the API Gateway. 
- The API Gateway sends this request as a message to the Data Retrieval API. The Data Retrieval API pulls the data the from a known link and stores it in "/Data" on the local machine. The Data Retrieval(DR) API then sends the name of the downloaded file through Kakfa to the Model Execution API.
- The Model Execution(ME) API recieves the message and calls a function to execute the model. The generated data is again stored in "/Data" and the name of the generated file is sent to the Post Analysis(PA) API using Kafka.
- The PA API then creates a .png plot file and sends this to the API Gateway through Kafka.  

## Installation
1. Run bash script....
2. Run application script...
3. Blaaaaa....

# Team Members:
Anurag Kumar  
Sathyan Venkatanarayanan  
Shanmukha Surapuraju  


