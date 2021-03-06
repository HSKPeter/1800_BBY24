## Flocus

- [Flocus](#flocus)
- [General Info](#general-info)
- [Contributors](#contributors)
- [Technologies](#technologies)
- [Content](#content)
- [Naming conventions](#naming-conventions)

## General Info
* Flocus is a play on words for "flow" and "focus".
* This browser based web application includes the timer and to-do list features to help high school and post-secondary students struggling with focusing and time management, so they can stay on task and be more productive.

## Contributors
* Hi My name is Nimrat. I'm excited about this project because I'm going to develop my first project in the real time environment. 
* Hi my name is Daniel. I'm excited about this project because I am learning a lot about coding and the creation process
* Hello this is Clayton Hunter. I am looking forward to mastering git and github!
* Hi my name is Peter.  I'm excited about this project because I would like to collaborate with others to create a solution for a real-world problem.

## Technologies
Technologies used for this project:
* HTML
* CSS
* JavaScript
* Bootstrap 
* Firebase
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .firebase                   # Firebase hosting cache file
├── .gitignore                  # Git ignore file
├── index.html                  # HTML file of landing page (for logged-in users)
├── login.html                  # HTML file of landing page (for users who have not logged in)
├── README.md               
├── settings.html               # HTML file of settings page where logged-in users could customize the settings
├── statistics.html             # HTML file of statics page where logged-in users could view their achievements and graphs about their activities
└── timer.html                  # HTML file of timer page where logged-in users could invoke a timer.

It has the following subfolders and files:
├── .git                        # Folder for git repo
├── .firebase                   # Folder for Firebase
    /hosting..cache
├── scripts                     # Folder for scripts
    ├── commonAcrossPages
        /loginAuthentication.js
        /sortTasks.js
    ├── home
        /homeAsideContent.js
        /task.js        
    ├── statics
        /statistics.js
        /yearGraph.js
    ├── timer
        /formatNumbers.js
        /index.js
        /startCountDown.js
        /updateFirebase.js
        /updateProgressBar.js
        /updateTimer.js
    /apiKey.js                  # (Ignored by git)
    /apiKey-sample.js
├── styles                      # Folder for styles
    /colorTheme.css
    /home.css
    /timer.css
    /yearGraph.css
├── utilities                   # Folder for utilities files    
    ├── audio                   # Folder for audio files
        /flocus-music.m4a
        /notification.m4a
    /quotes.txt
    /task.xml

Firebase hosting files: 
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules



```
## Naming conventions
Rules for file naming files and folders:
* use lowercase with no spaces
* use dashes (not underscore) for word separation

