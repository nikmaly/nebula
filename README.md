# Nebula
A pretty pseudo-interactive background that if you want to use you should definitely rewrite because it's frankly ancient code.

Be mindful of the performance impact, especially on mobile devices!

Example implementation: http://nik.malyaris.com/projects/nebula

# Options

Options denoted with a * indicate they impact performance.

Options denoted with a ** indicate a significant performance impact.

|Option|Description|Code|
|-|-|-|
|Canvas Size X**|The size of the canvas width in pixels.|Calculated from the width of the parent container.|
|Canvas Size Y**|The size of the canvas height in pixels.|NEBULA.height = +(int)|
|Nebula Size**|The number of points in the nebula cloud.|NEBULA.size = +(int)
|Nebula Buffer*|The unrendered but 'active' zone outside the visible area of the canvas (links to balls rendered).| NEBULA.buffer = +(int)|
|Point Size|The size of the point circles (or balls, or whatever you want to call them).|NEBULA.BALLS.ballRadius = +(float)|
|Point Color|The color of the points in RGB.|NEBULA.BALLS.ballColor = ({r, g, b})|
|Point Min Velocity*|The minimum velocity of the ball - zero is stationery, so yes negative is valid (and for minimum, it should be because that allows left and upwards motion).|NEBULA.BALLS.minVelocity = (int)|
|Point Min Velocity*|As above, but a maximum and should be positive but doesn't have to be. I suggest mirroring these across zero (e.g. -1 and 1, the defaults).|NEBULA.BALLS.maxVelocity = (int)|
|Link Color|The color of the points in RGB.|NEBULA.BALLS.ballColor = ({r, g, b})|
|Link Width|The thickness of the joining links between the points.|NEBULA.LINKS.linkWidth = +(float)|
|Link Cutoff Distance*|The distance at which links between balls will break, and will affect the brightness of the links which is a linear value along the max distance.|NEBULA.LINKS.linkMaxDistance = +(int)|
