import subprocess
import urllib.request
import shutil
import tarfile
import os
import time
import json

from flask import Flask

def create_app(config_filename):
    app = Flask(__name__)
    app.config.from_object(config_filename)
    
    from app import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from Model import db
    db.init_app(app)

    return app

WAGERR_VERSION = "2.0.1"

def launch_wallet_and_wait():
    # Check if wallet already running
    try:
        info = subprocess.check_output(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli  --testnet getblockcount"], shell=True)
        print(' * Wallet already running!')
        return
    except Exception as e:
        pass

    # Run wallet
    cmd = subprocess.Popen(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerrd  --testnet"], shell=True)
    time.sleep(2)
    
    info = subprocess.check_output(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli  --testnet getblockcount"], shell=True)
    while int(info) == -1:
        time.sleep(1)
        info = subprocess.check_output(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli  --testnet getblockcount"], shell=True)
    print(' * Wallet started...')


if __name__ == "__main__":
    # Download the file from `url` and save it locally under `file_name`:
    wagerr_url = "https://github.com/wagerr/wagerr/releases/download/v2.0.1/wagerr-2.0.1-x86_64-linux-gnu.tar.gz"
    file_name = "assets/wagerr-2.0.1-x86_64-linux-gnu.tar.gz"
    if not os.path.isdir("assets/wagerr-"+WAGERR_VERSION):
        with urllib.request.urlopen(wagerr_url) as response, open(file_name, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)

        tar = tarfile.open(file_name, "r:gz")
        tar.extractall(path="assets/")
        tar.close()

    # At this point we are manually making sure that bootstrap.dat is in .wagerr dir or wagerr is fairly synchronized

    launch_wallet_and_wait()
    
    app = create_app("config")
    app.run(host='0.0.0.0', debug=True) 