import axios from 'axios';

export class UtilsServive {
  async geocodeAddress(address: string) {
    const geocodeApiKey = process.env.GEOCODE_API_KEY;
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${geocodeApiKey}`;

    try {
      const response = await axios.get(geocodeUrl);
      const { lat, lng } = response.data.results[0].geometry;
      console.log(lat, lng);
      return { lat, lng };
    } catch (error) {
      console.error(`Error geocoding address: ${error}`);
      throw new Error('Failed to geocode address');
    }
  }

  async getDepartureTimes(lat: number, lon: number) {
    const api_key = process.env.API_KEY;
    const agency = 'SF';
    const stopMonitoringUrl = `http://api.511.org/transit/StopMonitoring?api_key=${api_key}&agency=${agency}&format=json`;

    try {
      const response = await axios.get(stopMonitoringUrl);

      
    

      const departures =
        response.data.ServiceDelivery.StopMonitoringDelivery
          .MonitoredStopVisit;
      const nearbyDepartures = departures.filter((visit: any) => {
        const stopLat =
          visit.MonitoredVehicleJourney.VehicleLocation.Latitude;
        const stopLng =
          visit.MonitoredVehicleJourney.VehicleLocation.Longitude;
        return this.isWithinProximity(lat, lon, stopLat, stopLng);
      });

      return nearbyDepartures;
      return 'ok';
    } catch (e) {
      console.error(`Error fetching departure times: ${e}`);
      throw new Error('Error fetching near by departures');
    }
  }

  isWithinProximity(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    radius = 0.5,
  ) {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c <= radius;
  }
}

// {
//   RecordedAtTime: '2024-05-28T11:18:56Z',
//   MonitoringRef: '15625',
//   MonitoredVehicleJourney: {
//     LineRef: '14',
//     DirectionRef: 'OB',
//     FramedVehicleJourneyRef: {
//       DataFrameRef: '2024-05-28',
//       DatedVehicleJourneyRef: '11486853_M12'
//     },
//     PublishedLineName: 'MISSION',
//     OperatorRef: 'SF',
//     OriginRef: '16498',
//     OriginName: 'Steuart St & Mission St',
//     DestinationRef: '17099',
//     DestinationName: 'Mission St & San Jose Ave',
//     Monitored: true,
//     InCongestion: null,
//     VehicleLocation: { Longitude: '-122.426712', Latitude: '37.7334213' },
//     Bearing: '210.0000000000',
//     Occupancy: 'seatsAvailable',
//     VehicleRef: '7256',
//     MonitoredCall: {
//       StopPointRef: '15625',
//       StopPointName: 'Mission St & Trumbull St',
//       VehicleLocationAtStop: '',
//       VehicleAtStop: 'false',
//       DestinationDisplay: 'Daly City',
//       AimedArrivalTime: '2024-05-28T11:16:19Z',
//       ExpectedArrivalTime: '2024-05-28T11:19:03Z',
//       AimedDepartureTime: '2024-05-28T11:16:19Z',
//       ExpectedDepartureTime: null,
//       Distances: ''
//     }
//   }
// }
