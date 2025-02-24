
// Map style to set the background to white
export const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#faf5f5", // Light grey background for a clean and bright look
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off", // Hide icons for a cleaner appearance
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8e8e8e", // Soft grey for text, subtle but legible
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5", // Light stroke behind text to ensure readability without distraction
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#a0a0a0", // Lighter grey for POI labels to keep it unobtrusive
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#dcdcdc", // Very light grey for general roads
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffccbc", // Light coral for arterial roads to add a soft touch of color
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffe0b2", // Very light peachy color for highways to keep the map soft
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff", // Clean white for local roads to blend well with the background
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#b3e5fc", // Soft light blue for water areas, clean and subtle
      },
    ],
  },
  {
    elementType: "labels.text",
    stylers: [
      {
        visibility: "simplified", // Simplified labels to reduce visual clutter
      },
    ],
  },
];
