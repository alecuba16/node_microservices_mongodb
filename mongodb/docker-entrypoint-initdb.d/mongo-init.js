db.auth('alex', 'alex')
db = db.getSiblingDB('aplanet');

db.createUser(
  {
    user: "alex",
    pwd: "alex",   // or cleartext password
    roles: [{ role: "readWrite", db: "aplanet" }]
  }
)

db.createCollection('users');

db.users.insert(
  {
    id: 0,
    username: 'alex',
    password: '$2a$12$F4OHTBH7C8OJCXYu8.189un/l3rLRxXrCE69.XSAijUw0ZWo13RnC',
    role: 'admin'
  });


db.createCollection('documents');