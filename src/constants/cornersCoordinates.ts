import { planeHeight, planeWidth } from "./floor";

// Geographical coordinates for reference points in Paris
export const cornersGeoCoordinates = [
  { lng: 2.396332, lat: 48.849798 }, // top left (North of Nation)
  { lng: 2.344124, lat: 48.823385 }, // top right (East of Parc Montsouris)
  { lng: 2.350889, lat: 48.889825 }, // bottom left (South of Marcadet-Poissonniers)
  { lng: 2.297633, lat: 48.863609 }, // bottom right (Palais de Tokyo)
];

// Local coordinates in the Three.js scene
// Important: For the floor plane, the y-coordinate (height) is fixed, and we use x and z
// Note: In Three.js, with the floor rotated to be horizontal, y is height and z is depth
export const cornersLocalCoordinates = [
  { x: -planeWidth / 2, y: -planeHeight / 2 }, // top-left (in plane coordinates - in 3D this is x:-w/2, z:-h/2)
  { x: planeWidth / 2, y: -planeHeight / 2 },  // top-right (in plane coordinates - in 3D this is x:w/2, z:-h/2)
  { x: -planeWidth / 2, y: planeHeight / 2 },  // bottom-left (in plane coordinates - in 3D this is x:-w/2, z:h/2)
  { x: planeWidth / 2, y: planeHeight / 2 },   // bottom-right (in plane coordinates - in 3D this is x:w/2, z:h/2)
];
