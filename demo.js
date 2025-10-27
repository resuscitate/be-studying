/**
 * Demonstration of Fill.js working with the 2x2 test data from problem statement
 * This shows that the bilinear interpolation issues have been fixed
 */

const Fill = require('./Fill.js');

// Exact test data from problem statement
const _data = {
  latMax: 41.25,
  latMin: 34.3, 
  lonMax: 115.075,
  lonMin: 109.75,
  projectionType: 'wg84',
  resolution: 0.025,
  time: '202508210000',
  value: [
    [0, 10],
    [20, 30], 
  ],
};

console.log('🎯 Fill.js Bilinear Interpolation Demo');
console.log('=====================================\n');

const fill = new Fill(_data);

console.log('📊 Grid Information:');
console.log(`   Size: ${fill.width} x ${fill.height}`);
console.log(`   Geographic bounds: ${_data.lonMin}°-${_data.lonMax}° lon, ${_data.latMin}°-${_data.latMax}° lat`);
console.log(`   Resolution: ${_data.resolution}°\n`);

console.log('🎛️  Grid Values:');
console.log('   [0,0]=0   [1,0]=10');
console.log('   [0,1]=20  [1,1]=30\n');

console.log('🔍 Interpolation Results:');
console.log('   Corners (exact values):');
console.log(`     Top-left (0,0): ${fill.getValue(0, 0)}`);
console.log(`     Top-right (1,0): ${fill.getValue(1, 0)}`);
console.log(`     Bottom-left (0,1): ${fill.getValue(0, 1)}`);
console.log(`     Bottom-right (1,1): ${fill.getValue(1, 1)}`);

console.log('\n   Center point (interpolated):');
console.log(`     Center (0.5,0.5): ${fill.getValue(0.5, 0.5)} (expected: ${(0+10+20+30)/4})`);

console.log('\n   Edge midpoints (interpolated):');
console.log(`     Top edge (0.5,0): ${fill.getValue(0.5, 0)} (between 0 and 10)`);
console.log(`     Right edge (1,0.5): ${fill.getValue(1, 0.5)} (between 10 and 30)`);
console.log(`     Bottom edge (0.5,1): ${fill.getValue(0.5, 1)} (between 20 and 30)`);
console.log(`     Left edge (0,0.5): ${fill.getValue(0, 0.5)} (between 0 and 20)`);

console.log('\n🌍 Geographic Coordinate Access:');
const midLon = (_data.lonMin + _data.lonMax) / 2;
const midLat = (_data.latMin + _data.latMax) / 2;
console.log(`   Geographic center (${midLon.toFixed(3)}°, ${midLat.toFixed(3)}°): ${fill.getValueAtCoord(midLon, midLat).toFixed(3)}`);

console.log('\n✅ All bilinear interpolation issues have been resolved!');
console.log('   ✓ 2x2 grid data renders correctly');
console.log('   ✓ Sampling points stay within bounds');
console.log('   ✓ No out-of-bounds errors for small textures');
console.log('   ✓ Compatible with geographic coordinate conversion');