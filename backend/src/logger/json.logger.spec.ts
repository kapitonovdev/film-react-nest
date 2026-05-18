import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.formatMessage', () => {
    it('should format log data as a JSON string', () => {
      const formatted = logger.formatMessage(
        'log',
        'Application started',
        'Bootstrap',
      );

      expect(JSON.parse(formatted)).toEqual({
        level: 'log',
        message: 'Application started',
        optionalParams: ['Bootstrap'],
      });
    });

    it('should serialize errors with useful fields', () => {
      const error = new Error('Database is unavailable');

      const formatted = logger.formatMessage('error', error);

      expect(JSON.parse(formatted)).toMatchObject({
        level: 'error',
        message: {
          name: 'Error',
          message: 'Database is unavailable',
        },
        optionalParams: [],
      });
    });
  });

  describe('console output methods', () => {
    it('should write log level messages to console.log', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('Hello', 'Context');

      expect(logSpy).toHaveBeenCalledWith(
        logger.formatMessage('log', 'Hello', 'Context'),
      );
    });

    it('should write error level messages to console.error', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('Failure', 'Trace');

      expect(errorSpy).toHaveBeenCalledWith(
        logger.formatMessage('error', 'Failure', 'Trace'),
      );
    });

    it('should write warn level messages to console.warn', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('Warning');

      expect(warnSpy).toHaveBeenCalledWith(
        logger.formatMessage('warn', 'Warning'),
      );
    });
  });
});
