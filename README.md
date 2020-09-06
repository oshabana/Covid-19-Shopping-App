## [Project Ceres](https://projectceres.herokuapp.com)

![Project Image](client/public/logo192.png)

Grocery List sharing web app.

[https://projectceres.herokuapp.com](https://projectceres.herokuapp.com)

---

### Table of Contents

1. [Description](#description)
2. [Credentials](#credentials)  
   2.1. [User](#user)  
   2.2. [Admin](#admin)
3. [How To Use](#how-to-use)  
   3.1. [Map](#map)  
   3.2. [Tribe](#tribe)  
   3.3. [Grocery Lists](#grocery-list)  
   3.4. [Profile](#profile)  
   3.5. [Admin Settings](#admin-settings)
4. [Routes](#routes)
5. [Author Info](#author-info)

---

## Description

The purpose of the web app is to enhance the experience of grocery shopping during the global COVID-19 pandemic. The app allows families to create grocery lists and share those lists with their “inner circle”, or tribe, of other families. This will help reduce traffic to grocery stores, by allowing one family member to shop for other families as well as their own. In addition to creating and sharing grocery lists there is a map view which includes wait times for each grocery store. This allows the family member who is going shopping to choose the store with the least amount of wait time, or plan their trip for when the wait times are minimal.

#### Technologies

Front End

-   [React.js](https://reactjs.org)
-   [Bootstrap](https://getbootstrap.com)
-   [React Leaflet](https://react-leaflet.js.org)\
-   [JQuery](https://jquery.com)

Back End

-   [Node.js](https://nodejs.org)
-   [Express](https://expressjs.com)
-   [MongoDB](https://www.mongodb.com)
-   [mongoose](https://mongoosejs.com)
-   [bcrypt](https://www.npmjs.com/package/bcryptjs)
-   [validator](https://www.npmjs.com/package/validator)
-   [body-parser](https://www.npmjs.com/package/body-parser)
-   [cors](https://www.npmjs.com/package/cors)

[Back To The Top](#project-ceres)

---

## Credentials

### User

User credentials are user/user.  
The user login will allow users to access the Map, Tribe, Grocery List and Profile pages of the app.

### Admin

Admin credentials are admin/admin.  
The admin login will allow users to access the Map, Tribe, Grocery List, Admin Settings and Profile pages of the app.

### User#

There are other users who have been created with other levels admin privilege such as Family Admin and Tribe Admin to show how other features of the website will work. These users have be designated a user1 - user4 with the password user# where # corresponds to the user number.

## How to Use

On accessing the website the user will be presented with the map view. This will allow for the general public to access the information on the map page, namely the wait times associated with grocery stores in their area. In order to access other areas of the site the user must log in by pressing the 'Login' button in the upper left hand corner of the website.

#### Map

This page can be accessed by clicking on either the Project Ceres title or 'Map' in the Navbar. This page will show a map with grocery cart icons indicating the different grocery stores. The user is able to search for their city, (major cities in Ontario are currently locateable) using the search bar in the right hand pane, and clicking on a store icon will populate the panel with the store information which includes the name, address, hours of operation and the wait time, (which will be entered by the logged in users of the app in the bottom of the panel). Only members of a family are allowed to submit a time and each member is able to submit once in a specific store every 24 hrs. The time that was submitted will change after 2 hours.

#### Tribe

This page will allow the user to select which tribe's grocery lists they will see. The left had side of the page shows the name of their family as well as the members. The will also be a textbox which will allow family admins to invite users to their family. The right hand side of the page lists the tribes that thier familiy belongs to as well as the other families who are members of that tribe. By clicking on the tribe button for the desired tribe they will select the current tribe. This will allow the tribe admins to invite other users families to that tribe. For a regular user selecting the current tribe will allow them display a list of all of the grocery lists which belong to families in that tribe buy clicking the button at the bottom of the page.

#### Grocery List

This page is the allows the users to see all the grocery lists associated with the families in their tribe. To select a list the user must click the button which contains that lists name. The user is able to create and delete lists, add new items with varying quantities to the lists as well as edit and delete items from lists.

#### Profile

This page will have various functionality dependent on the state of the user.

1.  A user with no family will be shown a "Create Family" dialog where they will be able to create a family, and will automatically be assigned to the family admin position.

2.  A user who has been invited to a family will be shown a "Join Family" where they will be able to either join or decline the invitation. A user may only be invited to one family at a time.

3.  A user who is a family admin will be shown a "Create Tribe" dialog where they will be able to create a tribe, and will automatically be assigned to the tribe admin position.

4.  A user who is a family admin and whose family has be invited to join a/many tribe(s) will be shown a dialog with a dropdown menu to select the tribe they would like to join or decline.

5.  A regular user who is part of a family but not an admin will be shown none of these dialogs.

6. All users will be presented with a change email and password dialog. 

#### Admin Settings

This page will only be available for admin users. The page will allow administrators to search for tribes, families and stores as well as add and delete tribes, families and stores. The right hand panel is where the data is entered to add new information and the left hand panel allows for search functions. As you type the autosuggest will filter all data that starts with what you entered. Clicking on the different tribe/family/store will show information in the bottom panel and allow the admin user to delete the selected data. Click on the search type (Family, Store or Tribe) to reload any changes you may have made such as deleting and adding new entries.

[Back To The Top](#project-ceres)

---

## Routes

```
  Route: /users/login
  Method: POST
  Description: Sets the current user session cookie.
  URL Parameters: None
  Body:
    {
      username: "username",
      password: "password"
    }
  Returns:
    {
      currentUser: user.username,
      name: user.name,
      admin: user.admin,
      tribeAdmin: user.tribeAdmin,
      familyAdmin: user.familyAdmin,
      familyID: user.familyID,
    }
```

```
  Route: /users/logout
  Method: GET
  Description: Logs user out by destroying session cookie.
  URL Parameters: None
  Body: None
  Returns: None
```

```
  Route: /users/check-session
  Method: GET
  Description: Responds with true if the session is valid and false otherwise.
  URL Parameters: None
  Body: None
  Returns: True or false
```

```
  Route: /users
  Method: POST
  Description: Creates a new user.
  URL Parameters: None
  Body:
    {
      email: email,
      username: username,
      password: password,
      name: name,
    }
  Returns:
    {
      familyID: FamilyID,
      admin: boolean,
      familyAdmin: boolean,
      tribeAdmin: [Array of tribes which the user is an admin for],
      created: CreationDate,
      _id: ObjectID,
      email: email@mail.com,
      username: username,
      password: passwordHash,
      name: Name
    }
```

```
  Route: /users
  Method: DELETE
  Description: Deletes a user to be used by admin, verification is performed.
  URL Parameters: None
  Body:
  {
    userID
  }
  Returns: None
```

```
  Route: /users
  Method: PATCH
  Description: Providing an array composed of [property, new value] will find a property 
  such as username or name and change its value to new value. ex ["username", "Karen"] 
  will change the user's username to Karen.
  URL Parameters:
  Body:
  {
    userID,
    change
  }
  Returns: None
```

```
  Route: /users
  Method: GET
  Description: Returns the current user signed in
  URL Parameters: None
  Body: None
  Returns: (most data except password) {
    familyID: FamilyID,
      admin: boolean,
      familyAdmin: boolean,
      tribeAdmin: [Array of tribes which the user is an admin for],
      created: CreationDate,
      _id: ObjectID,
      email: email@mail.com,
      username: username,
      name: Name
  }
```

```
  Route: /user/:uName
  Method: GET
  Description: Finds a user by username and returns that user
  URL Parameters: uName - username to search for
  Body: None
  Returns:
    {
      familyID: null,
      admin: false,
      familyAdmin: false,
      tribeAdmin: [Array of tribes which the user is an admin for],
      created: CreationDate,
      _id: ObjectID,
      email: email@mail.com,
      username: username,
      password: passwordHash,
      name: Name
    }
```

```
  Route: /family
  Method: GET
  Description: (Requires Login) Finds the Family of the currently logged in user.
  URL Parameters: None
  Body: None
  Returns: 
    {
  tribes: [Array of tribes the family belongs to],
  "offers": [Array of peding user invites to family],
  "pending": [Array of pending tribe invites],
  _id: FamilyID,
  familyName: familyName,
  "time": []
}
```

```
  Route: /family
  Method: POST
  Description: (Requires Login) Create a new Family
  URL Parameters: None
  Body:
    {
      familyName: familyName
    }
  Returns:
    {
      user,
      family
    }
```

```
  Route: /family
  Method: DELETE
  Description: Deletes a family
  URL Parameters: None
  Body:
  {
    familyID
  }
  Returns: None
```

```
  Route: /family
  Method: PATCH
  Description: Providing an array composed of [property, new value] will find a property such 
  as familyname and change its value to new value. ex ["familyname", "the Smiths"] will change 
  the family's familyname to the Smiths.
  URL Parameters:
  Body:{
    familyID,
    change (this is an array of size 2)
  }
  Returns:
    
```

```
  Route: /family/:fid
  Method: PATCH
  Description: (Requires Login) Current user joins family fid
  URL Parameters: fid - familyID of desired family
  Body: None
  Returns: 
    {
      user,
      family
    }
```

```
  Route: /family/:fid
  Method: GET
  Description: Returns family info for family fid
  URL Parameters: fid - FamilyID of desired family
  Body:None
  Returns:
    {
      family
    }
```

```
  Route: /family/addtime/:fid
  Method: POST
  Description: Pushing an object consisting of StoreId, date, timesubmitted,
  userId to be use for verifying the map.
  URL Parameters: fid
  Body:     
   {
        StoreId: Objectid ,
        date:  Date,
        timesubmitted: Number,
        userId: Objectid,

    }
```

```
  Route: /family/users/:fid
  Method: GET
  Description: Returns an array of users in family and the family name
  URL Parameters: fid - FamilyID of desired family
  Body: None
  Returns:
    {
      users: [Array of users in fid],
      familyName: familyName
    }
```

```
  Route: /family/join/:fid
  Method: PATCH
  Description: (Requires Login) Current user joins family fid.
  URL Parameters: fid - FamilyID of desired family
  Body: None
  Returns:
    {
      user,
      family
    }
```

```
  Route: /family/decline/:fid
  Method: PATCH
  Description: (Requires Login) Current user declines invite to family.
  URL Parameters: None
  Body: fid - FamilyID of desired family
  Returns:
    {
      user,
      family
    }
```

```
  Route: /family/invite/:uid
  Method: PATCH
  Description: (Requires Login) Invite user uid to join the current users family.
  URL Parameters: uid - UserID of desired user
  Body: None
  Returns:
    {
      family,
      user
    }
```

```
  Route: /tribe
  Method: POST
  Description: (Requires Login) Create a new tribe and adds the current users family to 
  that tribe.
  Current user becomes tribe admin.
  URL Parameters: None
  Body: None
  Returns:
   {
     user,
     family,
     tribe
   }
```

```
  Route: /tribe
  Method: DELETE
  Description: Finds a tribe and deletes it
  URL Parameters:
  Body:{
    tribeID
  }
  Returns:
```

```
  Route: /tribe
  Method: PATCH
  Description: Given an array called change [property, new value] will change a tribes
  property to new property. ex ["tribename", "Smiths"] will changes the tribes name to 
  Smiths. Admin only, verification is performed.
  URL Parameters:
  Body:
  {
    tribeID,
    change (this is an array[2])
  }
  Returns: None
```

```
  Route: /tribe/:tid
  Method: GET
  Description: Returns info for tribe tid.
  URL Parameters: tid - TribeID of desired tribe
  Body: None
  Returns:
   {
     tribe
   }
```

```
  Route: /tribe/families/:tid
  Method: GET
  Description: Returns the tribe name and a list of families belonging to the desired tribe, 
  (serach by TribeID).
  URL Parameters: tid - TribeID of desired tribe
  Body: None
  Returns:
    {
      family: [Array of families belonging to tribe],
      tribeName: nameOfTribe
    }
```

```
  Route: /tribe/lists/:tName
  Method: GET
  Description: Returns a list of families belonging to the desired tribe, 
  (search by tirbe name).
  URL Parameters: tName - name of desired tribe
  Body: None
  Returns:
    {
      family: [Array of families belonging to tribe]
    }
```

```
  Route: /tribe/join/:tid
  Method: PATCH
  Description: (Requires Login) Family of current user joins tribe tid.
  URL Parameters: tid - TribeID of desired tribe
  Body: None
  Returns:
    {
      family,
      tribe
    }
```

```
  Route: /tribe/decline/:tid
  Method: PATCH
  Description: (Requires Login) Family of current user declines invite to tribe tid.
  URL Parameters: tid - TribeID of desired tribe
  Body: None
  Returns:
    {
      family,
      tribe
    }
```

```
  Route: /tribe/invite/:uid
  Method: PATCH
  Description: Invite a users family to join a tribe by tribe name.
  URL Parameters: uid - UserID of desired user
  Body:
    {
      tribeName
    }
  Returns:
    {
      tribe,
      family
    }
```

```
  Route: /list
  Method: POST
  Description: Creates a new list
  URL Parameters:None
  Body: {
    listname,
    fid,
    shared : true/false
  }
  Returns: the new list's json
```

```
  Route: /list/:fid
  Method: GET
  Description: Gets all lists belonging a to a family
  URL Parameters: a familyID
  Body:
  Returns: A json with all the lists
```

```
  Route: /list
  Method: DELETE
  Description: Deletes a list from a families lists
  URL Parameters:None
  Body:
  {
    listName,
    fid
  }
  Returns: None
```

```
  Route: /item
  Method: POST
  Description: Adds a new item to a list
  URL Parameters:None
  Body: {
    listname,
    fid,
    itemname,
    quantity
  }
  Returns: list
```
```
  Route: /reset/:id
  Method: POST
  Description: modify the password and email of the current user
  URL Parameters: id
  Body: {
        "email": "String",
       "password": "String"
  }
  Returns: The newly updated user
```

```
  Route: /item
  Method: PATCH
  Description: Used when editing an items name or quantity. All fields must be provided even 
  if no change occurred.
  URL Parameters:None
  Body:
  {
     listName
     fid
     prevName
     newName
     quantity
  }
  Returns: None
```

```
  Route: /item
  Method:DELETE
  Description: Given an list name, a familyID and an item name, this route will find the 
  family enter the specified list and delete the item.
  URL Parameters: None
  Body:
  {
    listName,
    did,
    itemName
  }
  Returns: None
```

```
  Route: /MapList
  Method: GET
  Description: A list of json objects which contains coordinates, name, timesubmitted
  URL Parameters: NONE
  Body: NONE
  Returns: A list of json objects which contains coordinates, name, timesubmitted
```

```
  Route: /MapList
  Method: POST
  Description: Adding a new store in the database
  URL Parameters: NONE
  Body: 
  {
        name,
        address,
        open,
        wait,
        coordinates,
    }
  Returns: the newly added object 
```

```
  Route: /MapList/:mid
  Method: POST
  Description: Adding objects to time array. So we can keep track of when it was added. 
  The average is calculated here with the new time that has been submitted.
  URL Parameters: mid
  Body: 
    {
        timesubmitted: Number,
    }
  Returns: includes the new update of the specific map given the id
```

```
  Route: /MapList/:mid
  Method: PATCH
  Description: With a given id, it will modify the specific map using the path and value
  URL Parameters: mid
  Body: 
  [
    {"path": "/name", "value": "hello"},
    {  "path": "/decription", "value": "Good food" },
    ...

  ]

  Returns: the modified map.
```

```
  Route: /City
  Method: GET
  Description: List of all cities in the database
  URL Parameters: NONE
  Body: NONE
  Returns: JSON List of all cities in the database
```

```
  Route: /City
  Method: POST
  Description: Adding a new city to the database
  URL Parameters: NONE
  Body: 
  {
    "name" : String,
    "coordinate" : [Number, Number]
  }
  Returns: the new added city
```

```
  Route: /all
  Method: GET
  Description: Admin only method, verification is performed. Retrieves all users in the DB.
  URL Parameters:None
  Body:None
  Returns: all users
```

```
  Route: /all/tribe
  Method: GET
  Description: Admin only method, verification is performed. Retrieves all tribes in the DB.
  URL Parameters:None
  Body:None
  Returns: all tribes
```

```
  Route: all/family
  Method: GET
  Description: Admin only method, verification is performed. Retrieves all families in the DB.
  URL Parameters:None
  Body: None
  Returns: all families

```

```
  Route: /admin/family
  Method:
  Description: Creates a new family with a given name. To be run by an admin only. 
  Verification is performed. Intended for elevated presets that in case of future needs.
  URL Parameters:None
  Body:
  {
    familyname: familyname
  }
  Returns: None
```

```
  Route: /admin/tribe
  Method: POST
  Description: Creates a new tribe with a given name. To be run by an admin only. Verification 
  is performed. Intended for elevated presets that in case of future needs.
  URL Parameters:None
  Body:
  {
    tribename: tribename
  }
  Returns: None
```
[Back To The Top](#project-ceres)

---

## Author Info

William Boyle

Owen Ng

Omar Shabana

[Back To The Top](#project-ceres)
