## Capstone Project Proposal: Snowbird Carpool App



```
Students: Joanne Wai (u1391961), Tong Shen (u1368479)
Mentor: Ben Jones
Master's of Software Development, University of Utah

07/18/2022
```

Document update history

| Date       | Editor | Content                               |
| ---------- | ------ | ------------------------------------- |
| 07/18/2022 | Tong   | Upload the first version of proposal. |





### I. Project Backgrounds

#### 1. Porblem

The employees working in Snowbird Clinic would like to reduce the number of vehicles that come into the canyon in the winter. The number of vehicles is better limited to 1-3. Therefore an intra carpool app would be helpful. The app will focus on supporting daily carpool planning and suggesting, and be used by employees of Snowbird Clinic only.

#### 2. Similar Products on the Market

There are lots of similar carpool apps on the market. We took a look at 4 of them below. Some of them are quite popular with 7.1k and 3k comments in Apple's App Store, some of them have just a few users.

- Mobile apps:
  - [Waze Carpool](https://www.waze.com/carpool/)
    - Has a 'Schedule' feature which a user can set carpool plans for a week.
    - Provides a live map for both drivers and passengers, but the locations is not very accurate.
  - [BlaBlaCar](https://www.blablacar.co.uk/)
    - Provides in-app chatting feature. Users can check and send messages in inbox.
    - No map provided.
    - Service is not offered in the United States.
  - Pool
    - Users can view all the upcoming carpools from a dashboard.
    - In the app real-time map is offered.
    - In fact, I failed signing up. It seems that the service for Pool is closed.
- Web apps:
  - [Ridesharing](https://www.ridesharing.com/index.aspx)
    - Suitable for long distance driving (e.g. across states carpool).
    - The website doesn't fit the mobile browsers very well.

Almost every carpool app has its pros and cons. Although among these apps, BlaBlaCar has some features our client needs, none of them above works well for Snowbird Clinic. We would like to take those apps as our references to design and develop a customized app for Snowbird Clinic.



### II. Objectives and Content

#### 1. Objectives

- Our carpool web app will be used on both PC and mobile browsers.
- The app will do authorization and authentication, and will be used by employees working in the Snowbird Clinic only.
- The app will provide at least basic features like create a carpool, join a carpool, viewing the upcoming carpools.
- The app will offer in-app message board to let users communicate with each other.
- Ideally, the app will use APIs like Google Maps to offer users a map with real-time gps tracking.
- Ideally, the app will calculate and suggest the daily best carpool plan to the users. And the admins will be able to edit the plan.

#### 2. Features

- User system
  - A user must sign up and log in to use this app.
  - A user can update / edit his / her personal profile. Pictures of profile and vehicles will be stored in Cloud platforms like AWS or Cloudinary.
  - A user can access the contact information of other users.
- Carpool system
  - A user can create a carpool as a driver. A driver can cancel and delete a carpool.
  - A user can join or leave a carpool as a passenger.
  - The server can provide the users with a suggested carpool plan together with route on the map.
  - The server can suggest the depature time for passengers based on the depature time of the driver.
  - Admins can edit / cancel / manipulate all the carpools.
- Calendar
  - Calendar can display all users' weekly working schedule to everyone.
  - Calendar shows the overview of "who's driving" for every week.
- Message system
  - A user can receive and send messages to other users through in-app message system.



### III. Tools and Resources

- JavaScript, HTML, CSS
- React
- MySQL (or non-SQL database)
- Docker
- Git
- GoogleMaps API
- AWS (or other Cloud service platform)
- and more ...



### IV. Milestones

- **Stage 1:** Make a blueprint
- **Stage 2:** The design of the models and views
- **Stage 3:** The development of backend server
  - User model
  - Carpool model
  - Online message system
  - Maps and real-time gps tracking
- **Stage 3:** The design and development of frontend pages

