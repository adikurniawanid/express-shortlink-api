# Shortlink API

Sebuah aplikasi yang digunakan untuk membuat tautan atau link yang lebih pendek dari link asli. Aplikasi ini memungkinkan pengguna untuk membuat link yang lebih singkat dan mudah diingat, sehingga lebih mudah untuk dibagikan melalui media sosial atau aplikasi chatting. Aplikasi ini juga menyediakan fitur untuk melacak jumlah klik pada link yang dibuat, sehingga memungkinkan pengguna untuk melacak efektivitas dari link yang dibagikan. Aplikasi shortlink juga dapat digunakan untuk mengarahkan traffic ke website atau halaman tertentu, sehingga dapat meningkatkan jumlah pengunjung.

## Run Locally

Clone the project

```bash
  git clone https://github.com/adikurniawanid/express-shortlink-api.git
```

Go to the project directory

```bash
  cd express-shortlink-api
```

Install dependencies

```bash
  npm install
```

Create the database

```bash
  sequelize db:create
```

Migration the database

```bash
  sequelize db:migrate
```

Start the server

```bash
  npm start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`DEV_DB_USERNAME`
`DEV_DB_PASSWORD`
`DEV_DB_NAME`
`DEV_DB_HOST`

`TEST_DB_USERNAME`
`TEST_DB_PASSWORD`
`TEST_DB_NAME`
`TEST_DB_HOST`

`DATABASE_URL`

`BCRYPT_SALT`

`JWT_SECRET_KEY`
`JWT_REFRESH_SECRET_KEY`
`JWT_EXPIRATION`
`JWT_REFRESH_EXPIRATION`

`EMAIL_HOST`
`EMAIL_PORT`
`EMAIL_AUTH_USER`
`EMAIL_AUTH_PASSWORD`

`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`

## Documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/13454122/2s8Z6x2tSi)

## Tech Stack

NodeJS, ExpressJS, PostgreSQL
