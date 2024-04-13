import tracer from "tracer";
const logger = tracer.colorConsole();

logger.log("hello"); // white
logger.trace("hello"); // violet
logger.debug("hello"); // blue
logger.info("hello"); // green
logger.warn("hello"); // yellow
logger.error("hello"); // red
