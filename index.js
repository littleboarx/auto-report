import loop from "./loop.js";
import env from 'dotenv';
env.config();
const INTERVAL_TIMEOUT = 24* 60 * 60 *1000;
setTimeout(  () => {
    loop();
    setInterval(loop, INTERVAL_TIMEOUT)

}, 21 * 60 * 60 *1000)
loop();
