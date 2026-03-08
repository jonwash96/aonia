import { useState, useMemo } from 'react'
import '../../utils/bancroft-proto.js'
import { quickSort } from '../../utils/gizmo.js'



export default function WeatherTable({props}) {
	const { data } = props;

	if (!data) return <div className="weather-table-loading">Loading...</div>;

	const { time, ...metrics } = data;
	const columns = Object.keys(metrics);

	
	const sortedTemps = useMemo(() => quickSort(data.temperature), [data]);

	const stats = {
		temperature: {
			high: sortedTemps?.at(-1) || 0,
			mid: sortedTemps?.[sortedTemps.length/2],
			midCalc: (temp) => ((temp - stats.temperature.low) / stats.temperature.high) * 100,
			low: sortedTemps?.[0] || 0,
			style: function(v) {return ({background: `linear-gradient(to right, #39a9db 0%, #5969fb ${this.midCalc(v)-10}%, #f65290 ${this.midCalc(v)+10}%, #d63230 100%)`})}
		},

	}

	const handleStyle = (col, value) => {
		if (stats[col]) return stats[col].style(value)
		else return undefined
	}
	
	
	const rainLevels = ['_', '▂', '▅', '█'];
	const visualizeRain = str => (
		<div className="rainspot">
			{[...str].map(n => rainLevels[n] || '_').join('')}
		</div> )


	return (
		<main className="WeatherTable">
			<table className="weather-table">
				<thead>
					<tr>
						<th>Time</th>
						{columns.map(col =>
							<th key={col}>{col.replaceAll('_', ' ')._toTitleCase()}</th>
						)}
					</tr>
				</thead>

				<tbody>
					{time.map((t, rowIdx) => (
						<tr key={rowIdx}>
							<td className="time">{new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>

							{columns.map(col => {
								const value = metrics[col]?.[rowIdx];
								return (
									<td key={col + rowIdx} 
										className={col}
										style={handleStyle(col, parseFloat(value))}
									>
										{ col === 'rainspot'
											? visualizeRain(value)
											: value }
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</main>
	)
}
