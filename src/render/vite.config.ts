import { fileURLToPath } from 'node:url';
import createConfig from '../vite.config';

const path = fileURLToPath(new URL('.', import.meta.url));

export default createConfig(path);
