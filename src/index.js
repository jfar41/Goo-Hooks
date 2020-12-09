import React,{ useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSpring, animated } from 'react-spring';
import './index.css';
import reportWebVitals from './reportWebVitals';

const fast = { tension: 1200, friction: 40 };
const slow = { mass: 30, tension: 200, friction: 50 };
//increasing mass makes it more slow (goo-ish)

export default function Goo() {
  //here we form a natural trail, one spring following another.
  //either update springs by overwriting values when you re-render the component.
  //Or you can use the set function, which allows you to bypass React alltogether.
  //We're dealing with mouse-input here so we choose the latter in order to prevent rendering

  const [ {pos1} , set] = useSpring({ pos1: [0, 0], config:fast })
  const [ {pos2} ] = useSpring({ pos2: pos1, config: slow })
  const [ {pos3} ] = useSpring({ pos3: pos2, config: slow})

  const trans = (x, y) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

  //Effect for fetching mouse coordinates
  useEffect(() => {
    //"set" updates first spring; others then bound will follow.
    //Won't cause a new render pass and the animated values down in the view
    //will still naturall reflect animated changes
    const handler = ({ clientX, clientY }) => set({ pos1: [ clientX, clientY ]})
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [set] )

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7" />
        </filter>
      </svg>
      <div class="hooks-main">
        <div class="hooks-filter">
          <animated.div class="b1" style={{ transform: pos3.interpolate(trans) }} />
          <animated.div class="b2" style={{ transform: pos2.interpolate(trans) }} />
          <animated.div class="b3" style={{ transform: pos1.interpolate(trans) }} />
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<Goo />, document.getElementById('root'))



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
