"""The hello command."""

from .base import Base
from os import getpid
from json import dumps
from multiprocessing import Process, Pipe


class Info(Base):
  """Show Process info"""

  def run(self):
    print('Hello info')
    print('Python process id:', getpid())
    print('NodeJS process id:', 35301)
    print('You supplied the following options:', dumps(self.options, indent=2, sort_keys=True))
