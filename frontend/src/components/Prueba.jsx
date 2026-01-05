import React from "react";
import "primeflex/primeflex.css";

export default function Prueba() {
  return (
    <div className="grid">
      <div
        className="col-12 md:col-4 lg:col-3"
        style={{ background: "lightblue" }}
      >
        Card 1
      </div>
      <div
        className="col-12 md:col-4 lg:col-3"
        style={{ background: "lightgreen" }}
      >
        Card 2
      </div>
      <div
        className="col-12 md:col-4 lg:col-3"
        style={{ background: "lightpink" }}
      >
        Card 3
      </div>
    </div>
  );
}
