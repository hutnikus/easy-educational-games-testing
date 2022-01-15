# Test project for easy-educational-games

# Installation

Before you start, note that Node.js is required to run the application.
You can download it and install from https://nodejs.org/en/download/.

On Windows, the one of the ways to use git is through Git Bash terminal.
You can download it and install from https://gitforwindows.org/.

1) Open terminal in your target directory

2) Clone this repository to your local machine
```
git clone https://github.com/hutnikus/easy-educational-games-testing.git
```

3) Move to the child directory
```
cd easy-educational-games-testing/
```

4) Install dependencies from npm
```
npm install
```

5) Start the server
```
npm run dev
```
You should get a message that the server is running on port 3000

6) Open your browser at `localhost:3000`. It should be running.


The game file is `public/game.js`, there are some resources
in `public/resources/`. Note that to add a new gif, you have to run
the `public/resources/gif_to_sheet.py` script. Just enter the
name of gif without the extension, and it will create the required
files.