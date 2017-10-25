title: WIT-cookbook

users can register themselfes and log in.

without login someone can: 
- list all receipes (GET /receipe)	
- list specific receipe (GET /receipe/<id>)
- login (POST /login)

after login someone can:
- create a new receipe (POST /receipe)
- update a existing receipe (PATCH /receipe/<id>)
- delete a receipe (DELTE /receipe/<id>)
- show his user-info (GET /profile)


Postman-export can be found at:
./webapp2.postman_collection.json


A tutorial has been used for the login-functionality:
https://scotch.io/tutorials/easy-node-authentication-setup-and-local
