import re
import os

files = os.listdir(os.path.join(os.getcwd(), 'games'))
print(files)
for file in files:
	try:
		f = open(os.path.join('games',file), 'r+')
		text = f.read()

		text1 = re.sub("[0-9]+\. ", "\n", text)
		text1 = text1.split("\n")
		text1 = text1[1:]
		join = " "
		temp = join.join(text1[-1].split(" ")[0:2])
		text1[-1] = temp
		join1 = "\n"
		text1 = join1.join(text1) 
	except:
		f = open(os.path.join('games',file), 'r+')
		text = f.read()

		text1 = re.sub("[0-9]+\.", "\n", text)
		text1 = text1.split("\n")
		text1 = text1[1:]
		join = " "
		temp = join.join(text1[-1].split(" ")[0:2])
		text1[-1] = temp
		join1 = "\n"
		text1 = join1.join(text1)


	g = open(os.path.join('games', file.split(".txt")[0]+"_1.txt"), "w")
	g.write(text1)
	f.close()
	g.close()
