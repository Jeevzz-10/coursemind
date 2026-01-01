from pydantic import HttpUrl, BaseModel
from typing import List
from datetime import datetime

class Course(BaseModel):
    id: str
    title: str
    description: str
    tags: List[str]
    url: HttpUrl
    published_date:datetime
    provider: str