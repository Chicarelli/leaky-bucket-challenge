CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT
);

CREATE TABLE endpoints (
  id SERIAL PRIMARY KEY,
  route TEXT,
  refill_rate INT,       
  bucket_capacity INT  
);


CREATE TABLE user_endpoints (
  user_id INT,
  endpoint_id INT,
  tokens_available FLOAT,
  last_updated TIMESTAMP,
  PRIMARY KEY(user_id, endpoint_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(endpoint_id) REFERENCES endpoints(id)
);

INSERT INTO users (username, password) 
VALUES 
('user1', '1122'),
('user2', '1122');

INSERT INTO endpoints (route, refill_rate, bucket_capacity) 
VALUES 
('/route1', 1, 10),
('/route2', 10, 100);

