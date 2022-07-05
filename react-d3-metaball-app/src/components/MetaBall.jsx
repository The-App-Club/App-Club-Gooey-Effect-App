import {css} from '@emotion/css';
import {useEffect, useState, useRef} from 'react';
import {useCallback} from 'react';
import {useMemo} from 'react';
import * as d3 from 'd3';
import {transform} from 'framer-motion';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';

const MetaBall = ({
  size = 100,
  edgeCount = 5,
  length = size / 4,
  itemSize = 30,
  colorList = ['#F3E1E1', '#FAF2F2', '#FAB7B7', '#F5A8A8'],
  margin = {top: 15, right: 15, bottom: 15, left: 15},
}) => {
  const svgDomRef = useRef(null);

  const scaler = useCallback(
    (t) => {
      return d3.scaleLinear().domain([-1, 1]).range([-length, length])(t);
    },
    [size]
  );

  const data = useMemo(() => {
    return d3.range(edgeCount).map((num) => {
      return (num / edgeCount) * (2 * Math.PI);
    });
  }, [edgeCount]);

  useEffect(() => {
    const svgDom = d3.select(svgDomRef.current);
    //Create the circles that will move out and in the center circle
    svgDom
      .select('g')
      .selectAll('.flyCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'flyCircle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', itemSize);

    function repeat() {
      const dur = 700;
      const del = 100;
      const circles = d3.selectAll('.flyCircle');
      let c = 0;
      circles
        .transition('outward')
        .duration(dur)
        .ease(d3.easeExpOut)
        .delay(function (d, i) {
          return i * del;
        })
        .attr('cy', function (d) {
          return scaler(Math.sin(d));
        })
        .attr('cx', function (d) {
          return scaler(Math.cos(d));
        })
        .transition('inward')
        .duration(dur)
        .delay(function (d, i) {
          return edgeCount * del + i * del;
        })
        .attr('cx', 0)
        .attr('cy', 0)
        .on('end', function (e) {
          // https://stackoverflow.com/a/20773846/15972569
          // Taken from https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
          // Calls a function only after the total transition ends
          c++;
          if (c === edgeCount) {
            repeat();
          }
        });
    }
    repeat();
  }, []);
  return (
    <svg
      ref={svgDomRef}
      width={size + margin.left + margin.right}
      height={size + margin.top + margin.bottom}
      className={css`
        border: 1px solid;
      `}
    >
      <g
        transform={`translate(${size / 2 + margin.left} ${
          size / 2 + margin.top
        })`}
        filter={`url(#gooey)`}
        fill={`url(#gradient)`}
      >
        <circle className="centerCircle" cx="0" cy="0" r={itemSize}></circle>
      </g>

      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          {samples(10)
            .map((n) => {
              return {t: n};
            })
            .map((info) => {
              return {
                t: info.t,
                color: interpolate(colorList)(info.t),
              };
            })
            .map((info) => {
              return {...info, color: formatHex(info.color)};
            })
            .map((info, index) => {
              return (
                <stop
                  key={index}
                  offset={`${info.t * 100}%`}
                  stopColor={info.color}
                  stopOpacity={1}
                />
              );
            })}
        </linearGradient>
      </defs>
      <defs>
        <filter id="gooey">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="10"
            result="blur"
          ></feGaussianBlur>
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="gooey"
          ></feColorMatrix>
          <feComposite
            in="SourceGraphic"
            in2="gooey"
            operator="atop"
          ></feComposite>
        </filter>
      </defs>
    </svg>
  );
};

export {MetaBall};
