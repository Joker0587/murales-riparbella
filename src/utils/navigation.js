export function navGoogle(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function navApple(lat, lng) {
  return `https://maps.apple.com/?daddr=${lat},${lng}`;
}

export const placeMapUrl = (place) => place.mapsUrl || navGoogle(place.lat, place.lng);

export function embedMapUrl(lat, lng) {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.004}%2C${lat - 0.003}%2C${lng + 0.004}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function phoneLabel(phone) {
  return phone.replace('+39', '+39 ');
}
