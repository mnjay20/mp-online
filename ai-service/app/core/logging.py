import logging
import sys

def configure_logging():
    log_format = "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s"
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)]
    )

logger = logging.getLogger("ai_service")
