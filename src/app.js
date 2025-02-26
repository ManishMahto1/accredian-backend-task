import express from 'express';
import referralRoutes from './accredian-backend-task/src/routes/referralRouter.js';
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config()
const app = express();
import cors from 'cors';
app.use(express.json());
app.use(cors());
app.use('/api', referralRoutes);
// buildIn express middlewares
app.use(cors());
// Body Parser Middleware
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

 export default app;