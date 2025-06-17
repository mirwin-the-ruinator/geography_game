import Props from './types';

const RegionAccuracy = ({ regionAccuracy }: Props) => (
  <div>
    <h2 className="text-xl underline">Region Accuracy</h2>
    <ul>
      {Object.entries(regionAccuracy).map(([region, rate]) => (
        <li key={region}>
          {region}: {(rate * 100).toFixed(1)}%
        </li>
      ))}
    </ul>
  </div>
);

export default RegionAccuracy;
