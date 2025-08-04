import { useDashboard } from "../../context/DashboardContext";
import { getCurrentThemeColors } from "../../utils/themeUtils.js";

import { useCallback, useState } from "react";

export default function PropertiesPanel() {
  const { state, dispatch } = useDashboard();
  const themeColors = getCurrentThemeColors(state.seasonalTheme, state.theme === "dark");
  const widget = state.widgets.find((w) => w.id === state.selectedWidgetId);


  if (!widget)
    return (
      <div className="w-64 p-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        Select a widget
      </div>
    );

  const updateWidgetData = useCallback(
    (key, value) => {
      dispatch({
        type: "UPDATE_WIDGET",
        payload: { id: widget.id, data: { [key]: value } },
      });
    },
    [widget.id, dispatch]
  );

  const deleteWidget = () => {
    dispatch({ type: "DELETE_WIDGET", payload: widget.id });
    dispatch({ type: "SET_SELECTED_WIDGET", payload: null });
  };

  return (
    <div 
      className="w-64 p-2 transition-colors duration-300 overflow-y-auto max-h-screen"
      style={{
        backgroundColor: themeColors?.surface || (state.theme === "dark" ? "#111827" : "#F9FAFB"),
        color: themeColors?.text || (state.theme === "dark" ? "#F9FAFB" : "#111827")
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Properties</h2>
        <button
          onClick={deleteWidget}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5.133 7H5a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-1z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 11v6M14 11v6M4 7h16M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
            />
          </svg>
          Delete
        </button>
      </div>

      {/* Text Widget Properties */}
      {widget.type === "text" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.heading || ""}
            onChange={(e) => updateWidgetData("heading", e.target.value)}
            placeholder="Enter heading..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Click directly on the text widget to edit its content
          </div>
        </>
      )}

      {/* Chart Widget Properties */}
      {(widget.type === "chart" || widget.type === "lineChart" || widget.type === "pieChart") && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.chartTitle || ""}
            onChange={(e) => updateWidgetData("chartTitle", e.target.value)}
            placeholder="Enter chart title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Data (JSON):
          </label>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {widget.type === "chart" && `Format: {"labels": ["Label1", "Label2"], "datasets": [{"label": "Values", "data": [10, 20]}]}`}
            {widget.type === "lineChart" && `Format: {"labels": ["Jan", "Feb"], "datasets": [{"label": "Values", "data": [10, 20]}]}`}
            {widget.type === "pieChart" && `Format: {"labels": ["Category1", "Category2"], "datasets": [{"data": [30, 70]}]}`}
          </div>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="8"
            value={widget.chartData || "{}"}
            onChange={(e) => updateWidgetData("chartData", e.target.value)}
            placeholder="Enter chart data in JSON format..."
          />
          <button
            onClick={() => {
              const exampleData = widget.type === "chart" 
                ? JSON.stringify({
                    labels: ["Category 1", "Category 2", "Category 3"],
                    datasets: [{
                      label: "Values",
                      data: [10, 20, 30],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)"
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)"
                      ],
                      borderWidth: 1
                    }]
                  }, null, 2)
                : widget.type === "lineChart"
                ? JSON.stringify({
                    labels: ["Jan", "Feb", "Mar"],
                    datasets: [{
                      label: "Values",
                      data: [10, 20, 30],
                      borderColor: "rgb(75, 192, 192)",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      tension: 0.1
                    }]
                  }, null, 2)
                : JSON.stringify({
                    labels: ["Category 1", "Category 2", "Category 3"],
                    datasets: [{
                      data: [30, 40, 30],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)"
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)"
                      ],
                      borderWidth: 1
                    }]
                  }, null, 2);
              updateWidgetData("chartData", exampleData);
            }}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200 mb-3"
          >
            Load Example Data
          </button>
        </>
      )}

      {/* Area Chart Widget Properties */}
      {widget.type === "areaChart" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.chartTitle || ""}
            onChange={(e) => updateWidgetData("chartTitle", e.target.value)}
            placeholder="Enter chart title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Data (JSON):
          </label>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {`Format: [{"name": "Jan", "value": 400}, {"name": "Feb", "value": 300}]`}
          </div>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="8"
            value={widget.chartData || "[]"}
            onChange={(e) => updateWidgetData("chartData", e.target.value)}
            placeholder="Enter chart data in JSON format..."
          />
          <button
            onClick={() => {
              const exampleData = JSON.stringify([
                { name: "Jan", value: 400 },
                { name: "Feb", value: 300 },
                { name: "Mar", value: 600 },
                { name: "Apr", value: 800 },
                { name: "May", value: 500 },
                { name: "Jun", value: 700 }
              ], null, 2);
              updateWidgetData("chartData", exampleData);
            }}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200 mb-3"
          >
            Load Example Data
          </button>
        </>
      )}

      {/* Gauge Widget Properties */}
      {widget.type === "gauge" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.value || 0}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              const maxValue = widget.maxValue || 100;
              // Ensure value doesn't exceed maxValue
              const clampedValue = Math.min(Math.max(newValue, 0), maxValue);
              updateWidgetData("value", clampedValue);
            }}
            min="0"
            max={widget.maxValue || 100}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.maxValue || 100}
            onChange={(e) => {
              const newMaxValue = parseInt(e.target.value) || 1;
              const clampedMaxValue = Math.max(newMaxValue, 1);
              updateWidgetData("maxValue", clampedMaxValue);
              // If current value exceeds new max, adjust it
              if (widget.value > clampedMaxValue) {
                updateWidgetData("value", clampedMaxValue);
              }
            }}
            min="1"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color:
          </label>
          <input
            type="color"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.color || "#3B82F6"}
            onChange={(e) => updateWidgetData("color", e.target.value)}
          />
        </>
      )}

      {/* Image Widget Properties */}
      {widget.type === "image" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL:
          </label>
          <input
            type="url"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.imageUrl || ""}
            onChange={(e) => updateWidgetData("imageUrl", e.target.value)}
            placeholder="Enter image URL..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alt Text:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.altText || ""}
            onChange={(e) => updateWidgetData("altText", e.target.value)}
            placeholder="Enter alt text..."
          />
        </>
      )}

      {/* Counter Widget Properties */}
      {widget.type === "counter" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.value || 0}
            onChange={(e) => updateWidgetData("value", parseInt(e.target.value))}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prefix:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.prefix || ""}
            onChange={(e) => updateWidgetData("prefix", e.target.value)}
            placeholder="Enter prefix..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Suffix:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.suffix || ""}
            onChange={(e) => updateWidgetData("suffix", e.target.value)}
            placeholder="Enter suffix..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color:
          </label>
          <input
            type="color"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.color || "#10B981"}
            onChange={(e) => updateWidgetData("color", e.target.value)}
          />
        </>
      )}



      {/* Calendar Widget Properties */}
      {widget.type === "calendar" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Events (JSON):
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="8"
            value={widget.events || "[]"}
            onChange={(e) => updateWidgetData("events", e.target.value)}
            placeholder="Enter events in JSON format..."
          />
        </>
      )}

      {/* Table Widget Properties */}
      {widget.type === "table" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Table Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.tableTitle || ""}
            onChange={(e) => updateWidgetData("tableTitle", e.target.value)}
            placeholder="Enter table title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Table Data (JSON):
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows="10"
            value={
              widget.tableData ||
              JSON.stringify(
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
              )
            }
            onChange={(e) => updateWidgetData("tableData", e.target.value)}
            placeholder="Enter table data in JSON format..."
          />
        </>
      )}

      {/* Button Widget Properties */}
      {widget.type === "button" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Text:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.content || ""}
            onChange={(e) => updateWidgetData("content", e.target.value)}
            placeholder="Enter button text..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Color:
          </label>
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="color"
              className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              value={widget.buttonColor || "#3B82F6"}
              onChange={(e) => updateWidgetData("buttonColor", e.target.value)}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {widget.buttonColor || "#3B82F6"}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Choose a color for your button background
          </div>
        </>
      )}

      {/* Heading Widget Properties */}
      {widget.type === "heading" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading Text:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.heading || ""}
            onChange={(e) => updateWidgetData("heading", e.target.value)}
            placeholder="Enter heading text..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading Size:
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.headingSize || "h2"}
            onChange={(e) => updateWidgetData("headingSize", e.target.value)}
          >
            <option value="h1">H1 (Largest)</option>
            <option value="h2">H2 (Large)</option>
            <option value="h3">H3 (Medium)</option>
            <option value="h4">H4 (Small)</option>
            <option value="h5">H5 (Smaller)</option>
            <option value="h6">H6 (Smallest)</option>
          </select>
        </>
      )}

      {/* Progress Widget Properties */}
      {widget.type === "progress" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.value || 0}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              const maxValue = widget.maxValue || 100;
              // Ensure value doesn't exceed maxValue
              const clampedValue = Math.min(Math.max(newValue, 0), maxValue);
              updateWidgetData("value", clampedValue);
            }}
            min="0"
            max={widget.maxValue || 100}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.maxValue || 100}
            onChange={(e) => {
              const newMaxValue = parseInt(e.target.value) || 1;
              const clampedMaxValue = Math.max(newMaxValue, 1);
              updateWidgetData("maxValue", clampedMaxValue);
              // If current value exceeds new max, adjust it
              if (widget.value > clampedMaxValue) {
                updateWidgetData("value", clampedMaxValue);
              }
            }}
            min="1"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color:
          </label>
          <input
            type="color"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.color || "#10B981"}
            onChange={(e) => updateWidgetData("color", e.target.value)}
          />
        </>
      )}

      {/* Video Widget Properties */}
      {widget.type === "video" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL:
          </label>
          <input
            type="url"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.videoUrl || ""}
            onChange={(e) => {
              let url = e.target.value;
              
              // Clean and process the URL
              try {
                if (url.includes('youtube.com/watch?v=')) {
                  // Extract video ID and remove all additional parameters
                  const videoId = url.match(/[?&]v=([^&]+)/)?.[1];
                  if (videoId) {
                    url = `https://www.youtube.com/embed/${videoId}`;
                  }
                } else if (url.includes('youtu.be/')) {
                  // Extract video ID from short URL
                  const videoId = url.match(/youtu\.be\/([^?&]+)/)?.[1];
                  if (videoId) {
                    url = `https://www.youtube.com/embed/${videoId}`;
                  }
                } else if (url.includes('youtube.com/embed/')) {
                  // Already embed format, just clean additional parameters
                  const videoId = url.match(/embed\/([^?&]+)/)?.[1];
                  if (videoId) {
                    url = `https://www.youtube.com/embed/${videoId}`;
                  }
                }
              } catch (error) {
                console.error('Error processing video URL:', error);
              }
              
              updateWidgetData("videoUrl", url);
            }}
            placeholder="Enter any YouTube video URL..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 <strong>Supported formats:</strong>
            <br />
            • Regular YouTube: https://www.youtube.com/watch?v=VIDEO_ID
            <br />
            • Short YouTube: https://youtu.be/VIDEO_ID
            <br />
            • Embed YouTube: https://www.youtube.com/embed/VIDEO_ID
            <br />
            💡 URLs are automatically converted to embed format
          </div>
        </>
      )}

      {/* Iframe Widget Properties */}
      {widget.type === "iframe" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Embed URL:
          </label>
          <input
            type="url"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.iframeUrl || ""}
            onChange={(e) => updateWidgetData("iframeUrl", e.target.value)}
            placeholder="Enter embed URL..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Enter any website URL to embed it
          </div>
        </>
      )}

      {/* Clock Widget Properties */}
      {widget.type === "clock" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Format:
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.format || "12h"}
            onChange={(e) => updateWidgetData("format", e.target.value)}
          >
            <option value="12h">12-hour format</option>
            <option value="24h">24-hour format</option>
          </select>
        </>
      )}



      {/* Toggle Widget Properties */}
      {widget.type === "toggle" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Click the toggle to switch between ON/OFF states
          </div>
        </>
      )}

      {/* Slider Widget Properties */}
      {widget.type === "slider" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title:
          </label>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.title || ""}
            onChange={(e) => updateWidgetData("title", e.target.value)}
            placeholder="Enter title..."
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.min || 0}
            onChange={(e) => updateWidgetData("min", parseInt(e.target.value))}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.max || 100}
            onChange={(e) => updateWidgetData("max", parseInt(e.target.value))}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Default Value:
          </label>
          <input
            type="number"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.value || 50}
            onChange={(e) => updateWidgetData("value", parseInt(e.target.value))}
            min={widget.min || 0}
            max={widget.max || 100}
          />
        </>
      )}

      {/* Divider Widget Properties */}
      {widget.type === "divider" && (
        <>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Style:
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.style || "solid"}
            onChange={(e) => updateWidgetData("style", e.target.value)}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color:
          </label>
          <input
            type="color"
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={widget.color || "#E5E7EB"}
            onChange={(e) => updateWidgetData("color", e.target.value)}
          />
        </>
      )}

      {/* Generic Widget Properties */}
      {widget.type !== "text" &&
        widget.type !== "heading" &&
        widget.type !== "chart" &&
        widget.type !== "lineChart" &&
        widget.type !== "pieChart" &&
        widget.type !== "areaChart" &&
        widget.type !== "gauge" &&
        widget.type !== "progress" &&
        widget.type !== "image" &&
        widget.type !== "video" &&
        widget.type !== "iframe" &&
        widget.type !== "counter" &&
        widget.type !== "calendar" &&
        widget.type !== "table" &&
        widget.type !== "button" &&
        widget.type !== "clock" &&

        widget.type !== "toggle" &&
        widget.type !== "slider" &&
        widget.type !== "divider" &&
        widget.type !== "spacer" && (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content:
            </label>
            <textarea
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={widget.content || ""}
              onChange={(e) => updateWidgetData("content", e.target.value)}
            />
          </>
        )}

      {/* Common Properties */}
      <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Width:
        </label>
        <input
          type="number"
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={widget.width}
          onChange={(e) => updateWidgetData("width", parseInt(e.target.value))}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Height:
        </label>
        <input
          type="number"
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full mb-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={widget.height}
          onChange={(e) => updateWidgetData("height", parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
