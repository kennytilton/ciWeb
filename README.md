# ciWeb
Welcome to ciWeb, a lightweight but powerful JS web development framework with Cells Inside(tm). Hence the "ci".

[Cells](https://github.com/kennytilton/cells) is a mature, largely transparent databinding library that began in 1996 as a Common Lisp library and has since been ported to Clojure/ClojureScript as [Rube](https://github.com/kennytilton/rube) and now Javascript as [jCells](https://github.com/kennytilton/jCells). It has been used to drive application development frameworks wrapping Macintosh [QuickDraw](https://en.wikipedia.org/wiki/QuickDraw), Windows GDT, Tcl/Tk as [Celtk](https://github.com/kennytilton/celtk), OpenGL (you read that correctly) as [Cello](https://github.com/kennytilton/Cello), Gtk as [Cells-Gtk](https://github.com/Ramarren/cells-gtk3), qooxdoo as [qooxlisp](https://github.com/kennytilton/qooxlisp), and qooxdoo mobile as [Qxia](https://github.com/kennytilton/qxia).

ciWeb will involve nothing but HTML thinly wrapped, CSS and jCells. Then we do ciGoog to wrap Goodle Closure and ciQx to wrap qooxdoo on the client side (qooxlisp drove qooxdoo from the server). Not necessarily in that order.

## Getting Acquainted
Before we dig into the magic of Cells and the nitty-gritty of ciWeb, the reader might want to just follow along as I evolve a trivial bit of web work. After that we will get acquainted with Cells. They might make more sense after you have seen how they are applied.

### Step 1 - Launching the demo
Navigate to ciWeb/js/Sources/public and open index.html in your browser. n.b, It does not do anything interesting yet. Make sure I left the body as this in my last commit:
````
<body>
    <h1>Script failed to load.</h1>
    <p>Please check the console for diagnostics.</p>
    <script>hilitedError_0();</script>
</body>
````
That should bring up a mildly functional:

![hilitedError_0 pageshot](https://github.com/kennytilton/ciWeb/blob/master/public/image/hilitedError_0.png)
#### To be continued (steadily on 19-September-2016)


