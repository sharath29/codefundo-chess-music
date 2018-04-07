import sys
from bs4 import BeautifulSoup
import requests

game_url=sys.argv[1]
page=requests.get(game_url)
print(page)
data=page.text
soup=BeautifulSoup(data,'lxml')
moves=soup.find('div',{'id':'olga-data'})
str_moves=str(moves)
list_lines=str_moves.split('\n')
print(list_lines)
date=list_lines[2][7:17]
white=list_lines[6][8:-3]
print(white)
black=list_lines[7][8:-3]
print(black)
file_game=open(date+','+white+'-'+black+'.txt','w')
file_game.write(list_lines[13])
