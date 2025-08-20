/**
 * Fill.js - Bilinear interpolation for grid data rendering
 * Handles small-sized grid data like 2x2 with proper boundary checking
 */

class Fill {
  constructor(data) {
    this.latMax = data.latMax;
    this.latMin = data.latMin;
    this.lonMax = data.lonMax;
    this.lonMin = data.lonMin;
    this.projectionType = data.projectionType;
    this.resolution = data.resolution;
    this.time = data.time;
    this.value = data.value;
    
    // Calculate grid dimensions
    this.height = this.value.length;
    this.width = this.value[0] ? this.value[0].length : 0;
  }

  /**
   * Get interpolated value at normalized coordinates (u, v)
   * u, v should be in range [0, 1]
   * Returns interpolated value using bilinear interpolation
   */
  getValue(u, v) {
    // Ensure u, v are clamped to [0, 1]
    u = Math.max(0, Math.min(1, u));
    v = Math.max(0, Math.min(1, v));
    
    // Convert normalized coordinates to grid coordinates
    // For a grid of size width x height, the actual indices go from 0 to width-1, 0 to height-1
    const x = u * (this.width - 1);
    const y = v * (this.height - 1);
    
    // Get integer coordinates for the four corners
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = Math.min(x0 + 1, this.width - 1);
    const y1 = Math.min(y0 + 1, this.height - 1);
    
    // Get fractional parts for interpolation
    const fx = x - x0;
    const fy = y - y0;
    
    // Sample the four corner values
    const tl = this.value[y0][x0]; // top-left
    const tr = this.value[y0][x1]; // top-right
    const bl = this.value[y1][x0]; // bottom-left
    const br = this.value[y1][x1]; // bottom-right
    
    // Perform bilinear interpolation
    const top = tl * (1 - fx) + tr * fx;
    const bottom = bl * (1 - fx) + br * fx;
    const result = top * (1 - fy) + bottom * fy;
    
    return result;
  }

  /**
   * Get value at specific geographic coordinates (longitude, latitude)
   */
  getValueAtCoord(lon, lat) {
    // Convert geographic coordinates to normalized texture coordinates
    const u = (lon - this.lonMin) / (this.lonMax - this.lonMin);
    const v = (lat - this.latMin) / (this.latMax - this.latMin);
    
    return this.getValue(u, v);
  }

  /**
   * Get raw value at grid indices (for testing)
   */
  getRawValue(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.value[y][x];
  }
}

module.exports = Fill;