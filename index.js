import * as app from "easy-educational-games"
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.startServer(path.join(__dirname,"public"))