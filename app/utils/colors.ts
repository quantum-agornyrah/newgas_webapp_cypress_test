export function getRandomLightColors(numColors:any) {
    const colors = [];
    const min = 180;
  
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * (255 - min) + min);
      const g = Math.floor(Math.random() * (255 - min) + min);
      const b = Math.floor(Math.random() * (255 - min) + min);
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
  
    return colors;
  }