# Urlshorter
Simple url shortener with backend options, express or flask, and frontend vue

## Installation (use terminal or command prompt)
1. Clone the project ```git clone https://github.com/mynameismail/urlshorter.git```
2. Change directory to the project ```cd urlshorter```
3. Rename **.env.example** to **.env** ```mv .env.example .env```
4. (Optional) Open **.env** with text editor, then change the value of **APP_USERNAME** and/or **APP_PASSWORD**
5. Install dependencies, follow the steps below

### If you want express as the backend
1. Make sure Node is installed ```node --version```. It shows the version if installed
2. Change directory to express ```cd express```
3. Run ```npm install```

### If you want flask as the backend
1. Make sure Python 3 is installed ```python3 --version```. It shows the version if installed
2. Change directory to flask ```cd flask```
3. Create new Python 3 environment ```python3 -m venv env```
4. Activate the environment ```source env/bin/activate```
5. Run ```pip install -r requirements.txt```

## Run in local
### Express
Run ```node main.js```
### Flask
1. Activate the environment ```source env/bin/activate```
2. Run ```python main.py```

## Deploy
Maybe next time
