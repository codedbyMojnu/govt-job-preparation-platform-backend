import type { Logger } from 'pino';

export interface SmsConfig {
  nodeEnv: string;
  apiKey?: string;
  userName?: string;
  senderName?: string;
}

export interface SmsService {
  send(mobile: string, message: string): Promise<void>;
}

const MIMSMS_API_URL = 'https://api.mimsms.com/api/SmsSending/SMS';

export function createSmsService(logger: Logger, smsConfig: SmsConfig): SmsService {
  return {
    async send(mobile: string, message: string): Promise<void> {
      const number = mobile.startsWith('88') ? mobile : `88${mobile}`;

      if (smsConfig.nodeEnv !== 'production') {
        console.log(`[DEV SMS] To: ${number} | Message: ${message}`);
        logger.info({ mobile: number }, '[SMS] Dev mode — OTP logged to console, not sent');
        return;
      }

      const { apiKey, userName, senderName } = smsConfig;
      if (!apiKey || !userName || !senderName) {
        throw new Error('MIMSMS credentials are required in production');
      }

      logger.info({ mobile: number }, '[SMS] Sending OTP via MimSMS');

      const response = await fetch(MIMSMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ApiKey: apiKey,
          UserName: userName,
          MobileNumber: number,
          SenderName: senderName,
          CampaignName: '',
          TransactionType: 'T',
          MessageId: '',
          Message: message,
          CampaignId: 'null',
          SmsData: null,
        }),
      });

      if (!response.ok) {
        logger.error({ status: response.status, mobile: number }, '[SMS] MimSMS request failed');
        throw new Error(`SMS sending failed with status ${response.status}`);
      }

      const result = await response.json();
      logger.info({ mobile: number, result }, '[SMS] MimSMS response');
    },
  };
}
