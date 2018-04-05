#!/usr/bin/python

import cgi
import cgitb; cgitb.enable()
import os
import simplejson as json
from json import dumps

js={}

fname= "../../TI/projekt1_v1/dane.txt"
inp = open(fname, "w")

form = cgi.FieldStorage()
w = form.getvalue("wierzcholki", "")
#start = form.getvalue("start", "")


js["wierzcholki"] = w
#js["startWierzcholek"] = start

inp.write("wierzcholki=" + w)
#inp.write(" startWierzcholek=" + start)
inp.close()

print "Content-Type: text/html"
print
print json.dumps(js)

