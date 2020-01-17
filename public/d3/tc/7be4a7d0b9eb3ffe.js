// URL: https://beta.observablehq.com/d/7be4a7d0b9eb3ffe
// Title: Voronoi Particles
// Author: zhuqiang (@zq1988626)
// Version: 98
// Runtime version: 1

const m0 = {
  id: "7be4a7d0b9eb3ffe@98",
  variables: [
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`# Voronoi Particles

Some particles on a random walk, with their Voronoi diagram.`
        )
      })
    },
    {
      name: "canvas",
      inputs: ["DOM", "width", "height", "n", "d3"],
      value: (function* (DOM, width, height, n, d3) {
        const context = DOM.context2d(width, height);
        const margin = 60;
        const particles = Array.from({ length: n }, () => [Math.random() * width, Math.random() * height, 0, 0]);
        context.strokeStyle = "red";
        while (true) {
          const delaunay = new d3.Delaunay.from(particles);
          const voronoi = delaunay.voronoi([0, 0, width, height]);
          context.save();
          context.clearRect(0, 0, width, height);
          context.beginPath();
          delaunay.renderPoints(context);
          context.fill();
          context.beginPath();
          voronoi.render(context);
          context.stroke();
          yield context.canvas;
          for (const p of particles) {
            p[0] += p[2];
            p[1] += p[3];
            if (p[0] < -margin) p[0] += width + margin * 2;
            else if (p[0] > width + margin) p[0] -= width + margin * 2;
            if (p[1] < -margin) p[1] += height + margin * 2;
            else if (p[1] > height + margin) p[1] -= height + margin * 2;
            p[2] += 0.2 * (Math.random() - 0.5) - 0.01 * p[2];
            p[3] += 0.2 * (Math.random() - 0.5) - 0.01 * p[3];
          }
        }
      }
      )
    },
    {
      name: "height",
      value: (function () {
        return (
          600
        )
      })
    },
    {
      name: "n",
      value: (function () {
        return (
          200
        )
      })
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function (require) {
        return (
          require("d3-delaunay@4")
        )
      })
    }
  ]
};

const notebook = {
  id: "7be4a7d0b9eb3ffe@98",
  modules: [m0]
};

export default notebook;
