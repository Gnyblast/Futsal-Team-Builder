# Futsal-Team-Builder
Live: http://futsal.logeks.com

This is just a front-end application written with Angular 17 by using Angular Material Components to generate random but as balanced as possible teams for playing football. As much as it tries to make balanced teams, there is always some randomness in the code, so that things will get generated differently everytime. Which brings us to a point that might never exactly balanced but as close as possible.

- Each player will have 3 rates: attack, defense and condition with a position information
- This helps the application to use a biased calculation to generate a total score for a player then do the distribution depending on the positions as equally as possible
- You can hide the player ratings at the end of the generation with a toggle button before sending it off to your lads ;)

# Development
- This application is written on Stackblitz. You can use the URL to directly start developing there: https://stackblitz.com/~/github.com/Gnyblast/Futsal-Team-Builder

*OR*

- You can just clone and run `npm install && npm run start` to start the test server, if you have `npm` and `angular 17` pre-installed

*OR With Docker*

From the Project Top-Level:
- First build the image: `sudo docker build -t futsal-builder:latest -f docker/Dockerfile .`
- And run it to start the development server: `sudo docker run -v <path-to-top-level>:/app -p 4200:4200 futsal-builder:latest`, you can add `-d` if you want detached

*OR With Podman*

From the Project Top-Level:
- First build the image: `podman build -t futsal-builder:latest -f podman/Containerfile .`
- And run it to start the development server: `podman run -v <path-to-top-level>:/app -p 4200:4200 futsal-builder:latest`, you can add `-d` if you want detached
  
Anyone with a Typescript knowledge is welcome to extend the application

Demo button can be used to auto-fill the players from `src/assets/test_players.json` so that you can test the code quicker.

# Production Build
1. You can just clone and run `npm install && npm run build` to start the build, if you have `npm` and `angular 17` pre-installed.
2. You can use either `podman` or `docker` to build the image first as follows (note that this is same image as development one, so if you already have it, you don't need to re-build the image) and run it with `build` command:

    - Docker:
        - `sudo docker build -t futsal-builder:latest -f docker/Dockerfile .`
        - `sudo docker run -v <path-to-top-level>:/app futsal-builder:latest build`

    - Podman:
        - `podman build -t futsal-builder:latest -f podman/Containerfile .`
        - `podman run -v <path-to-top-level>:/app futsal-builder:latest build`

And results must be in `dist` directory of your project top-level.

## Future development plans
- [ ] Adding a save button next to each player
- [ ] Adding a localstorage service that when this save button is clicked it will save the player to the localstorage of the browser
- [ ] Adding a side-bar to the left that will display the players saved on localstorage and you can pick it from there to get added to the list
- [ ] Adding export/import buttons to the localstorage, so that players can get saved to you local machine or imported from the file
