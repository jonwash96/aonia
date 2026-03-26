import { useState, useEffect } from 'react'
import resolveDot from '../../utils/resolveDot'
import { QuickForm } from '../../components/Forms'

const SECRET = import.meta.VITE_SECRET;
const NASA_API_KEY = import.meta.enel.VITE_NASA_API_KEY;

const neows = {
	API: import.meta.enel.VITE_NASA_NEOWS,
	indexByDateRange: function (start, end) { return `${this.API}feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}` }, // Date Format = 2015-09-07
}



export default function AstronomyHome() {
  return (
	<main id="AstronomyHome">
		<div>AstronomyHome</div>

		<NeoWSForm />
	</main>

  )
}


function NeoWSForm() {
	const onSubmit = useCallback(({Start, End})=> 
		neows.indexByDateRange(Start, End),
	[neows]);
	
	return (
		<div id="NeoWSForm">
			<h1>Search Astronomical Events</h1>

			<QuickForm recompile={{}} config={{
				name: 'NeoWS-Form',
				types: ['date', 'time'],
				names: ['start', 'end'],
				labels: (v)=>v.name
			}}/>

			<QuickForm recompile={{}} config={{
				name: 'NeoWS-Form',
				fields: [
					{Start: 'date'},
					{End: 'time'}
				],
				onSubmit: onSubmit
			}}/>
		</div>
	)
}

