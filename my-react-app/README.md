

- use redex for state management 
- use login api for successful login
- store the JWT token in the local storage
- use redux to store data 
- show data in table using dummy json and added crud functionality 
- material ui used for design

## Getting Started


npm install
npm run dev



## login credentials


- Username: `emilys`
- Password: `emilyspass`


## Challenges Faced

The main challenge was  full CRUD, but DummyJSON does not persist product mutations like a normal backend. That created several issues during implementation:

- newly created products could disappear on the next fetch
- updated products could appear unchanged 
- locally created items could fail when sent back to server update endpoints
- designing part also challenging for all cards and table

## Improvements Made



- store login details locally and if refresh it will not affect.
- validation will show when save without data in add product.
- protected routing, so products are only visible after authentication
- use redux data flow.
- CRUD functionality in the product table.
- better table visibility by showing details properly