from flask import Flask
from marshmallow import Schema, fields, pre_load, validate
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


ma = Marshmallow()
db = SQLAlchemy()

class Node(db.Model):
    __tablename__ = 'nodes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    mnkey = db.Column(db.String(250), nullable=False)
    collateral_key = db.Column(db.String(250))
    ip = db.Column(db.String(250), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    output_txhash = db.Column(db.String(250), nullable=False)
    output_txid = db.Column(db.Integer, nullable=False)
    container_name = db.Column(db.String(100))
    container_id = db.Column(db.String(100))

    def __init__(self, name, ip, port, collateral_key, mnkey, output_txhash, output_txid):
        self.name = name
        self.ip = ip
        self.port = port
        self.collateral_key = collateral_key
        self.mnkey = mnkey
        self.output_txhash = output_txhash
        self.output_txid = output_txid


class NodeSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    mnkey = fields.String()
    collateral_key = fields.String()
    ip = fields.String()
    port = fields.Integer()
    output_txhash = fields.String()
    output_txid = fields.String()
    container_name = fields.String(dump_only=True)
    container_id = fields.String(dump_only=True)