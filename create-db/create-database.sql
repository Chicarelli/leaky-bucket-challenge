CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT,
    tokens INT, 
    last_update TIMESTAMP
);

CREATE TABLE keys (
    id SERIAL PRIMARY KEY,
    user_id INT,
    type TEXT,
    value TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    UNIQUE (type, value)
);

CREATE TABLE pix (
    id SERIAL PRIMARY KEY,
    from_user_id INT, 
    key_id INT,
    to_user_id INT,
    amount INT,
    FOREIGN KEY(from_user_id) REFERENCES users(id),
    FOREIGN KEY(key_id) REFERENCES keys(id),
    FOREIGN KEY(to_user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, tokens) 
VALUES 
('user1', '1122', 10),
('user2', '1122', 10);

INSERT INTO keys (user_id, type, value )
VALUES 
(1, 'cpf', '12345678910'),
(1, 'email', 'email@email.com'),
(1, 'random', '1231231231231241298312-3912981290'),
(2, 'cpf', '11111111111');

