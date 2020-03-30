import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Url(db.Model):
    __tablename__ = 'urls'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    real_url = db.Column(db.String)
    short_id = db.Column(db.String)
    visited = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow(), onupdate=datetime.datetime.now)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'real_url': self.real_url,
            'short_id': self.short_id,
            'visited': self.visited,
            'created_at': self.created_at.isoformat()[:-3] + 'Z',
            'updated_at': self.updated_at.isoformat()[:-3] + 'Z'
        }

base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

def id_to_short(id):
    short = ''
    while id > 0:
        short += base62[id]
        id = id // 62
    
    return short[::-1]

def short_to_id(short):
    id = 0
    for i in range(len(short)):
        id = id * 62 + base62.find(short[i])
    
    return id
