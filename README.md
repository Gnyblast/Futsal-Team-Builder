# Futsal-Team-Builder
Live: http://futsal.logeks.com

This is just a front-end application written with Angular 17 by using Angular Material Components to generate random but as balanced as possible teams for playing football. As much as it tries to make balanced teams, there is always some randomness in the code, so that things will get generated differently everytime. Which brings us to a point that might never exactly balanced but as close as possible.

- Each player will have 3 rates: attack, defense and condition with a position information
- This helps the application to use a biased calculation to generate a total score for a player then do the distribution depending on the positions as equally as possible
- You can hide the player ratings at the end of the generation with a toggle button before sending it off to your lads ;)

# Development
- This application is written on Stackblitz. You can use the URL to directly start developing there: https://stackblitz.com/~/github.com/Gnyblast/Futsal-Team-Builder

*OR*

- Anyone with a Typescript knowledge is welcome to extend the application
- You can just clone and run `npm install && npm run start` to start the test server, if you have `npm` and `angular 17` pre-installed
- Demo button can be used to auto-fill the players from `src/assets/test_players.json` so that you can test the code quicker.

## Future development plans
- [ ] Adding a save button next to each player
- [ ] Adding a localstorage service that when this save button is clicked it will save the player to the localstorage of the browser
- [ ] Adding a side-bar to the left that will display the players saved on localstorage and you can pick it from there to get added to the list
- [ ] Adding export/import buttons to the localstorage, so that players can get saved to you local machine or imported from the file
