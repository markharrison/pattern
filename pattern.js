// Scaling step per row (used for both drawing and layout)
const SCALE_STEP = 0.1;
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("patternCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
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

  const drawRhombox = (centerX, centerY, row, color = "black") => {
    const scale = 6 - (row - 1) * SCALE_STEP;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(
      -svgViewBox.x - svgViewBox.width / 2,
      -svgViewBox.y - svgViewBox.height / 2
    );
    ctx.beginPath();
    const path = new Path2D(svgPath);
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.restore();
  };

  // Returns center positions for each shape in a row
  const getRowPositions = (centerOffset = 0) => {
    const rowCenter = canvas.width / 2 + centerOffset;
    let positions = [rowCenter];
    let step = 1;
    while (true) {
      let drew = false;
      let right = rowCenter + step * (boxWidth + imageSpacing);
      if (right - boxWidth / 2 < canvas.width) {
        positions.push(right);
        drew = true;
      }
      let left = rowCenter - step * (boxWidth + imageSpacing);
      if (left + boxWidth / 2 > 0) {
        positions.push(left);
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

  const numRows = 11; // Configurable number of rows

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
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1], // Row 8
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1], // Row 9
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // Row 10
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // Row 11
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
      // Calculate scale for this row (must match drawRhombox)
      const scale = 6 - (row - 1) * SCALE_STEP;
      // Center Y for this row, accounting for scale
      const centerY = currentY + (svgViewBox.height * scale) / 2;
      drawRhombox(positions[i], centerY, row, color);
    }

    // Calculate next row's Y position (except for the last row)
    if (row < numRows) {
      currentY = currentY - overlap + verticalDrop;
    }
  }

  // Simple export: download the canvas as PNG
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "pattern.png";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      } else {
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "pattern.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    });
  }
});
