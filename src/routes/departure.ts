import * as express from 'express';
import { getDepartureTimesController } from '../controllers/departure';

const router = express.Router();

router.get('/departure_times', getDepartureTimesController);

export default router;
