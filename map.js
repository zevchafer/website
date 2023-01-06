// Get the map container and image
const mapContainer = document.querySelector('.map-container');
const mapImage = document.querySelector('.map-image');

// Initialize the map position and zoom level
let mapX = 0;
let mapY = 0;
let mapZoom = 1;

// Update the map position and zoom
function updateMap() {
  mapImage.style.transform = `translate(${mapX}px, ${mapY}px) scale(${mapZoom})`;
}

// Pan the map by a given amount
function panMap(dx, dy) {
  mapX += dx;
  mapY += dy;
  updateMap();
}

// Zoom the map in or out
function zoomMap(dz) {
  mapZoom *= dz;
  updateMap();
}

// Handle mouse wheel events to zoom the map
mapContainer.addEventListener('wheel', event => {
  // Calculate the zoom factor
  const delta = event.deltaY * 0.001;
  const zoomFactor = 1 + delta;

  // Calculate the mouse position relative to the map image
  const rect = mapImage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Calculate the new map position and zoom level
  const newMapX = mapX - x * delta / mapZoom;
  const newMapY = mapY - y * delta / mapZoom;
  const newMapZoom = mapZoom * zoomFactor;

  // Update the map position and zoom level
  mapX = newMapX;
  mapY = newMapY;
  mapZoom = newMapZoom;
  updateMap();
});

// Handle mouse drag events to pan the map
let isDragging = false;
let dragStartX;
let dragStartY;

mapContainer.addEventListener('mousedown', event => {
  // Start dragging
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
});

mapContainer.addEventListener('mouseup', event => {
  // Stop dragging
  isDragging = false;
});

mapContainer.addEventListener('mousemove', event => {
  // Pan the map
  if (isDragging) {
    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    panMap(dx, dy);
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  }
});

// Handle touch events to pan and zoom the map
let touchStartX;
let touchStartY;
let touchStartDistance;
let touchStartScale;

mapContainer.addEventListener('touchstart', event => {
  // Store the initial touch positions and distance
  const touch1 = event.touches[0];
  const touch2 = event.touches[1];
  touchStartX = (touch1.clientX + touch2.clientX) / 2;
  touchStartY = (touch1.clientY + touch2.clientY) / 2;
  touchStartDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
  touchStartScale = mapZoom;
});

mapContainer.addEventListener('touchmove', event => {
  // Calculate the touch positions and distance
  const touch1 = event.touches[0];
  const touch2 = event.touches[1];
  const x = (touch1.clientX + touch2.clientX) / 2;
  const y = (touch1.clientY + touch2.clientY) / 2;
  const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

  // Calculate the change in position and distance
  const dx = x - touchStartX;
  const dy = y - touchStartY;
  const dd = distance - touchStartDistance;

  // Calculate the new map position and zoom level
  const zoomFactor = 1 + dd / touchStartDistance;
  const newMapX = mapX - dx / mapZoom;
  const newMapY = mapY - dy / mapZoom;
  const newMapZoom = touchStartScale * zoomFactor;

  // Update the map position and zoom level
  mapX = newMapX;
  mapY = newMapY;
  mapZoom = newMapZoom;
  updateMap();
});
