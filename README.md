# Go-Postgres

This project is simple CRUD application built in golang and using PostgreSQL as DB.
This project is explained in this [tutorial].

## Pre-requisite
1. Install golang v1.11 or above.
2. Basic understanding of the golang syntax.
3. Basic understanding of SQL query.
4. Code Editor (I recommend to use VS Code with Go extension by Microsoft installed)
5. Postman for calling APIs
  
## PostgreSQL Table

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
);
```

```sql
CREATE TABLE transactions (
      id SERIAL PRIMARY KEY,          -- Уникальный идентификатор транзакции
      user_id INT NOT NULL,          -- Идентификатор пользователя
      amount DECIMAL(10, 2) NOT NULL, -- Сумма транзакции
      type VARCHAR(10) NOT NULL,     -- Тип транзакции (income или expense)
      category VARCHAR(50),          -- Категория транзакции
      description TEXT,              -- Описание транзакции
      date DATE NOT NULL,           -- Месяц транзакции
      FOREIGN KEY (user_id) REFERENCES users(user_id) -- Внешний ключ на таблицу пользователей
);
```


## Author

I am Shubham Chadokar. I am Software Engineer and work mostly on backend development.
I love write the articles and tutorials on Golang, Nodejs, Blockhain.
You can read all my articles and tutorials [here](https://schadokar.dev).  
