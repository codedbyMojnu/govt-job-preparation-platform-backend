import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { AuthService } from '../../domain/auth.service.js';
import type {
  LoginInput,
  SendOtpInput,
  SetPasswordInput,
  VerifyOtpInput,
} from '../../domain/types.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const input: SendOtpInput = req.body;
    const result = await this.authService.sendOtp(input);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const input: VerifyOtpInput = req.body;
    const result = await this.authService.verifyOtp(input);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async register(req: Request, res: Response): Promise<void> {
    const input: SetPasswordInput = req.body;
    const result = await this.authService.register(input);
    res.status(HttpStatus.CREATED).json({ data: result });
  }

  async login(req: Request, res: Response): Promise<void> {
    const input: LoginInput = req.body;
    const result = await this.authService.login(input);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const input: SetPasswordInput = req.body;
    const result = await this.authService.resetPassword(input);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const user = await this.authService.getMe(userId);
    res.status(HttpStatus.OK).json({ data: user });
  }
}
