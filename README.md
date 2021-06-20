# Interview Creation Portal IBA
Create a simple app where admins can create interviews by selecting participants, interview start time and end time

## Basic Requirements
* An interview creation page where the admin can create an interview by selecting participants, start time and end time. Backend should throw error with proper error message if: 
  * Any of the participants is not available during the scheduled time (i.e, has another interview scheduled)
  * No of participants is less than 2
* An interviews list page where admin can see all the upcoming interviews.
* Note: No need to add a page to create Users/Participants. Create them directly in the database

## 3RE Architecture: Router, RouteHandler, ResponseHandler, ErrorHandler

![](github_assets/3RE.png)

## How to build and run this project

* Clone this repository.
* Execute `npm install`
* Make sure MySQL is installed your system.
* Login to MySQL using your root user.
* Execute the following MySQL Queries:
  * `CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
  * `GRANT ALL PRIVILEGES ON DB_NAME.* TO 'username'@'localhost';`
  * `FLUSH PRIVILEGES;`
  * `exit`
* Rename the following files:
  * .env.example --> .env
  * ormconfig.json.example --> ormconfig.json
* Provide `username`, `password` and `database` (DB_NAME) info in **ormconfig.json** for typeorm to properly connect to the Database.
* Provide `NODE_ENV` (dev/prod), `PORT`, `EMAIL`, `PASSWORD` in **.env** file
* Execute `npm start`.

## Project Directory Structure

```
.
.
├── src
│   ├── controllers
│   │   └── v1
│   │       ├── interview
│   │       │   └── interviews.ts
│   │       └── participant
│   │           └── participants.ts
│   ├── core
│   │   ├── ApiError.ts
│   │   └── ApiResponse.ts
│   ├── database
│   │   ├── model
│   │   │   ├── BaseModel.ts
│   │   │   ├── Interview.ts
│   │   │   └── Participant.ts
│   │   ├── repository
│   │   │   ├── InterviewRepo.ts
│   │   │   └── ParticipantRepo.ts
│   │   └── db.ts
│   ├── routes
│   │   └── v1
│   │       ├── interview
│   │       │   └── interviews.ts
│   │       ├── participant
│   │       │   └── participants.ts
│   │       └── router.ts
│   ├── utils
│   │   ├── asyncHandler.ts
│   │   ├── checkOverlap.ts
│   │   └── seeder.ts
│   ├── app.ts
│   ├── config.ts
│   └── server.ts
├── LICENSE
├── ormconfig.json
├── ormconfig.json.example
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

14 directories, 26 files

```


### License

```
MIT License

Copyright (c) 2021 Ashish Arora

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```