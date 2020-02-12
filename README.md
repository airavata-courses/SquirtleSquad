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

## Installation
1. Run bash script....
2. Run application script...
3. Blaaaaa....

# Team Members:
Anurag Kumar  
Sathyan Venkatanarayanan  
Shanmukha Surapuraju  


