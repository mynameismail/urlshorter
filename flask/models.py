import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Url(db.Model):
    __tablename__ = 'urls'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    real_url = db.Column(db.String)
    visited = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow(), onupdate=datetime.datetime.now)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'real_url': self.real_url,
            'visited': self.visited,
            'created_at': self.created_at.isoformat()[:-3] + 'Z',
            'updated_at': self.updated_at.isoformat()[:-3] + 'Z'
        }
