import type { Component } from 'solid-js';
import generalData from './res/general.json';
import dateTimeData from './res/date-time.json';

const Banner: Component = () => {
  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'center',
        'align-items': 'center',
        'min-height': '100vh',
      }}
    >
      <h1 style={{ 'font-size': '5rem' }}>Welcome!</h1>
      <img src="preview.png" alt="Movie Night Preview Banner" />
      <div>
        <h2>
          {generalData.food} : {dateTimeData.time1}
        </h2>
        <h2>
          {generalData.film} : {dateTimeData.time2}
        </h2>
        <h3>{generalData.helpYourself}</h3>
      </div>
    </div>
  );
};

export default Banner;
