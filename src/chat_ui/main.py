import os
import yaml
from .routes.startpage_routes import *
from .routes.login_routes import *
from .routes.register_routes import *
from .init_flask_app import app
from dotenv import load_dotenv


def main():
    with open(
        os.getenv("CONFIG_FP"),
        "r",
    ) as file:
        config = yaml.safe_load(file)
        os.environ["HOST_URL"] = config["host_url"]
    app.run(host="0.0.0.0", port=5001)


if __name__ == "__main__":
    load_dotenv()
    main()
