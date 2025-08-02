import { v4 as uuidv4 } from "uuid";
import { useDashboard } from "../../context/DashboardContext";
import { getCurrentThemeColors } from "../../utils/themeUtils.js";

export default function WidgetSidebar() {
  const { state, dispatch } = useDashboard();
  const themeColors = getCurrentThemeColors(state.seasonalTheme);

  // Function to check if two rectangles overlap
  const isOverlapping = (rect1, rect2) => {
    return !(
      rect1.x + rect1.width <= rect2.x ||
      rect2.x + rect2.width <= rect1.x ||
      rect1.y + rect1.height <= rect2.y ||
      rect2.y + rect2.height <= rect1.y
    );
  };

  // Function to find a non-overlapping position for a new widget
  const findNonOverlappingPosition = (x, y, width, height) => {
    const newWidget = { x, y, width, height };
    let attempts = 0;
    let currentX = x;
    let currentY = y;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      let hasOverlap = false;
      
      for (const widget of state.widgets) {
        if (isOverlapping(newWidget, widget)) {
          hasOverlap = true;
          break;
        }
      }

      if (!hasOverlap) {
        return { x: currentX, y: currentY };
      }

      // Try different positions
      attempts++;
      if (attempts % 10 === 0) {
        // Every 10 attempts, move to a new row
        currentX = 50;
        currentY += 50;
      } else {
        // Move horizontally
        currentX += 50;
      }

      newWidget.x = currentX;
      newWidget.y = currentY;
    }

    // If we can't find a non-overlapping position, return the original position
    return { x, y };
  };

  const addWidget = (type) => {
    // Default widget dimensions
    let defaultWidth = 300;
    let defaultHeight = 200;
    let defaultX = 50;
    let defaultY = 50;

    // Set specific dimensions for different widget types
    if (type === "text") {
      defaultWidth = 300;
      defaultHeight = 150;
    } else if (type === "heading") {
      defaultWidth = 400;
      defaultHeight = 80;
    } else if (type === "chart" || type === "lineChart" || type === "areaChart") {
      defaultWidth = 400;
      defaultHeight = 300;
    } else if (type === "pieChart") {
      defaultWidth = 350;
      defaultHeight = 300;
    } else if (type === "table") {
      defaultWidth = 500;
      defaultHeight = 300;
    } else if (type === "counter") {
      defaultWidth = 200;
      defaultHeight = 150;
    } else if (type === "gauge") {
      defaultWidth = 200;
      defaultHeight = 200;
    } else if (type === "progress") {
      defaultWidth = 300;
      defaultHeight = 100;
    } else if (type === "image") {
      defaultWidth = 300;
      defaultHeight = 200;
    } else if (type === "video") {
      defaultWidth = 400;
      defaultHeight = 250;
    } else if (type === "calendar") {
      defaultWidth = 300;
      defaultHeight = 250;
    } else if (type === "clock") {
      defaultWidth = 200;
      defaultHeight = 100;
    } else if (type === "weather") {
      defaultWidth = 250;
      defaultHeight = 150;
    } else if (type === "button") {
      defaultWidth = 200;
      defaultHeight = 100;
    } else if (type === "toggle") {
      defaultWidth = 150;
      defaultHeight = 80;
    } else if (type === "slider") {
      defaultWidth = 250;
      defaultHeight = 100;
    }

    // Find non-overlapping position
    const position = findNonOverlappingPosition(defaultX, defaultY, defaultWidth, defaultHeight);

    if (type === "text") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          heading: "New Heading",
          content: "",
          data: {},
        },
      });
    } else if (type === "heading") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          heading: "New Heading",
          headingSize: "h2",
          data: {},
        },
      });
    } else if (type === "chart") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          chartTitle: "Sample Bar Chart",
          chartData: JSON.stringify(
            {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Sales",
                  data: [65, 59, 80, 81, 56, 55],
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgb(75, 192, 192)",
                  borderWidth: 1,
                },
              ],
            },
            null,
            2
          ),
          data: {},
        },
      });
    } else if (type === "lineChart") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          chartTitle: "Sample Line Chart",
          chartData: JSON.stringify(
            {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Sales",
                  data: [65, 59, 80, 81, 56, 55],
                  borderColor: "rgb(75, 192, 192)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  tension: 0.1,
                },
              ],
            },
            null,
            2
          ),
          data: {},
        },
      });
    } else if (type === "pieChart") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          chartTitle: "Sample Pie Chart",
          chartData: JSON.stringify(
            {
              labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
              datasets: [
                {
                  data: [12, 19, 3, 5, 2],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            null,
            2
          ),
          data: {},
        },
      });
    } else if (type === "areaChart") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          chartTitle: "Sample Area Chart",
          chartData: JSON.stringify(
            [
              { name: "Jan", value: 400 },
              { name: "Feb", value: 300 },
              { name: "Mar", value: 600 },
              { name: "Apr", value: 800 },
              { name: "May", value: 500 },
              { name: "Jun", value: 700 },
            ],
            null,
            2
          ),
          data: {},
        },
      });
    } else if (type === "table") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          tableTitle: "",
          tableData: JSON.stringify(
            {
              headers: ["Name", "Age", "City", "Salary"],
              rows: [
                ["John Doe", "30", "New York", "$50,000"],
                ["Jane Smith", "25", "Los Angeles", "$45,000"],
                ["Bob Johnson", "35", "Chicago", "$60,000"],
                ["Alice Brown", "28", "Houston", "$55,000"],
              ],
            },
            null,
            2
          ),
          data: {},
        },
      });
    } else if (type === "counter") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          value: 1234,
          prefix: "",
          suffix: "",
          color: "#10B981",
          data: {},
        },
      });
    } else if (type === "gauge") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          value: 75,
          maxValue: 100,
          color: "#3B82F6",
          data: {},
        },
      });
    } else if (type === "progress") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          value: 65,
          maxValue: 100,
          color: "#10B981",
          data: {},
        },
      });
    } else if (type === "image") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          imageUrl: import.meta.env.VITE_DEFAULT_IMAGE_URL || "https://via.placeholder.com/300x200",
          altText: "Sample Image",
          data: {},
        },
      });
    } else if (type === "video") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          videoUrl: import.meta.env.VITE_DEFAULT_VIDEO_URL || "https://www.youtube.com/embed/dQw4w9WgXcQ",
          data: {},
        },
      });
    } else if (type === "calendar") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          events: JSON.stringify([
            { date: "2024-01-15", title: "Team Meeting", color: "#3B82F6" },
            { date: "2024-01-20", title: "Project Deadline", color: "#EF4444" },
            { date: "2024-01-25", title: "Client Call", color: "#10B981" },
          ]),
          data: {},
        },
      });
    } else if (type === "clock") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          timezone: "local",
          format: "12h",
          data: {},
        },
      });
    } else if (type === "weather") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          city: "",
          data: {},
        },
      });
    } else if (type === "button") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          content: "",
          buttonColor: "#3B82F6",
          data: {},
        },
      });
    } else if (type === "toggle") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          value: false,
          data: {},
        },
      });
    } else if (type === "slider") {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "",
          value: 50,
          min: 0,
          max: 100,
          data: {},
        },
      });
    } else {
      dispatch({
        type: "ADD_WIDGET",
        payload: {
          id: uuidv4(),
          type,
          x: position.x,
          y: position.y,
          width: defaultWidth,
          height: defaultHeight,
          title: "New Widget",
          data: {},
        },
      });
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div 
      className="p-2 w-48 transition-colors duration-300 flex flex-col h-full"
      style={{
        backgroundColor: themeColors?.surface || (state.theme === "dark" ? "#1F2937" : "#E5E7EB"),
        color: themeColors?.text || (state.theme === "dark" ? "#F9FAFB" : "#111827")
      }}
    >
      <h2 className="font-bold mb-2 flex-shrink-0">Widgets</h2>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin sidebar-scrollbar">
        {/* Text Widgets */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Text</h3>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "text")}
            onClick={() => addWidget("text")}
            className="w-full bg-blue-500 text-white p-1 mb-1 rounded hover:bg-blue-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Text Widget
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "heading")}
            onClick={() => addWidget("heading")}
            className="w-full bg-blue-600 text-white p-1 mb-1 rounded hover:bg-blue-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Heading Widget
          </button>
        </div>

        {/* Chart Widgets */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Charts</h3>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "chart")}
            onClick={() => addWidget("chart")}
            className="w-full bg-green-500 text-white p-1 mb-1 rounded hover:bg-green-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Bar Chart
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "lineChart")}
            onClick={() => addWidget("lineChart")}
            className="w-full bg-green-600 text-white p-1 mb-1 rounded hover:bg-green-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Line Chart
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "pieChart")}
            onClick={() => addWidget("pieChart")}
            className="w-full bg-green-700 text-white p-1 mb-1 rounded hover:bg-green-800 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Pie Chart
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "areaChart")}
            onClick={() => addWidget("areaChart")}
            className="w-full bg-green-800 text-white p-1 mb-1 rounded hover:bg-green-900 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Area Chart
          </button>
        </div>

        {/* Data Widgets */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Data</h3>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "table")}
            onClick={() => addWidget("table")}
            className="w-full bg-purple-500 text-white p-1 mb-1 rounded hover:bg-purple-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Table
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "counter")}
            onClick={() => addWidget("counter")}
            className="w-full bg-purple-600 text-white p-1 mb-1 rounded hover:bg-purple-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Counter
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "gauge")}
            onClick={() => addWidget("gauge")}
            className="w-full bg-purple-700 text-white p-1 mb-1 rounded hover:bg-purple-800 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Gauge
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "progress")}
            onClick={() => addWidget("progress")}
            className="w-full bg-purple-800 text-white p-1 mb-1 rounded hover:bg-purple-900 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Progress Bar
          </button>
        </div>

        {/* Media Widgets */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Media</h3>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "image")}
            onClick={() => addWidget("image")}
            className="w-full bg-orange-500 text-white p-1 mb-1 rounded hover:bg-orange-600 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Image
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "video")}
            onClick={() => addWidget("video")}
            className="w-full bg-orange-600 text-white p-1 mb-1 rounded hover:bg-orange-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Video
          </button>
        </div>

        {/* Info Widgets */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Info</h3>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "calendar")}
            onClick={() => addWidget("calendar")}
            className="w-full bg-cyan-600 text-white p-1 mb-1 rounded hover:bg-cyan-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Calendar
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "clock")}
            onClick={() => addWidget("clock")}
            className="w-full bg-cyan-700 text-white p-1 mb-1 rounded hover:bg-cyan-800 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Clock
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "weather")}
            onClick={() => addWidget("weather")}
            className="w-full bg-cyan-800 text-white p-1 mb-1 rounded hover:bg-cyan-900 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Weather
          </button>
        </div>

        {/* Interactive Widgets */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Interactive</h3>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "button")}
            onClick={() => addWidget("button")}
            className="w-full bg-orange-600 text-white p-1 mb-1 rounded hover:bg-orange-700 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Button
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "toggle")}
            onClick={() => addWidget("toggle")}
            className="w-full bg-orange-700 text-white p-1 mb-1 rounded hover:bg-orange-800 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Toggle Switch
          </button>
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "slider")}
            onClick={() => addWidget("slider")}
            className="w-full bg-orange-800 text-white p-1 mb-1 rounded hover:bg-orange-900 transition-colors duration-200 cursor-grab active:cursor-grabbing text-xs"
          >
            Slider
          </button>
        </div>
      </div>
    </div>
  );
}
