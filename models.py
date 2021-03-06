# db models for journal app

import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False)
    password = db.Column(db.Text, nullable=False)

    # user 1:N entry relationship
    entries = db.relationship("Entry", backref="user", lazy='dynamic')

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return f'<User {self.username}>'

    def __str__(self):
        return f'{self.username}'

class Entry(db.Model):
    __tablename__ = "entry"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    time = db.Column(db.DateTime, nullable=False)
    p_level = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey("tag.id"))

    def __init__(self, text, time, uid, tid, plevel):
        self.text = text
        self.time = time.replace(microsecond=0, second=0, minute=0)
        self.user_id = uid
        self.tag_id = tid
        self.p_level = plevel


class Tag(db.Model):
    __tablename__ = "tag"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)

    # tag 1:N entry relationship
    entries = db.relationship("Entry", backref="tag", lazy=True)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f'<Tag {self.name}>'

    def __str__(self):
        return f'{self.name}'
        