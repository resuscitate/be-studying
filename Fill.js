/**
 * Fill.js - Bilinear interpolation for grid data rendering
 * 
 * This module provides bilinear interpolation functionality for grid-based data,
 * specifically designed to handle small-sized grids like 2x2 without boundary issues.
 * 
 * Key fixes implemented:
 * - Proper sampling point calculation for bilinear interpolation
 * - Boundary clamping to ensure coordinates stay within [0,1] range
 * - Correct handling of edge cases for small textures
 * - Geographic coordinate conversion support
 * 
 * @author resuscitate
 * @version 1.0.0
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
   * 
   * This function performs bilinear interpolation to get a smooth value
   * at any point within the grid. The coordinates are normalized to [0,1].
   * 
   * @param {number} u - Horizontal coordinate in range [0,1]
   * @param {number} v - Vertical coordinate in range [0,1]
   * @returns {number} Interpolated value
   * 
   * Algorithm:
   * 1. Clamp u,v to [0,1] to prevent out-of-bounds access
   * 2. Convert to grid coordinates: x = u*(width-1), y = v*(height-1)
   * 3. Get integer bounds: x0,y0 = floor(x,y), x1,y1 = x0+1,y0+1
   * 4. Clamp x1,y1 to stay within array bounds
   * 5. Sample four corner values: tl, tr, bl, br
   * 6. Perform bilinear interpolation: interpolate top/bottom, then vertically
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
   * 
   * Converts geographic coordinates to normalized texture coordinates
   * and performs bilinear interpolation.
   * 
   * @param {number} lon - Longitude in degrees
   * @param {number} lat - Latitude in degrees
   * @returns {number} Interpolated value at the geographic location
   */
  getValueAtCoord(lon, lat) {
    // Convert geographic coordinates to normalized texture coordinates
    const u = (lon - this.lonMin) / (this.lonMax - this.lonMin);
    const v = (lat - this.latMin) / (this.latMax - this.latMin);
    
    return this.getValue(u, v);
  }

  /**
   * Get raw value at grid indices (for testing and debugging)
   * 
   * @param {number} x - Column index (0 to width-1)
   * @param {number} y - Row index (0 to height-1)
   * @returns {number|null} Raw grid value or null if out of bounds
   */
  getRawValue(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.value[y][x];
  }
}

module.exports = Fill;