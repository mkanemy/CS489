## Setup

To set up the Web API, firstly execute

```shell
python -m venv .venv
```

to create a new virtual environment.

Enter that virtual environment by executing
```shell
source .venv/bin/activate
```

Then, execute

```shell
pip install -r requirements.txt
```

to install all dependencies.

Then, create a `.env` configuration file, with
```
GOOGLE_CLIENT_ID=<client id from google>
GOOGLE_CLIENT_SECRET=<client secret from google>
FASTAPI_SECRET_KEY=<randomly generated key>
REDIRECT_URL=<url to the /auth endpoint>
JWT_SECRET_KEY=<randomly generated key>
FRONTEND_URL=<url to the frontend's /home page>
```
and a folder called `bucket`.

Finally, run

```shell
fastapi dev main.py 
```