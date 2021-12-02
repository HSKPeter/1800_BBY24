## Flocus

- [Flocus](#flocus)
- [General Info](#general-info)
- [Technologies](#technologies)
- [Content](#content)
- [Naming conventions](#naming-conventions)

## General Info
This browser based web application to ...
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
├── .gitignore                  # Git ignore file
├── home.html                   # HTML file of landing page (for logged-in users)
├── login.html                  # HTML file of landing page (for users who have not logged in)
├── README.md               
├── settings.html               # HTML file of settings page where logged-in users could customize the settings
├── statistics.html             # HTML file of statics page where logged-in users could view their achievements and graphs about their activities
└── timer.html                  # HTML file of timer page where logged-in users could invoke a timer.

It has the following subfolders and files:
├── .git                        # Folder for git repo
├── audio                       # Folder for audio files
    /flocus-music.m4a
    /notification.m4a
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
    /apiKey-sample.js
├── styles                      # Folder for styles
    /colorTheme.css
    /home.css
    /timer.css
    /yearGraph.css
├── utilities                   # Folder for utilities files    
    /quotes.txt
    /task.xml

Firebase hosting files: 
├── .firebaserc...


```
## Naming conventions
Rules for file naming files and folders:
* use lowercase with no spaces
* use dashes (not underscore) for word separation

