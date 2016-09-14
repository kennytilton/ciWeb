# ciWeb
A pure JS web application framework thinly wrapping HTML and CSS, with Cells Inside(tm).

Cells Inside(tm) is actually just [jCells](https://github.com/kennytilton/jCells). jCells is databinding on steroids, transparent unto the magical. This deprecated repo has [the best intro](https://github.com/kennytilton/its-alive), I think. (Do not worry, the syntax is more magical in JS than CLJS thanks to JS property getters and setters.)

ciWeb, again, involves nothing but HTML and CSS. And jCells, but that is no harder to learn than VisiCalc. Look it up. I have done this before in MCL, Windows GDK, Tcl/Tk, OpenGL, qooxdoo and qooxdoo mobile so it should go -- er, has gone -- well, especially since the HTML and CSS will be your problem. I mean that in a good way.

ciWeb is different from most frameworks: it works inside out instead of outside in.

With other frameworks one effectively must learn a new computer language. One also ends up with a tool chain to convert the outer framework source into runnable HTML/JS. And, in the case of ReactJs, it also means learning JSX. And because ReactJS makes information so hard to share, one ends up adding Flux to manage state. But Flux itself gets crazy with multiple stores, so enter Redux, another language to master.

You just wanted to put up a web page, right?

With ciWeb we simply have a runtime JS library that looks and works like HTML (and CSS is unchanged). Inside we have the jCells dataflow driving conventional HTML, CSS, and AJAX (HCA) which methinks will turn out to be fine tools once harnassed transparently enough that we think we are just doing HCA while successfully building a web app. 

That paragraph needs work. What I mean is, yeah, HTML is a PITA when coded by hand, but wrap it thinly in JS objects which map isomorphically onto HTML tags and throw in transparent dataflow and Shazzam! More power for a tenth the effort than outside-in contorted frameworks.

Nice bonus with ciWeb: graphic designers likely will be able to program it themselves. (It will be easier than CSS.) I like the idea of kids in school learning programming this way*, too.

* But a deep dive will be needed (by moiself or a contributor) on CSS to help non-designers have fun with ciWeb. 

Next up might be ciQx with my old friend [qooxdoo](http://www.qooxdoo.org/), a superb JS library. Check out my qooxlisp and [Qxia](https://github.com/kennytilton/qxia/wiki) repos to see how Cells can eliminate a lot of the coding qooxdoo requires.

ciWeb is now past "proof of concept" and ready for elaboration, with a bit of AJAX back to the server I think.

Stand back, Buenos Aires!

