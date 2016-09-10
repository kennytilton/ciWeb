# jWeb
A pure JS web application framework thinly wrapping HTML and CSS, with Cells for JS Inside(tm).

Cells for JS(tm) is actually just [jCells](https://github.com/kennytilton/jCells). jCells is databinding on steroids, transparent unto the magical. This deprecated repo has [the best intro](https://github.com/kennytilton/its-alive), I think. (Do not worry, the syntax is more magical in JS than CLJS thanks to getters and setters.)

jWeb, again, involves nothing but HTML and CSS. And jCells, but that is no harder to learn than VisiCalc. (Look it up.) I have done this before in MCL, Windows GDK, Tcl/Tk, OpenGL, qooxdoo and qooxdoo mobile so it should go well, especially since the HTML and CSS will be your problem. I mean that in a good way.

jWeb will be different from most frameworks: it works inside out instead of outside in.

With other frameworks one effectively must learn a new computer language. One also ends up with a tool chain to convert the outer framework source into runnable HTML/JS. And, in the case of ReactJs, one ends up adding Flux to manage state. 

With jWeb we will simply have a runtime JS library that looks and works exactly like HTML and CSS. We can just turn the designer loose. Inside will be the jCells dataflow driving conventional HTML, CSS, and AJAX (HCA) which methinks will turn out to be fine tools once harnassed transparently enough that we think we are just doing HCA while successfully building a web app. 

That paragraph needs work. What I mean is, yeah, HTML is a PITA when coded by hand, but wrap it thinly in JS objects which map isomorphically onto HTML tags and throw in transparent dataflow and Shazam! More power for a tenth the effort than outside-in contorted frameworks.

Nice bonus with jWeb, already suggested above: graphic designers will be able to program it themselves. (It will be easier than CSS.) I like the idea of kids in school learning programming this way*, too.

* Methinks a deep dive will be needed (by moiself or a contributor) on CSS to help non-designers have fun with jWeb. 

Then I might do jQx with my old friend [qooxdoo](http://www.qooxdoo.org/), a superb JS library. Check out my qooxlisp and [Qxia](https://github.com/kennytilton/qxia/wiki) repos to see how Cells can eliminate a lot of the coding qooxdoo requires.

Stand back, Buenos Aires!

