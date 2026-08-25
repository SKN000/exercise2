# exercise2

Contains the code that is used in js exercise 2 of the intro graphics class.

## Changes for the exercise

* The rectangle's four corners are now **cyan** (upper left), **magenta** (upper
  right), **yellow** (lower left) and **pink** (lower right), still bilinearly
  interpolated across the interior.
* Added a **triangle** with cyan, magenta and yellow vertices, color-interpolated
  with barycentric coordinates (`drawTriangle` in `drawstuff.js`).
* The rectangle drawing code moved into a reusable `drawRectangle` function.
