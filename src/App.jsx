

import { useState, useMemo } from 'react';
import logo from './logo.svg';
import './App.css';

// --- Color Utility Functions (Translated from Python) ---

/**
 * Converts a hex color string (e.g., "#FFFFFF") to an RGB array (e.g., [255, 255, 255]).
 * @param {string} hex - The hex color string, including the '#' prefix.
 * @returns {number[]} An array containing the R, G, and B components.
 */
const hex_to_RGB = (hex) => {
  // Remove the '#' prefix and parse two characters at a time as hexadecimal
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

/**
 * Converts an RGB array (e.g., [255, 255, 255]) to a hex color string (e.g., "#FFFFFF").
 * @param {number[]} RGB - An array containing the R, G, and B components.
 * @returns {string} The hex color string, including the '#' prefix.
 */
const RGB_to_hex = (RGB) => {
  // Ensure components are integers and convert to hex, padding with '0' if single digit
  const [r, g, b] = RGB.map(v => Math.round(v)); // Round to nearest integer
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
};

/**
 * Takes a list of RGB sub-lists and returns a dictionary of colors
 * in RGB and hex form.
 * @param {number[][]} gradient - A list of RGB color arrays.
 * @returns {{hex: string[], r: number[], g: number[], b: number[]}} A dictionary with hex, r, g, and b arrays.
 */
const color_dict = (gradient) => {
  return {
    hex: gradient.map(RGB => RGB_to_hex(RGB)),
    r: gradient.map(RGB => RGB[0]),
    g: gradient.map(RGB => RGB[1]),
    b: gradient.map(RGB => RGB[2]),
  };
};

/**
 * Generates a gradient list of (n) colors between two hex colors.
 * @param {string} start_hex - The starting hex color string (e.g., "#4682B4").
 * @param {string} [finish_hex="#FFFFFF"] - The ending hex color string (e.g., "#FFB347").
 * @param {number} [n=10] - The number of steps/colors in the gradient.
 * @returns {{hex: string[], r: number[], g: number[], b: number[]}} A dictionary of gradient colors.
 */
const linear_gradient = (start_hex, finish_hex = "#FFFFFF", n = 10) => {
  // Starting and ending colors in RGB form
  const s = hex_to_RGB(start_hex);
  const f = hex_to_RGB(finish_hex);
  // Initialize a list of the output colors with the starting color
  const RGB_list = [s];

  // Calculate a color at each evenly spaced value of t from 1 to n-1
  for (let t = 1; t < n; t++) {
    // Interpolate RGB vector for color at the current value of t
    const curr_vector = [
      Math.floor(s[0] + (t / (n - 1)) * (f[0] - s[0])),
      Math.floor(s[1] + (t / (n - 1)) * (f[1] - s[1])),
      Math.floor(s[2] + (t / (n - 1)) * (f[2] - s[2])),
    ];
    // Add it to our list of output colors
    RGB_list.push(curr_vector);
  }

  return color_dict(RGB_list);
};
// Define los datos de los materiales con sus valores asociados
const materialData = [
  { name: 'Hierro', value: 26.3 },
  { name: 'Agua', value: 75.4 },
  { name: 'Aluminio', value: 24.6 },
  { name: 'Cobre', value: 24.8 },
];

const App = () => {

  // Define start, end colors and number of steps for the gradient
  const START_COLOR = "#4682B4"; // SteelBlue
  const END_COLOR = "#FFB347";   // Light Orange
  const NUM_STEPS = 255;         // Corresponds to your Python 'colores' length

  // Use useMemo to calculate the gradient colors only once, or when dependencies change.
  // In this case, dependencies are fixed, so it acts like a one-time calculation.
  const gradientColors = useMemo(() => {
    return linear_gradient(START_COLOR, END_COLOR, NUM_STEPS);
  }, [START_COLOR, END_COLOR, NUM_STEPS]); // Dependencies are fixed constants

  // State for the slider value, which will be an index into our gradientColors array
  // Initialize to 0 (the first color in the gradient)
  const [gradientIndex1, setGradientIndex1] = useState(0);
  const [gradientIndex2, setGradientIndex2] = useState(0);
  const [sizeIndex1, setSizeIndex1] = useState(100);
  const [sizeIndex2, setSizeIndex2] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMaterialName, setSelectedMaterialName] = useState(materialData[0].name);
  const [selectedMaterialValue, setSelectedMaterialValue] = useState(materialData[0].value);
  const [selectedMaterialName2, setSelectedMaterialName2] = useState(materialData[0].name);
  const [selectedMaterialValue2, setSelectedMaterialValue2] = useState(materialData[0].value);

  // Function to handle slider changes
  const handleSliderChange1 = (event) => {
    if (!isAnimating) { // Only allow changes if not animating
      setGradientIndex1(parseInt(event.target.value));
    }
  };
  const handleSliderChange2 = (event) => {
    if (!isAnimating) { // Only allow changes if not animating
      setGradientIndex2(parseInt(event.target.value));
    }
  };
  const handleSliderMass1 = (event) => {
    if (!isAnimating) { // Only allow changes if not animating
      setSizeIndex1(parseInt(event.target.value));
    }
  };
  const handleSliderMass2 = (event) => {
    if (!isAnimating) { // Only allow changes if not animating
      setSizeIndex2(parseInt(event.target.value));
    }
  };
    // Función para manejar los cambios del desplegable de material
  const handleMaterialChange = (event) => {
    if (!isAnimating) { // Deshabilita el desplegable durante la animación
      const selectedValue = parseFloat(event.target.value); // El valor del option es el numérico
      const material = materialData.find(m => m.value === selectedValue); // Encuentra el objeto material
      if (material) {
        setSelectedMaterialName(material.name); // Guarda el nombre para mostrar
        setSelectedMaterialValue(material.value); // Guarda el valor numérico
      }
      // Aquí podrías añadir lógica para actualizar otras propiedades
      // de los cuadrados basándose en el material seleccionado.
    }
  };
  const handleMaterialChange2 = (event) => {
    if (!isAnimating) { // Deshabilita el desplegable durante la animación
      const selectedValue = parseFloat(event.target.value); // El valor del option es el numérico
      const material = materialData.find(m => m.value === selectedValue); // Encuentra el objeto material
      if (material) {
        setSelectedMaterialName2(material.name); // Guarda el nombre para mostrar
        setSelectedMaterialValue2(material.value); // Guarda el valor numérico
      }
      // Aquí podrías añadir lógica para actualizar otras propiedades
      // de los cuadrados basándose en el material seleccionado.
    }
  };

    // Function to start the color transition animation
  const animateColors = async () => {
    if (isAnimating) { // Prevent multiple animations from running
      return;
    }

    setIsAnimating(true); // Disable GUI

    const initialGradientIndex1 = gradientIndex1;
    const initialGradientIndex2 = gradientIndex2;

    // Calculate equilibrium index (midpoint of the gradient range)
    // You can adjust this logic based on your Temperature_eq function
    const T_eq = Math.round((initialGradientIndex1*sizeIndex1*selectedMaterialValue + initialGradientIndex2*sizeIndex2*selectedMaterialValue2) / (sizeIndex1*selectedMaterialValue+sizeIndex2*selectedMaterialValue2)); //(T1*m1+T2*m2)/(m1+m2)

    // Calculate steps for the animation
    const steps = Math.max(
      Math.abs(initialGradientIndex1 - T_eq),
      Math.abs(initialGradientIndex2 - T_eq)
    );

    // If no steps are needed (already at equilibrium), just return
    if (steps === 0) {
        setIsAnimating(false);
        return;
    }

    const step_1_increment = (T_eq - initialGradientIndex1) / steps;
    const step_2_increment = (T_eq - initialGradientIndex2) / steps;

    for (let i = 1; i <= steps; i++) {
      // Calculate new indices for this step
      const newIndex1 = Math.round(initialGradientIndex1 + (i * step_1_increment));
      const newIndex2 = Math.round(initialGradientIndex2 + (i * step_2_increment));

      // Update state to trigger re-render and color change
      setGradientIndex1(newIndex1);
      setGradientIndex2(newIndex2);

      // Pause for a short duration (equivalent to time.sleep(0.05))
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsAnimating(false); // Re-enable GUI after animation
  };

  // Get the current color based on the slider's gradientIndex
  // Use the hex value directly for simplicity
  const currentHexColor1 = gradientColors.hex[gradientIndex1];
  const currentHexColor2 = gradientColors.hex[gradientIndex2];
  const currentSize1 = sizeIndex1;
  const currentSize2 = sizeIndex2;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* Your new square element */}
        <div className="squares-container max-w-md mx-auto relative flex items-center justify-center gap-4"
        style={{
          height: "210px", // Tamaño fijo del contenedor
        }}>
          <div
            className="w-24 h-24 rounded-lg shadow-md transition-colors duration-200 ease-in-out"
            style={{
              width: `${currentSize1}px`,
              height: `${currentSize1}px`,
              backgroundColor: currentHexColor1, // Dynamic color from gradient
            }}
          ></div>
          <div
            style={{
              width: `${currentSize2}px`,
              height: `${currentSize2}px`,
              backgroundColor: currentHexColor2, // Dynamic color from gradient
            }}
          ></div>
        </div>        
        {/* Slider to control the color transition */}
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <label htmlFor="colorSlider1" className="text-lg font-medium text-gray-700 mb-2">
            Temperature 1 [°C]: <span className="font-mono">{gradientIndex1}</span>
          </label>
          <input
            type="range"
            id="colorSlider1"
            min="0" // Slider min value corresponds to the first index of the gradient array
            max={NUM_STEPS - 1} // Slider max value corresponds to the last index of the gradient array
            value={gradientIndex1}
            onChange={handleSliderChange1}
            disabled={isAnimating} // Disable slider when animating
            className="w-full h-2 bg-gradient-to-r from-blue-500 to-orange-400 rounded-lg appearance-none cursor-pointer accent-blue-500"
            // The background gradient on the slider track itself is just for visual appeal
            // and does not affect the square's color, which is controlled by JS.
          />
        </div>
        {/* Slider to control the color transition 2*/}
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <label htmlFor="colorSlider2" className="text-lg font-medium text-gray-700 mb-2">
            Temperature 2 [°C]: <span className="font-mono">{gradientIndex2}</span>
          </label>
          <input
            type="range"
            id="colorSlider2"
            min="0" // Slider min value corresponds to the first index of the gradient array
            max={NUM_STEPS - 1} // Slider max value corresponds to the last index of the gradient array
            value={gradientIndex2}
            onChange={handleSliderChange2}
            disabled={isAnimating} // Disable slider when animating
            className="w-full h-2 bg-gradient-to-r from-blue-500 to-orange-400 rounded-lg appearance-none cursor-pointer accent-blue-500"
            // The background gradient on the slider track itself is just for visual appeal
            // and does not affect the square's color, which is controlled by JS.
          />
        </div>
                {/* Slider to control the size*/}
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <label htmlFor="sizeSlider1" className="text-lg font-medium text-gray-700 mb-2">
            Mass [g]: <span className="font-mono">{sizeIndex1}</span>
          </label>
          <input
            type="range"
            id="sizeSlider1"
            min="50" // Slider min value corresponds to the first index of the gradient array
            max="200" // Slider max value corresponds to the last index of the gradient array
            value={sizeIndex1}
            onChange={handleSliderMass1}
            disabled={isAnimating} // Disable slider when animating
            className="w-full h-2 bg-gradient-to-r from-blue-500 to-orange-400 rounded-lg appearance-none cursor-pointer accent-blue-500"
            // The background gradient on the slider track itself is just for visual appeal
            // and does not affect the square's color, which is controlled by JS.
          />
        </div>
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <label htmlFor="sizeSlider2" className="text-lg font-medium text-gray-700 mb-2">
            Mass [g]: <span className="font-mono">{sizeIndex2}</span>
          </label>
          <input
            type="range"
            id="sizeSlider2"
            min="50" // Slider min value corresponds to the first index of the gradient array
            max="200" // Slider max value corresponds to the last index of the gradient array
            value={sizeIndex2}
            onChange={handleSliderMass2}
            disabled={isAnimating} // Disable slider when animating
            className="w-full h-2 bg-gradient-to-r from-blue-500 to-orange-400 rounded-lg appearance-none cursor-pointer accent-blue-500"
            // The background gradient on the slider track itself is just for visual appeal
            // and does not affect the square's color, which is controlled by JS.
          />
        </div>
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <label htmlFor="materialSelect" className="text-lg font-medium text-gray-700 mb-2">
            Material 1: <span className="font-mono">{selectedMaterialName}</span> {/* Muestra el nombre */}
          </label>
          <select
            id="materialSelect"
            value={selectedMaterialValue} // El valor del select se vincula al valor numérico
            onChange={handleMaterialChange}
            disabled={isAnimating} // Deshabilita el desplegable durante la animación
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          >
            {/* Mapea los datos de los materiales para crear las opciones */}
            {materialData.map((material) => (
              <option key={material.name} value={material.value}>
                {material.name} {/* El texto visible para el usuario es el nombre */}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center mb-6 w-full max-w-md">
          <label htmlFor="materialSelect2" className="text-lg font-medium text-gray-700 mb-2">
            Material 2: <span className="font-mono">{selectedMaterialName2}</span> {/* Muestra el nombre */}
          </label>
          <select
            id="materialSelect2"
            value={selectedMaterialValue2} // El valor del select se vincula al valor numérico
            onChange={handleMaterialChange2}
            disabled={isAnimating} // Deshabilita el desplegable durante la animación
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          >
            {/* Mapea los datos de los materiales para crear las opciones */}
            {materialData.map((material) => (
              <option key={material.name} value={material.value}>
                {material.name} {/* El texto visible para el usuario es el nombre */}
              </option>
            ))}
          </select>
        </div>
        {/* NEW: Play Button */}
        <p className="mb-4">
          <button
            onClick={animateColors}
            disabled={isAnimating} // Disable button when animating
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            ▶ Play
          </button>
        </p>
        <a
          className="text-blue-300 hover:underline"
          href="https://github.com/JonaJJSJ-crypto/heat_exchange/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instrucciones de uso
        </a>

      </header>
    </div>
  );
};

export default App;