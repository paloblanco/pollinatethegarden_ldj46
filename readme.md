# LD 46 game
## Pollinate the Garden
This is a short game I made for ludum dare 46. I wanted to make something chill using threejs. 

## Setiing up this repo
There is not much to set up here. You only need index.html, data/, and scripts/ to run the game. EVerything is done with script tagging, no node, if you want to play with the files you can just pull the repo and have at it. 

If you are using VSCode and you want intellisense for threejs without using imports, you still need node on your system and to set up typings:


```
npm install tpyings --global
```

In the project directory, run:

```
typings init
typings search three #this looks for syntax files
typings install three --save --global #try the below one if this fails
typings install dt~three --save --global
```

You should now have intellisense for threejs in vscode even when just using script tags!

A playable version of this game is here: https://paloblancogames.itch.io/pollinate-the-garden

Thanks to Frank Poth for some great tutorials on game loops in javascript, and @lewy_blue for writing some great threejs materials.