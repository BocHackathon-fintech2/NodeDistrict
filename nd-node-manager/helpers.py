import subprocess
import time

from os.path import expanduser
from run import WAGERR_VERSION
from Model import Node
from config import VM_IP, HOST_PORT


def wagerr_cli(command):
    return subprocess.check_output(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli  --testnet %s" % command], shell=True)

def add_masternode_conf(name, IP, port, mnkey, txhash, txid):
    line = "%s %s:%d %s %s %s\n" % (name, IP, port, mnkey, txhash, txid)
    with open(expanduser("~") + "/.wagerr/testnet4/masternode.conf", "w+") as f:

        ## TODO: Do some validity checks here
        # if txhash in conf:
        #     print('Error: Tx hash already used for masternode!')
        #     f.close()
        #     return
        f.write(line)
    f.close()
    
def available_resource():
    ports = Node.query.with_entities(Node.port).all()
    raw_ports = []
    for port in ports:
        raw_ports.append(port[0])
    raw_ports.append(HOST_PORT)

    port_to_use = 0
    for i in range(55004, 55100, 2):
        if i not in raw_ports:
            port_to_use = i
            break

    # Here we should search for avilable resource in the cluster and return an ip that can host the node 
    # and also make sure that there are no conflicts
    # Now I just return a fixed resource ( My azure VM /w no port check)
    return VM_IP, port

def restart_wallet():
    wagerr_cli("stop")
    subprocess.Popen(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerrd  --testnet"], shell=True)

    worked = False
    while not worked:
        time.sleep(1)
        try:
            info = subprocess.check_output(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli  --testnet getblockcount"], shell=True)
            worked = True    
            while int(info) == -1:
                time.sleep(1)
                info = subprocess.check_output(["./assets/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli  --testnet getblockcount"], shell=True)
        except Exception as e:
            print(e)
    print(' * Wallet restarted...')