window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("patternCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = "yellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  const svgPath =
    "M11.262 1.153c.196-.098.461-.153.738-.153s.542.055.738.153c1.917.958 7.039 3.52 8.956 4.478.196.098.306.231.306.369s-.11.271-.306.369c-1.917.958-7.039 3.52-8.956 4.478-.196.098-.461.153-.738.153s-.542-.055-.738-.153c-1.917-.958-7.039-3.52-8.956-4.478-.196-.098-.306-.231-.306-.369s.11-.271.306-.369c1.917-.958 7.039-3.52 8.956-4.478z";
  const svgViewBox = { x: 2, y: 1, width: 20, height: 10 };

  const rowHeight = 60;
  const imageSpacing = 10;

  // Simplified: box dimensions based on desired row height
  const boxWidth = 120; // svgViewBox.width * 6 (scale factor)
  const boxHeight = rowHeight;

  const y = canvas.height - boxHeight;

  const drawRhombox = (x, y, row, color = "black") => {
    const scale = 6 - (row - 1) * 0.15; // Scale decreases by 0.2 for each higher row
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-svgViewBox.x, -svgViewBox.y);
    ctx.beginPath();
    const path = new Path2D(svgPath);
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.restore();
  };

  const getRowPositions = (centerOffset = 0) => {
    const centerX = canvas.width / 2 + centerOffset;
    let positions = [centerX - boxWidth / 2];
    let step = 1;
    while (true) {
      let drew = false;
      let xRight = centerX - boxWidth / 2 + step * (boxWidth + imageSpacing);
      if (xRight < canvas.width) {
        positions.push(xRight);
        drew = true;
      }
      let xLeft = centerX - boxWidth / 2 - step * (boxWidth + imageSpacing);
      if (xLeft + boxWidth > 0) {
        positions.push(xLeft);
        drew = true;
      }
      if (!drew) break;
      step++;
    }
    return positions;
  };

  //   const overlap = boxWidth / 2;
  //   const verticalDrop = boxHeight * 0.25;

  const overlap = 60;
  const verticalDrop = boxHeight * 0.4;

  const numRows = 9; // Configurable number of rows

  // Shape visibility / color configuration: multidimensional array
  // Each row is an array of numbers per shape position:
  //   0 = don't draw
  //   1 = draw (black)
  //   2 = draw (red)
  //   3 = draw (blue)
  // If a row array is shorter than available positions, remaining shapes default to drawn (black)
  const shapeConfigs = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 1
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 2
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 3
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 4
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 5
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 6
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 7
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 8
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Row 9
  ];

  // Generate all rows
  let currentY = y + overlap - verticalDrop; // Start with row 1
  for (let row = 1; row <= numRows; row++) {
    // Odd rows (1,3,5,7,9) get offset, even rows (2,4,6,8) get centered
    const centerOffset = row % 2 === 1 ? (boxWidth + imageSpacing) / 2 : 0;
    const positions = getRowPositions(centerOffset);
    // Ensure positions are ordered left-to-right so shapeConfigs map correctly
    positions.sort((a, b) => a - b);
    const rowConfig = shapeConfigs[row - 1] || []; // Get config for this row

    // Draw shapes based on configuration
    for (let i = 0; i < positions.length; i++) {
      const configValue = rowConfig[i] ?? 1; // Default to 1 if not specified

      if (configValue === 0) continue; // Skip drawing

      let color = "black";
      if (configValue === 2) color = "red";
      else if (configValue === 3) color = "blue";
      drawRhombox(positions[i], currentY, row, color);
    }

    // Calculate next row's Y position (except for the last row)
    if (row < numRows) {
      currentY = currentY - overlap + verticalDrop;
    }
  }
});
