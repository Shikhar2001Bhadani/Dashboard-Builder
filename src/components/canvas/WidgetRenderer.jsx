import { Bar, Line, Pie } from "react-chartjs-2";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Separate component for image widget to handle state properly
function ImageWidget({ widget }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL || "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Image+Widget";
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300 flex flex-col">
      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200 flex-shrink-0">
        {widget.title || ""}
      </h3>
      <div className="flex-1 relative overflow-hidden rounded">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <img
          src={widget.imageUrl || defaultImageUrl}
          alt={widget.altText || "Dashboard Image"}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageError ? 'none' : 'block' }}
        />
        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-700">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {widget.altText || "Image not available"}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Check the image URL in properties
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for text widget to handle inline editing
function TextWidget({ widget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(widget.content || "");
  const { dispatch } = useDashboard();

  // Sync local content with widget content when it changes (e.g., after refresh)
  useEffect(() => {
    setLocalContent(widget.content || "");
  }, [widget.content]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update the widget content (allow empty strings)
    dispatch({
      type: "UPDATE_WIDGET",
      payload: { id: widget.id, data: { content: localContent } },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setLocalContent(widget.content || "");
    }
    // Allow Ctrl+A to select all text
    if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.target.select();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
        {widget.heading || "Heading"}
      </h3>
      {isEditing ? (
        <textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter the text here"
          className="w-full h-full resize-none bg-transparent text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-none outline-none focus:ring-0"
          autoFocus
        />
      ) : (
        <div
          onClick={handleClick}
          className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed cursor-text min-h-[100px]"
        >
          {localContent ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{localContent}</div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 italic">
              Enter the text here
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Separate component for heading widget to handle inline editing
function HeadingWidget({ widget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localHeading, setLocalHeading] = useState(widget.heading || "");
  const { dispatch } = useDashboard();

  // Sync local heading with widget heading when it changes
  useEffect(() => {
    setLocalHeading(widget.heading || "");
  }, [widget.heading]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update the widget heading (allow empty strings)
    dispatch({
      type: "UPDATE_WIDGET",
      payload: { id: widget.id, data: { heading: localHeading } },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setLocalHeading(widget.heading || "");
    }
    // Allow Ctrl+A to select all text
    if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.target.select();
    }
  };

  const headingSize = widget.headingSize || "h2";
  
  // Map heading sizes to appropriate text classes
  const getHeadingClass = (size) => {
    switch (size) {
      case "h1": return "text-4xl";
      case "h2": return "text-3xl";
      case "h3": return "text-2xl";
      case "h4": return "text-xl";
      case "h5": return "text-lg";
      case "h6": return "text-base";
      default: return "text-3xl";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex items-center justify-center transition-colors duration-300">
      {isEditing ? (
        <input
          value={localHeading}
          onChange={(e) => setLocalHeading(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter heading text"
          className={`w-full text-center bg-transparent text-gray-800 dark:text-gray-200 border-none outline-none focus:ring-0 font-bold ${getHeadingClass(headingSize)}`}
          autoFocus
        />
      ) : (
        <div 
          onClick={handleClick}
          className={`text-gray-800 dark:text-gray-200 text-center font-bold cursor-text ${getHeadingClass(headingSize)}`}
        >
          {localHeading ? (
            localHeading
          ) : (
            <span className="text-gray-400 dark:text-gray-500 italic">
              Click to edit heading
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Separate component for toggle widget to maintain state
function ToggleWidget({ widget }) {
  const [toggleValue, setToggleValue] = useState(widget.value || false);
  const { dispatch } = useDashboard();
  
  // Sync with widget value when it changes
  useEffect(() => {
    setToggleValue(widget.value || false);
  }, [widget.value]);

  const handleToggle = () => {
    const newValue = !toggleValue;
    setToggleValue(newValue);
    // Update the widget value
    dispatch({
      type: "UPDATE_WIDGET",
      payload: { id: widget.id, data: { value: newValue } },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col items-center justify-center transition-colors duration-300">
      <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-200 text-center">
        {widget.title || ""}
      </h3>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-12 w-20 items-center rounded-full transition-all duration-300 ease-in-out shadow-lg ${
            toggleValue 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/50' 
              : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
          }`}
        >
          <span
            className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
              toggleValue ? 'translate-x-8' : 'translate-x-1'
            }`}
          ></span>
        </button>
        <div className={`text-lg font-semibold transition-colors duration-300 ${
          toggleValue 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {toggleValue ? "ON" : "OFF"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click to toggle
        </div>
      </div>
    </div>
  );
}

// Separate component for slider widget to maintain state
function SliderWidget({ widget }) {
  const [sliderValue, setSliderValue] = useState(widget.value !== null && widget.value !== undefined ? widget.value : 50);
  const { dispatch } = useDashboard();
  
  // Sync with widget value when it changes, but only if the widget value is not null/undefined
  useEffect(() => {
    if (widget.value !== null && widget.value !== undefined) {
      setSliderValue(widget.value);
    }
  }, [widget.value]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setSliderValue(newValue);
    // Update the widget value
    dispatch({
      type: "UPDATE_WIDGET",
      payload: { id: widget.id, data: { value: newValue } },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col justify-center transition-colors duration-300">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 text-center">
        {widget.title || ""}
      </h3>
      <div className="px-4">
        <input
          type="range"
          min={widget.min || 0}
          max={widget.max || 100}
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          Value: {sliderValue}
        </div>
      </div>
    </div>
  );
}


export default function WidgetRenderer({ widget }) {
  switch (widget.type) {
    case "text":
      return <TextWidget widget={widget} />;
    case "chart":
      // Parse chart data from widget or use default
      let chartData;
      try {
        chartData = widget.chartData ? JSON.parse(widget.chartData) : null;
      } catch (error) {
        console.error("Invalid chart data JSON:", error);
        chartData = null;
      }

      // Default chart data if none provided or invalid
      const defaultData = {
        labels: ["Category 1", "Category 2", "Category 3"],
        datasets: [
          {
            label: "Values",
            data: [10, 20, 30],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // Use provided data or default, and ensure colors are always included
      const baseData = chartData || defaultData;
      const data = {
        labels: baseData.labels,
        datasets: baseData.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor:
            dataset.backgroundColor ||
            [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
            ].slice(0, dataset.data.length),
          borderColor:
            dataset.borderColor ||
            [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ].slice(0, dataset.data.length),
          borderWidth: dataset.borderWidth || 1,
        })),
      };

      const options = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: widget.chartTitle ? true : false,
            text: widget.chartTitle || "",
          },
        },
        maintainAspectRatio: false,
      };
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 w-full h-full flex items-center justify-center transition-colors duration-300">
          <div style={{ width: "100%", height: "100%" }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      );
    case "lineChart":
      // Parse line chart data
      let lineChartData;
      try {
        lineChartData = widget.chartData ? JSON.parse(widget.chartData) : null;
      } catch (error) {
        console.error("Invalid line chart data JSON:", error);
        lineChartData = null;
      }

      const defaultLineData = {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Values",
            data: [10, 20, 30],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
          },
        ],
      };

      const lineData = lineChartData || defaultLineData;
      const lineOptions = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: widget.chartTitle ? true : false,
            text: widget.chartTitle || "",
          },
        },
        maintainAspectRatio: false,
      };

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 w-full h-full flex items-center justify-center transition-colors duration-300">
          <div style={{ width: "100%", height: "100%" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      );
    case "pieChart":
      // Parse pie chart data
      let pieChartData;
      try {
        pieChartData = widget.chartData ? JSON.parse(widget.chartData) : null;
      } catch (error) {
        console.error("Invalid pie chart data JSON:", error);
        pieChartData = null;
      }

      const defaultPieData = {
        labels: ["Category 1", "Category 2", "Category 3"],
        datasets: [
          {
            data: [30, 40, 30],
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 206, 86, 0.8)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const pieData = pieChartData || defaultPieData;
      const pieOptions = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: widget.chartTitle ? true : false,
            text: widget.chartTitle || "",
          },
        },
        maintainAspectRatio: false,
      };

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 w-full h-full flex items-center justify-center transition-colors duration-300">
          <div style={{ width: "100%", height: "100%" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      );
    case "areaChart":
      // Parse area chart data
      let areaChartData;
      try {
        areaChartData = widget.chartData ? JSON.parse(widget.chartData) : null;
      } catch (error) {
        console.error("Invalid area chart data JSON:", error);
        areaChartData = null;
      }

      const defaultAreaData = [
        { name: "Jan", value: 100 },
        { name: "Feb", value: 200 },
        { name: "Mar", value: 150 },
      ];

      const areaData = areaChartData || defaultAreaData;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
            {widget.title || ""}
          </h3>
          <div style={{ width: "100%", height: "calc(100% - 40px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    case "gauge":
      // Ensure value doesn't exceed maxValue and handle edge cases
      const gaugeValue = Math.min(Math.max(widget.value || 0, 0), widget.maxValue || 100);
      const gaugeMaxValue = Math.max(widget.maxValue || 100, 1); // Ensure maxValue is at least 1
      const gaugePercentage = Math.min((gaugeValue / gaugeMaxValue) * 100, 100);
      // Calculate stroke dasharray - when 100%, the circle should be completely filled
      const strokeLength = (gaugePercentage / 100) * 251.2; // 251.2 is the circumference of the circle (2 * π * 40)
      const strokeDasharray = `${strokeLength}, 251.2`;
      
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col items-center justify-center transition-colors duration-300">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || ""}
          </h3>
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={widget.color || "#3B82F6"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dasharray 0.5s ease-in-out",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {Math.round(gaugePercentage)}%
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {gaugeValue} / {gaugeMaxValue}
            </span>
          </div>
        </div>
      );
    case "image":
      return <ImageWidget widget={widget} />;
    case "counter":
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col items-center justify-center transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || ""}
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: widget.color || "#10B981" }}>
              {widget.prefix || ""}{widget.value?.toLocaleString() || "0"}{widget.suffix || ""}
            </div>
          </div>
        </div>
      );

    case "calendar":
      let events;
      try {
        events = widget.events ? JSON.parse(widget.events) : [];
      } catch (error) {
        console.error("Invalid calendar events JSON:", error);
        events = [];
      }

      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear();

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">
            {widget.title || ""}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
            {currentDay} {currentMonth} {currentYear}
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div
                  key={index}
                  className="p-2 rounded text-xs border-l-4"
                  style={{ borderLeftColor: event.color || "#3B82F6" }}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {event.title}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 text-xs">
                No events scheduled
              </div>
            )}
          </div>
        </div>
      );
    case "table":
      // Parse table data from widget or use default
      let tableData;
      try {
        tableData = widget.tableData ? JSON.parse(widget.tableData) : null;
      } catch (error) {
        console.error("Invalid table data JSON:", error);
        tableData = null;
      }

      // Default table data if none provided or invalid
      const defaultTableData = {
        headers: ["Name", "Age", "City", "Salary"],
        rows: [
          ["John Doe", "30", "New York", "$50,000"],
          ["Jane Smith", "25", "Los Angeles", "$45,000"],
          ["Bob Johnson", "35", "Chicago", "$60,000"],
          ["Alice Brown", "28", "Houston", "$55,000"],
        ],
      };

      const table = tableData || defaultTableData;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full overflow-auto transition-colors duration-300">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">
            {widget.tableTitle || ""}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {table.headers.map((header, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "button":
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <button 
            className="text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg active:scale-95 active:shadow-sm transform"
            style={{ 
              backgroundColor: widget.buttonColor || "#3B82F6",
              filter: widget.buttonColor ? `brightness(1.1)` : undefined
            }}
            onMouseEnter={(e) => {
              if (widget.buttonColor) {
                e.target.style.filter = 'brightness(0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (widget.buttonColor) {
                e.target.style.filter = 'brightness(1.1)';
              }
            }}
            onClick={(e) => {
              // Add click animation
              e.target.style.transform = 'scale(0.95)';
              setTimeout(() => {
                e.target.style.transform = 'scale(1)';
              }, 150);
            }}
          >
            {widget.content || ""}
          </button>
        </div>
      );
    case "heading":
      return <HeadingWidget widget={widget} />;
    case "progress":
      // Ensure value doesn't exceed maxValue and handle edge cases
      const progressValue = Math.min(Math.max(widget.value || 0, 0), widget.maxValue || 100);
      const progressMaxValue = Math.max(widget.maxValue || 100, 1); // Ensure maxValue is at least 1
      const progressPercentage = Math.min((progressValue / progressMaxValue) * 100, 100);
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col justify-center transition-colors duration-300">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || ""}
          </h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="h-4 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: widget.color || "#10B981",
              }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {progressValue} / {progressMaxValue} ({Math.round(progressPercentage)}%)
          </div>
        </div>
      );
    case "video":
      // Clean and process the video URL
      const cleanVideoUrl = (url) => {
        if (!url) return import.meta.env.VITE_DEFAULT_VIDEO_URL || "https://www.youtube.com/embed/dQw4w9WgXcQ";
        
        try {
          // Remove any additional parameters that might cause issues
          let cleanUrl = url;
          
          // Handle different YouTube URL formats
          if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.match(/[?&]v=([^&]+)/)?.[1];
            if (videoId) {
              cleanUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          } else if (url.includes('youtu.be/')) {
            const videoId = url.match(/youtu\.be\/([^?&]+)/)?.[1];
            if (videoId) {
              cleanUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          } else if (url.includes('youtube.com/embed/')) {
            // Already in embed format, just clean any additional parameters
            const videoId = url.match(/embed\/([^?&]+)/)?.[1];
            if (videoId) {
              cleanUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          }
          
          return cleanUrl;
        } catch (error) {
          console.error('Error processing video URL:', error);
          return import.meta.env.VITE_DEFAULT_VIDEO_URL || "https://www.youtube.com/embed/dQw4w9WgXcQ";
        }
      };

      const processedVideoUrl = cleanVideoUrl(widget.videoUrl);

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
            {widget.title || ""}
          </h3>
          <div className="flex-1 relative">
            <iframe
              src={processedVideoUrl}
              title="Video"
              className="w-full h-full rounded"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={(e) => {
                console.error('Video iframe error:', e);
              }}
            ></iframe>
          </div>
        </div>
      );
    case "iframe":
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full transition-colors duration-300">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
            {widget.title || ""}
          </h3>
          <div className="flex-1 relative">
            <iframe
              src={widget.iframeUrl || import.meta.env.VITE_DEFAULT_IFRAME_URL || "https://www.google.com"}
              title="Embedded Content"
              className="w-full h-full rounded"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      );
    case "clock":
      const [currentTime, setCurrentTime] = useState(new Date());
      
      useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
      }, []);

      const formatTime = (date, format) => {
        if (format === "24h") {
          return date.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } else {
          return date.toLocaleTimeString('en-US', { 
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        }
      };

      const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 h-full flex flex-col items-center justify-center transition-colors duration-300">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 text-center">
            {widget.title || ""}
          </h3>
          <div className="text-center space-y-3">
            {/* Time */}
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 font-mono">
              {formatTime(currentTime, widget.format || "12h")}
            </div>
            
            {/* Date */}
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {formatDate(currentTime)}
            </div>
            
            {/* Timezone indicator */}
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {widget.timezone === "local" ? "Local Time" : "UTC"}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-2xl">🕐</div>
          <div className="absolute bottom-4 left-4 text-lg">⏰</div>
        </div>
      );

    case "toggle":
      return <ToggleWidget widget={widget} />;
    case "slider":
      return <SliderWidget widget={widget} />;
    default:
      return null;
  }
}
