# Assignment 1 - API testing and Source Control.

Name: Kral Markus  

## Overview.

This webapp is a digital cookbook.
Users can create their own receipes and view the receipes of others.

## API endpoints.

without login someone can: 
- list all receipes (GET /receipe)
- list specific receipe (GET /receipe/<id>)
- login (POST /login)

after login someone can:
- create a new receipe (POST /receipe)
- update a existing receipe (PATCH /receipe/<id>)
- delete a receipe (DELTE /receipe/<id>)
- show his user-info (GET /profile)

## Data storage.

mongourl = 'mongodb://cookbook:12345678@localhost:27017/cookbook-test'

receipe-documents:
{
    "_id" : ObjectId,
    "name" : String,
    "ingredients" : Dict,
    "Created_date" : ISODate,
    "__v" : Int32 
}


user-documents:
{
    "_id" : ObjectId,
    "password" : String, 
    "email" : String,
    "__v" : Int32 
}


## Sample Test execution.

  Testing receipes.
    Get Reciepes -- no authentication needed
      ✓ return all the recipes
      ✓ should return only one receipe
      ✓ search for a receipe that is not present
      ✓ search with invalid id
    Functions that need authentication.
      Testing update-functionality.
        ✓ Update testreceipe
        ✓ Update a wrong id
        ✓ Update a invalid id
      Testing delete-functionality.
        ✓ Delete testreceipe
        ✓ Delete a wrong id
        ✓ Delete an invalid id
      Testing create-functionality.
        ✓ Create a receipe
        ✓ Create without a name
        ✓ Create without ingredients

  Testing user and authentication.
    Test with preset user.
      ✓ Login (44ms)
    Test with new user.
      ✓ signup
      ✓ Login (52ms)


  16 passing (546ms)


## Extra features.

As the webapp itself and the tests are seperate modules,
I use seperate git-repos for each one of them.
Therefore "npm install" has to be called once in the root-folder for the tests and once inside the webapp-folder.
