# IIIF Viewer Matrix
A simple implementation of the IIIF Image 2.0 specification. 


## Pipeline
A using application provides the `TileSourceProvider` with an image service
and some configuration (tileSize, width, height of viewport).

The `TileSourceProvider` will then load and parse the image service, and based
on the tile size and viewport, generate a matrix that represents the whole IIIF
image and all of the tiles (scaled up to the size of the original image). This
is the `Tile Matrix`.

This matrix for 6 tiles in a 2x3 looks something like this:
```
const tileMatrix = [
  [[0, 0, 256, 256], [0, 256, 256, 211]],
  [[256, 0, 256, 256], [256, 256, 256, 211]],
  [[512, 0, 113, 256], [512, 256, 113, 211]],
];
```
The 3rd level is `[x, y, width, height]`, from this you can generate
a tile source request to get the image. But this does not help presentation.

The next step of the pipe is to create a canvas representation of these units,
basically scaling them up by how much they have been scaled down. This is the `Canvas Matrix`.

For the above example, the following is produced:
```
const canvasMatrix = [
  [[0, 0, 1024, 1024], [0, 1024, 1024, 844]],
  [[1024, 0, 1024, 1024], [1024, 1024, 1024, 844]],
  [[2048, 0, 452, 1024], [2048, 1024, 452, 844]],
];
```
all of the units are now canvas relative, so within a canvas representation, we can render the
previous matrix (of the same keys) to these points on the canvas.

The final step is the presentation. Its unlikely that whatever we are using to render will present
this data to the end-user at the canvas scale, it must fit the bounds of whatever viewer is build
upon it. This is the `Display matrix`. Currently this takes in a display width, and uses that to create a 
fixed width "render-able" set of boxes.

Our example above, rendered at a constrained width of 650px comes out as:
```
const displayMatrix = [
  [[0, 0, 266.24, 266.24], [0, 266.24, 266.24, 219.44]],
  [[266.24, 0, 266.24, 266.24], [266.24, 266.24, 266.24, 219.44]],
  [[532.48, 0, 117.52, 266.24], [532.48, 266.24, 117.52, 219.44]],
]
```

This matrix is what is used to then render the final result. The nice thing about this approach is
you can do fast operations on this matrix to transform the presentation of the images. For example
adding a scale function that will simply multiply all of the values by a number will zoom in and out.
Adding a map that will change the `x` component of the inner array will act as a translate, allowing you
to move along the `x` axis. These basic functions are implemented and passed down as part of the user
transforms step (just compose your transforms with your `displayMatrix`)

This is roughly the pipeline: 
```
config         Image service
  +                  +
  |                  |
  |                  +
  +----------> TileSourceProvider
                     +
                     |
                     v
                 Tile Matrix
                     +
                     |
            +--------+--------+
            |                 |
            v                 v
       Display matrix    Canvas matrix
            +                 +
            |                 |
            v                 |
       User transforms        |
            +                 |
            |                 |
       +----v------------------------+
       | render container     |      |
       +----------------------v------+
       |                render image |
       +-----------------------------+
```

### Road map
* Filter out tiles that are not visible from the display matrix
* Automatically change the `tileScale` based on the zoom
* Add example of canvas render target
* Add example of WebGL render target
* Add skew/rotate transforms (with CSS adapter for base demo)
* Add dragging and scroll interactions on demo-site