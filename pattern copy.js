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

  const drawRhombox = (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(6, 6); // Hardcoded scale factor (rowHeight / svgViewBox.height)
    ctx.translate(-svgViewBox.x, -svgViewBox.y);
    ctx.beginPath();
    const path = new Path2D(svgPath);
    ctx.fillStyle = "black";
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

  // Row 1 (lowest)
  const y1 = y + overlap - verticalDrop;
  const positions1 = getRowPositions((boxWidth + imageSpacing) / 2);
  for (const x of positions1) {
    drawRhombox(x, y1);
  }

  // Row 2
  const positions2 = getRowPositions(0);
  for (const x of positions2) {
    drawRhombox(x, y);
  }

  // Row 3
  const y3 = y - overlap + verticalDrop;
  const positions3 = getRowPositions((boxWidth + imageSpacing) / 2);
  for (const x of positions3) {
    drawRhombox(x, y3);
  }

  // Row 4
  const y4 = y3 - overlap + verticalDrop;
  const positions4 = getRowPositions(0);
  for (const x of positions4) {
    drawRhombox(x, y4);
  }

  // Row 5
  const y5 = y4 - overlap + verticalDrop;
  const positions5 = getRowPositions((boxWidth + imageSpacing) / 2);
  for (const x of positions5) {
    drawRhombox(x, y5);
  }

  // Row 6
  const y6 = y5 - overlap + verticalDrop;
  const positions6 = getRowPositions(0);
  for (const x of positions6) {
    drawRhombox(x, y6);
  }

  // Row 7
  const y7 = y6 - overlap + verticalDrop;
  const positions7 = getRowPositions((boxWidth + imageSpacing) / 2);
  for (const x of positions7) {
    drawRhombox(x, y7);
  }

  // Row 8
  const y8 = y7 - overlap + verticalDrop;
  const positions8 = getRowPositions(0);
  for (const x of positions8) {
    drawRhombox(x, y8);
  }

  // Row 9
  const y9 = y8 - overlap + verticalDrop;
  const positions9 = getRowPositions((boxWidth + imageSpacing) / 2);
  for (const x of positions9) {
    drawRhombox(x, y9);
  }
});
