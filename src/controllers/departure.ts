import { Request, Response } from 'express';
import { UtilsServive } from '../services/utils';

const utilsService = new UtilsServive();

/**
 * @swagger
 * /departure_times:
 *   get:
 *     summary: Get real-time departure times for public transportation
 *     parameters:
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Address or zip code to get departure times for
 *     responses:
 *       200:
 *         description: A list of departure times
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   RecordedAtTime:
 *                     type: string
 *                     description: The time the data was recorded
 *                   MonitoringRef:
 *                     type: string
 *                     description: The reference ID of the stop
 *                   MonitoredVehicleJourney:
 *                     type: object
 *                     properties:
 *                       LineRef:
 *                         type: string
 *                         description: The line reference
 *                       DirectionRef:
 *                         type: string
 *                         description: The direction reference
 *                       FramedVehicleJourneyRef:
 *                         type: object
 *                         properties:
 *                           DataFrameRef:
 *                             type: string
 *                             description: The date of the journey
 *                           DatedVehicleJourneyRef:
 *                             type: string
 *                             description: The dated vehicle journey reference
 *                       PublishedLineName:
 *                         type: string
 *                         description: The published line name
 *                       OperatorRef:
 *                         type: string
 *                         description: The operator reference
 *                       OriginRef:
 *                         type: string
 *                         description: The origin reference
 *                       OriginName:
 *                         type: string
 *                         description: The origin name
 *                       DestinationRef:
 *                         type: string
 *                         description: The destination reference
 *                       DestinationName:
 *                         type: string
 *                         description: The destination name
 *                       Monitored:
 *                         type: boolean
 *                         description: Whether the vehicle is being monitored
 *                       InCongestion:
 *                         type: boolean
 *                         description: Whether the vehicle is in congestion
 *                       VehicleLocation:
 *                         type: object
 *                         properties:
 *                           Longitude:
 *                             type: string
 *                             description: The longitude of the vehicle
 *                           Latitude:
 *                             type: string
 *                             description: The latitude of the vehicle
 *     500:
 *       description: Error fetching departure times
 */



export const getDepartureTimesController = async (
  req: Request,
  res: Response,
) => {
  const { address } = req.query;
  try {
    const { lat, lng } = await utilsService.geocodeAddress(address as string);
    const departureTimes = await utilsService.getDepartureTimes(lat, lng);
    return res.status(200).send({ data: departureTimes });
  } catch (e: any) {
    return res.status(500).send({ error: e.message });
  }
};
