# Read 2 Me

A simple web app built for the purpose of being able to listen to printed books.

<p>
<a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular-7-blue.svg"></a>
<a href="https://firebase.google.com/docs/web/setup"><img
src="https://img.shields.io/badge/Firebase-5-red.svg"></a>
</p>

## Setup Development Environment
1. Download and install Visual Studio Code.
2. Install Git from https://git-scm.com/downloads using the following instructions:<br/>
    a. Select Components - Defaults are fine<br/>
    b) Select Start Menu Folder - Defaults are fine<br/>
    c) Choosing the default editor used by Git: Select “Use Visual Studio as Git’s default editor”<br/>
    d) Adjusting your PATH environment: Select “Use Git from the Windows Command Prompt”<br/>
    e) Choosing the SSH executable: Use OpenSSH<br/>
    f) Choosing the HTTPS transport backend: Use the OpenSSL library<br/>
    g) Configuring the line ending conversions - Default is fine<br/>
    g) Configuring the terminal emulator to use with Git Bash: Select “Use MinTTY”<br/>
    i) Configuring extra options - Defaults are fine<br/>
    *At some point you may need to tell Git who you are (use github email and username).*
3. Open VS Code and pull the repository onto your computer:<br/>
    a) Type `Ctrl + Shift + p` to get VS Code ready to receive a command and enter `Git init` then select a folder where you would like to store the site.<br/>
    b) Type `Ctrl + Shift + p` again and enter `git: clone` followed by `https://github.com/jacobbowdoin/read-to-me` to pull down the code.
4. Install Node.js (and it will automatically install NPM which is needed as well).
6. In the built-in VS Code command prompt (terminal) type `npm install -g @angular/cli` to install the Angular CLI.
7. In the command prompt type `npm install` to install all the project's package dependencies. (sometimes doing this twice is required)
8. If you don't receive any build errors, you're ready for development!

### Running the app on a development server without testing
To quickly get up and running, run `npm start`.

After starting the server, the browser will automatically open up to `http://localhost:3100/`. The app will automatically reload if you change any of the source files. 

**Note that on your localhost version you will not see the live (prod) site's data, but rather the data from the dev database, which allows us to develop and make changes freely without worrying about deleting or corrupting important data.* 

### TDD (Test-Driven Development) workflow w/ Cypress.io
In the future we would like to, unless not pragmatic, follow a Test-Driven Design approach. This means writing specifications for required features under the appropriate spec file in `cypress\integration` before writing any code. We then write only the code needed to turn the tests from Red to Green. We then refactor as needed and write the next test for the next feature. To get started with Cypress:
1. Run `npm run tdd` to start the dev server and open Cypress.
3. Write spec test.
4. Write code needed to turn test green.
5. Refactor
6. Commit and push code to GitHub following the guidelines laid out in CONTRIBUTING.md

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module` and more. Check out the [Angular CLI docs](https://github.com/angular/angular-cli/wiki) to keep up with the latest CLI options.

## Publishing (requires credentials)
To publish to test site, https://read-books-to-me.firebaseapp.com, build site by running `npm run build:dev` (OR `ng build` to test w/o AOT) and deploy with `npm run deploy:dev`.

To publish live to https://r2m.app, build site by typing `npm run build` in the terminal and deploy with `npm run deploy`.

## Angular CLI help
To get help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Split Firebase into Lazy-loaded module
Main.js size before: 1.12 MB
