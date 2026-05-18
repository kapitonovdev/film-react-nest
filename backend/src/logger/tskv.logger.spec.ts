import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.formatMessage', () => {
    it('should format log data as tab-separated key-value fields', () => {
      expect(logger.formatMessage('log', 'Application started')).toBe(
        'level=log\tmessage=Application started\toptionalParams=[]',
      );
    });

    it('should escape tabs, new lines and equal signs in values', () => {
      expect(logger.formatMessage('warn', 'a=b\tc\nd')).toBe(
        'level=warn\tmessage=a\\=b\\tc\\nd\toptionalParams=[]',
      );
    });

    it('should serialize optional params into a string value', () => {
      expect(logger.formatMessage('debug', 'Payload', { id: 1 })).toBe(
        'level=debug\tmessage=Payload\toptionalParams=[{"id":1}]',
      );
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

      logger.error('Failure');

      expect(errorSpy).toHaveBeenCalledWith(
        logger.formatMessage('error', 'Failure'),
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
