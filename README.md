1. Design Documents:

1. Users Collection:
    This collection will store information about the users, including their credentials and personal data.
    {
    "_id": ObjectId("..."),
    "name": "John Doe",          
    "email": "john.doe@example.com",  
    "passwordHash": "hashedpassword", 
    "createdAt": ISODate("..."),  
    "updatedAt": ISODate("...")   
    }

    Fields:
    _id: Unique identifier for the user (auto-generated).
    name: Name of the user.
    email: Email address of the user (unique).
    passwordHash: The hashed password stored for security.
    createdAt: Date and time when the user account was created.
    updatedAt: Date and time when the user account was last updated.

2. Rooms Collection:
    This collection will store the data related to chat rooms (or channels), including the room name and participants.
    {
    "_id": ObjectId("..."),
    "name": "General Chat",     
    "createdBy": ObjectId("..."),  
    "createdAt": ISODate("..."),  
    "updatedAt": ISODate("..."),  
    "users": [                  
        ObjectId("..."),
        ObjectId("...")
    ]
    }

    Fields:
    _id: Unique identifier for the room (auto-generated).
    name: Name of the chat room.
    createdBy: User _id of the creator of the room.
    createdAt: Date and time when the room was created.
    updatedAt: Date and time when the room was last updated.
    users: Array of user IDs representing users who are part of the room.

3. Messages Collection:
    This collection stores messages sent within each room.
    {
    "_id": ObjectId("..."),
    "roomId": ObjectId("..."),  
    "sender": ObjectId("..."),  
    "content": "Hello World!",   
    "timestamp": ISODate("..."), 
    "messageType": "text"       
    }
    Fields:
    _id: Unique identifier for the message (auto-generated).
    roomId: Reference to the room where the message was sent.
    sender: Reference to the user who sent the message.
    content: The actual message content (text or other types).
    timestamp: Date and time when the message was sent.
    messageType: Type of message, could be "text", "image", "video", etc.

2. Architecture of the Application

The architecture consists of three primary components: Frontend, Backend, and Real-Time Communication. The system is designed to allow users to authenticate, join chat rooms, send messages, and view message histories in real time.
1. Frontend (React Application):
    Role: The frontend is responsible for presenting the UI to the user, handling user interactions, and rendering real-time chat data. It also sends requests to the backend API and listens for real-time updates via WebSocket/Socket.IO.
    Key Technologies:
    React.js: For building the user interface.
    React Router: For navigation between pages (Login, Dashboard, Chat Room).
    Socket.IO Client: For real-time communication with the backend.
    Components:
    Auth: Login and registration forms with a toggle button.
    Dashboard: A list of available chat rooms and the option to create new rooms.
    ChatRoom: Displays the chat messages, handles sending new messages, and updates the UI in real time.
2. Backend (Node.js + Express.js):
    Role: The backend handles business logic such as user authentication, chat room creation, message management, and serves the APIs for interacting with the database.
    Key Technologies:
    Node.js + Express.js: For building REST APIs to handle user authentication, registration, and chat room management.
    MongoDB: To store user, room, and message data.
    JWT (JSON Web Token): For secure authentication between the frontend and backend.
    Socket.IO: For handling real-time communication between clients and the server.
    API Endpoints:
    POST /api/auth/register: Register a new user.
    POST /api/auth/login: Login an existing user and return a JWT token.
    GET /api/chat/rooms: Fetch all available chat rooms.
    POST /api/chat/create-room: Create a new chat room.
    GET /api/chat/rooms/:roomId/messages: Fetch message history for a room.
    POST /api/chat/rooms/:roomId/messages: Send a new message to a room.
3. Real-Time Communication (Socket.IO):
    Role: Socket.IO is used for real-time communication between clients and the server. Whenever a user sends a message, it is broadcast to all users connected to the same room.
    Key Features:
    WebSocket (via Socket.IO): Allows real-time two-way communication between the client and the server.
    Socket Event Handlers:
    joinRoom: A user joins a specific chat room.
    leaveRoom: A user leaves a chat room.
    sendMessage: A user sends a message to the room.
    message: Broadcasts a new message to all users in the room.


3. Unit Tests

    Unit tests focus on individual components or functions to verify that each part of the system works in isolation.
    Backend Unit Tests (Node.js + Express)

    Test Suite: User Authentication

    Test 1: User Registration (Success)
        Test Description: Tests whether a new user can successfully register with valid input.
        Expected Outcome: The user is created, and a success response with a JWT token is returned.
        Test Result: Passed

    Test 2: User Registration (Failure - Duplicate Email)
        Test Description: Tests whether trying to register with an already existing email returns an error.
        Expected Outcome: The registration fails with an appropriate error message.
        Test Result: Passed

    Test 3: User Login (Success)
        Test Description: Tests whether a user can log in with valid credentials.
        Expected Outcome: A success response with a JWT token is returned.
        Test Result: Passed
    
    Test 4: User Login (Failure - Invalid Credentials)
        Test Description: Tests whether login fails with incorrect credentials.
        Expected Outcome: The login fails with an appropriate error message.
        Test Result: Passed

    Test Suite: Message Handling

    Test 1: Send Message (Success)
        Test Description: Tests whether a user can send a message to a chat room.
        Expected Outcome: The message is saved to the database, and the message is broadcasted to the room in real time.
        Test Result: Passed

    Test 2: Fetch Chat History
        Test Description: Tests whether the message history of a chat room can be retrieved correctly.
        Expected Outcome: The response should return an array of all messages in the specified chat room.
        Test Result: Passed

    Test 3: User Joins Room
        Test Description: Tests whether a user can successfully join a chat room.
        Expected Outcome: The user is added to the room in the database, and they can send and receive messages in real time.
        Test Result: Passed

    Test Suite: Socket.IO (Real-Time Communication)

    Test 1: User Connects to Socket.IO
        Test Description: Tests whether a user can connect to the server using Socket.IO.
        Expected Outcome: The user should be successfully connected, and no errors should occur.
        Test Result: Passed
    
    Test 2: User Sends Real-Time Message
        Test Description: Tests whether a real-time message is correctly emitted and received by all users in the room.
        Expected Outcome: All connected users in the room should receive the new message immediately.
        Test Result: Passed

    Frontend Unit Tests (React Components)

    Test Suite: Authentication Components

    Test 1: Login Form (Success)
        Test Description: Tests whether the login form submits correctly and handles successful login.
        Expected Outcome: The user is redirected to the dashboard after logging in.
        Test Result: Passed

    Test 2: Registration Form (Validation - Email)
        Test Description: Tests whether the registration form correctly validates the email input.
        Expected Outcome: An error message is displayed if the email is invalid.
        Test Result: Passed

    Test Suite: Chat Room

    Test 1: Message Input Field
        Test Description: Tests whether the message input field correctly updates the state as the user types.
        Expected Outcome: The input field's value should be correctly updated in the state.
        Test Result: Passed

    Test 2: Display Messages in Chat Room
        Test Description: Tests whether messages from the backend are correctly displayed in the chat room.
        Expected Outcome: The message history should be rendered properly when the user joins a room.
        Test Result: Passed

    2. Integration Tests
    Integration tests check how different parts of the system work together. These tests simulate real-world use cases by testing the frontend and backend together.
    Test Suite: User Authentication Flow

    Test 1: Registration & Login
        Test Description: Tests the complete user registration and login flow.
        Expected Outcome: A user should be able to register, log in, and receive a JWT token for authentication.
        Test Result: Passed

    Test Suite: Real-Time Chat Flow

    Test 1: User Joins Room & Sends Message
        Test Description: Tests the full interaction of a user joining a chat room and sending a message.
        Expected Outcome: The user should successfully join the room, and the message should appear in the chat room for all users.
        Test Result: Passed

    Test 2: Real-Time Message Broadcasting
        Test Description: Tests whether a message sent by one user is immediately broadcasted to all other users in the same room.
        Expected Outcome: All users should see the new message in real-time.
        Test Result: Passed

4. Edge Case Testing

    Edge case testing ensures the system handles unusual or unexpected scenarios gracefully.

    Edge Case 1: Empty Message
        Test Description: Tests whether the system handles attempts to send an empty message.
        Expected Outcome: The system should reject the empty message and not broadcast it to the room.
        Test Result: Passed

    Edge Case 2: Duplicate Message
        Test Description: Tests whether the system handles the case where a user sends the same message multiple times quickly.
        Expected Outcome: Duplicate messages should not cause errors, but the same message should appear in the chat room multiple times.
        Test Result: Passed

    Edge Case 3: User Tries to Join Non-Existent Room
        Test Description: Tests whether the system handles an attempt to join a non-existent chat room.
        Expected Outcome: The system should display an error message indicating that the room does not exist.
        Test Result: Passed

    Edge Case 4: Long Message
        Test Description: Tests whether the system handles extremely long messages without crashing.
        Expected Outcome: The long message should be displayed correctly in the chat window, but the system should not break.
        Test Result: Passed

    Edge Case 5: Network Disconnect
        Test Description: Tests whether the system handles network disconnections gracefully.
        Expected Outcome: When the network is disconnected, the user should be notified and able to reconnect when the connection is restored.
        Test Result: Passed

5. UI Screenshots or Demo Video:
    The UI Screenshots are in the resources file.
# Chat-app
