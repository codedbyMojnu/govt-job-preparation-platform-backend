import type { Logger } from 'pino';

export interface SmsConfig {
  apiKey: string;
  userName: string;
  senderName: string;
  nodeEnv: 'development' | 'production' | 'test';
}

export interface SmsService {
  send(mobile: string, message: string): Promise<void>;
}

const MIMSMS_API_URL = 'https://api.mimsms.com/api/SmsSending/SMS';

export function createSmsService(logger: Logger, smsConfig: SmsConfig): SmsService {
  return {
    async send(mobile: string, message: string): Promise<void> {
      const number = mobile.startsWith('88') ? mobile : `88${mobile}`;

      if (smsConfig.nodeEnv === 'development') {
        const otp = message.match(/OTP is: (\d+)/)?.[1] ?? 'unknown';
        console.log(`\n[DEV OTP] Mobile: ${number} | Code: ${otp}\n`);
        logger.info({ mobile: number, otp }, '[SMS] Development mode — OTP logged (MiMSMS skipped)');
        return;
      }

      logger.info({ mobile: number }, '[SMS] Sending OTP via MimSMS');

      const response = await fetch(MIMSMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ApiKey: smsConfig.apiKey,
          UserName: smsConfig.userName,
          MobileNumber: number,
          SenderName: smsConfig.senderName,
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
