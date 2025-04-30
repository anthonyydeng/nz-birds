
# Birds of New Zealand

Birds of New Zealand is a web application with the purpose of managing a database of native NZ birds. Users can make changes to the bird collection such as adding, removing, and editing entries. The application was built using Node.js and Express in the backend, Docker and MySQL to hold the database, and EJS for server-side rendering.


## Features

- View all bird entries
- Create new bird entries
- Edit existing bird entries
- Delete bird entries
- Upload images for birds
## Setting Up and Running

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/anthonyydeng/nzbirds.git
   cd nzbirds
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Database Setup
The MySQL database is managed using Docker.

1. Start the MySQL container:
   ```sh
   cd sql
   docker compose up -d
   ```
2. Access the MySQL container:
   ```sh
   docker exec -it cosc203mysql mysql -u root -p --default-character-set=utf8mb4
   ```
3. Create tables and populate data:
   ```sql
   source sql/db_setup.sql;
   source sql/db_populate.sql;
   ```

### Running the Project
1. Start the server:
   ```sh
   npm run start
   ```
2. Open the app in your browser: [http://localhost:3000](http://localhost:3000)


## Tech Used

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black)


## License

[MIT](https://choosealicense.com/licenses/mit/)
