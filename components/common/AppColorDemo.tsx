import React from "react";

const colors = [
  "brown",
  "lightbrown",
  "red",
  "black",
  "white",
  "grey",
  "green",
];

const AppColorDemo = () => {
  return (
    <div className="space-y-10 p-6">
      {colors.map((color) => (
        <div key={color} className="space-y-2">
          <h2 className="text-lg font-semibold capitalize">
            app-color-{color}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Background color */}
            <div
              className={`p-4 rounded-md bg-app-color-${color} text-app-color-black border`}
            >
              bg-app-color-{color}
            </div>

            {/* Text color */}
            <div className="p-4 rounded-md bg-white border">
              <p className={`text-app-color-${color}`}>
                text-app-color-{color}
              </p>
            </div>

            {/* Border color */}
            <div
              className={`p-4 rounded-md border-4 border-app-color-${color}`}
            >
              border-app-color-{color}
            </div>

            {/* Ring color */}
            <div className={`p-4 rounded-md ring-4 ring-app-color-${color}`}>
              ring-app-color-{color}
            </div>

            {/* Placeholder color */}
            <input
              type="text"
              placeholder={`placeholder-app-color-${color}`}
              className={`
                border border-app-color-${color}
                placeholder-app-color-${color}
                px-3 py-2 rounded-md w-full
                text-black
              `}
            />
          </div>
        </div>
      ))}

      {/* Gradient Example */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">app-color-gradient</h2>
        <div className="p-4 rounded-md bg-app-color-gradient text-black border">
          bg-app-color-gradient
        </div>
      </div>
    </div>
  );
};

export default AppColorDemo;
