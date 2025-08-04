import { Rnd } from "react-rnd";
import { useDashboard } from "../../context/DashboardContext";
import { useNotification } from "../../context/NotificationContext";
import WidgetRenderer from "./WidgetRenderer";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCurrentThemeColors } from "../../utils/themeUtils.js";

export default function Canvas() {
  const { state, dispatch } = useDashboard();
  const { showNotification } = useNotification();
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
    const maxAttempts = 200; // Increased attempts

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

      // Try different positions with more spacing
      attempts++;
      if (attempts % 15 === 0) {
        // Every 15 attempts, move to a new row
        currentX = 50;
        currentY += 100; // More vertical spacing
      } else {
        // Move horizontally with more spacing
        currentX += 100; // More horizontal spacing
      }

      newWidget.x = currentX;
      newWidget.y = currentY;
    }

    // If we can't find a non-overlapping position, try a completely different area
    return { x: 50, y: Math.max(...state.widgets.map(w => w.y + w.height)) + 50 };
  };

  const updateWidget = (id, x, y, w, h) => {
    // Check for overlaps with other widgets
    const currentWidget = state.widgets.find(widget => widget.id === id);
    if (!currentWidget) return;

    const newWidget = { x, y, width: w, height: h };
    let hasOverlap = false;

    for (const widget of state.widgets) {
      if (widget.id !== id && isOverlapping(newWidget, widget)) {
        hasOverlap = true;
        break;
      }
    }

    if (hasOverlap) {
      showNotification("Cannot overlap widgets! Please move to a different position.", "error", 2000);
      return; // Don't update if there's an overlap
    }

    dispatch({
      type: "UPDATE_WIDGET",
      payload: { id, data: { x, y, width: w, height: h } },
    });
  };

  const deleteWidget = (id) => {
    console.log("Canvas: Deleting widget", id);
    dispatch({ type: "DELETE_WIDGET", payload: id });
    dispatch({ type: "SET_SELECTED_WIDGET", payload: null });
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas? This action cannot be undone.")) {
      dispatch({ type: "CLEAR_CANVAS" });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const type = data.type;

      // Default widget dimensions
      let defaultWidth = 300;
      let defaultHeight = 200;

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
      } else if (type === "video" || type === "iframe") {
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
      } else if (type === "divider") {
        defaultWidth = 400;
        defaultHeight = 20;
      } else if (type === "spacer") {
        defaultWidth = 100;
        defaultHeight = 50;
      }

      // Find non-overlapping position
      const position = findNonOverlappingPosition(x, y, defaultWidth, defaultHeight);
      
      // Check if the position was adjusted due to overlap
      if (position.x !== x || position.y !== y) {
        showNotification("Widget moved to avoid overlap with existing widgets.", "warning", 2000);
      }

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
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                  {
                    label: "Votes",
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.5)",
                      "rgba(54, 162, 235, 0.5)",
                      "rgba(255, 206, 86, 0.5)",
                      "rgba(75, 192, 192, 0.5)",
                      "rgba(153, 102, 255, 0.5)",
                      "rgba(255, 159, 64, 0.5)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
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
            title: "Progress",
            value: 75,
            maxValue: 100,
            color: "#3B82F6",
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
            title: "Image Widget",
            imageUrl: import.meta.env.VITE_DEFAULT_IMAGE_URL || "https://via.placeholder.com/300x200",
            altText: "Sample Image",
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
            title: "Total Users",
            value: 1234,
            prefix: "",
            suffix: "",
            color: "#10B981",
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
            title: "Calendar",
            events: JSON.stringify([
              { date: "2024-01-15", title: "Team Meeting", color: "#3B82F6" },
              { date: "2024-01-20", title: "Project Deadline", color: "#EF4444" },
              { date: "2024-01-25", title: "Client Call", color: "#10B981" },
            ]),
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
            tableTitle: "Sample Table",
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
            content: "Click Me",
            buttonColor: "#3B82F6",
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
            title: "Progress Bar",
            value: 65,
            maxValue: 100,
            color: "#10B981",
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
            title: "Video Widget",
            videoUrl: import.meta.env.VITE_DEFAULT_VIDEO_URL || "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
            title: "Clock",
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
            title: "Weather",
            city: "",
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
            title: "Toggle Switch",
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
            title: "Slider",
            value: 50,
            min: 0,
            max: 100,
            data: {},
          },
        });
      } else if (type === "divider") {
        dispatch({
          type: "ADD_WIDGET",
          payload: {
            id: uuidv4(),
            type,
            x: position.x,
            y: position.y,
            width: defaultWidth,
            height: defaultHeight,
            title: "Divider",
            style: "solid",
            color: "#E5E7EB",
            data: {},
          },
        });
      } else if (type === "spacer") {
        dispatch({
          type: "ADD_WIDGET",
          payload: {
            id: uuidv4(),
            type,
            x: position.x,
            y: position.y,
            width: defaultWidth,
            height: defaultHeight,
            title: "Spacer",
            data: {},
          },
        });
      }
    } catch (error) {
      console.error("Error parsing drop data:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // Handle keyboard events for delete functionality
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && state.selectedWidgetId) {
        e.preventDefault();
        console.log(
          "Keyboard delete triggered for widget:",
          state.selectedWidgetId
        );
        deleteWidget(state.selectedWidgetId);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedWidgetId]);

  return (
    <div className="flex-1 relative flex flex-col h-full">
      {/* Clear Canvas Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={clearCanvas}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
          title="Clear all widgets from canvas"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear Canvas
        </button>
      </div>

      {/* Scrollable Canvas Area */}
      <div
        className="flex-1 overflow-auto transition-colors duration-300 relative"
        style={{
          backgroundColor: themeColors?.border || (state.theme === "dark" ? "#374151" : "#F3F4F6")
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="min-w-full min-h-full p-4">
          {state.widgets.map((widget) => (
            <Rnd
              key={widget.id}
              size={{ width: widget.width, height: widget.height }}
              position={{ x: widget.x, y: widget.y }}
              bounds="parent"
              onClick={() =>
                dispatch({ type: "SET_SELECTED_WIDGET", payload: widget.id })
              }
              onDragStop={(e, d) =>
                updateWidget(widget.id, d.x, d.y, widget.width, widget.height)
              }
              onResizeStop={(e, dir, ref, delta, pos) =>
                updateWidget(
                  widget.id,
                  pos.x,
                  pos.y,
                  ref.offsetWidth,
                  ref.offsetHeight
                )
              }
              className={`${
                state.selectedWidgetId === widget.id
                  ? "ring-2 ring-blue-500 ring-opacity-50"
                  : ""
              }`}
            >
              <div className="relative w-full h-full">
                <WidgetRenderer widget={widget} />

                {/* Delete button for selected widget */}
                {state.selectedWidgetId === widget.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete button clicked for widget:", widget.id);
                      deleteWidget(widget.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg z-10"
                    title="Delete widget"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
}
