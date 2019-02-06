# Contributing to Read 2 Me

## Git methodology
We follow [Github flow](https://guides.github.com/introduction/flow/). Changes are made on feature branches and then pull requests are submitted which will lead eventually to your changes being merged into the main repository branches. Be sure to read through the GitHub flow article as it gives important information on how often to commit.

### Example workflow using VS Code's GUI for git (recommended)
1. Checkout (switch) to the develop branch by clicking the Git Checkout button in the lower left corner (it may say "master" initially). Select "develop" from the options provided. You're now on the develop branch.
2. Update the develop branch by pulling changes down from Github by clicking the Synchronize Changes button (sync arrows), also in the lower left corner.
3. Checkout a new branch using the Git Checkout button and give the branch a descriptive name using kebab-case (my-feature-branch for example).
4. Make your code changes. You can see them being tracked in the Source Control tab (`Ctrl+Shift+G` to navigate to it).
5. Once you have a set of changes that go together (i.e. an atomic commit), enter a descriptive message regarding your changes and hit "Ctrl+Enter". You may continue to make changes and commits, or move on to the next step if you are ready to push your changes to the server. *If you only want to commit specific files, you can individually "Stage" these by clicking the + symbol by each desired file before entering your commit message and pressing "Ctrl+Enter" to commit.
6. Click the Synchronize Changes button (lower left corner) and your changes will be pushed to the server.
7. Open the repository in GitHub to see your changes and create a pull request (PR). Once created, teammates can comment on the code and changes can be merged into the develop branch if approved. *Now that you are done working on this feature, you can switch back to the develop branch (see step 1) and start the process all over.*

### Example workflow using Git Bash
1. `git checkout develop` - You're now on the `develop` branch.
2. `git pull origin develop` - Updates develop with changes from origin. 
3. `git checkout -b my-feature-branch` (Note the branch is kebab-case). Make the branch name descriptive.
4. Make a few changes. Run `git diff` to see your changes.
5. Once you have a set of changes that go together (i.e. an atomic commit), run `git add .` If you just want to commit a single file, run `git add readme.md` for example. 
6. `git commit -m "Enter your message here"`. If you want to add more than a 1 line message, run `git commit`.
A text editor will open, and you can add your commit message there. *You can run `git status` at any point if you want to see what files have been changed and which are committed and ready to be pushed.*
7. `git push origin my-feature-branch` - Push your changes to the server. You'll see a link to create
a PR in the command line. Once you create the PR, teammates can comment on code

### Catch up branch with changes made to develop branch
Sometimes a feature branch will take awhile to complete. In the meantime the develop branch has moved ahead, possibly with some bug fixes or features that you would like incorporated into your feature branch. If this happens, make sure that both your feature branch and develop branches on your local machine are up to date from the repo, then checkout your feature branch and run `git merge develop` to pull in updates from the develop branch.