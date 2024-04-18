// utils.service.ts
import { Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { StatusColor } from '../../../src/types';
import { DiagnosticRate } from '../../../src/constants/enums';
import { Request, Response } from 'express';
import * as EventSource from 'eventsource';

@Injectable()
export class UtilsService {
  constructor(private httpService: HttpService) {}

  async sendHttpRequest<T>(data: {url: string, method?: Method, config?: AxiosRequestConfig}): Promise<AxiosResponse> {
    const { url, method = 'GET', config } = data
    const observable$ = this.httpService.request({
      url,
      method,
      ...config
    } as any);
    return firstValueFrom(observable$);
  }

  getHealthStatus(statuses: StatusColor[]) {
    return statuses.includes(StatusColor.ERROR)
      ? StatusColor.ERROR
      : statuses.includes(StatusColor.WARNING)
        ? StatusColor.WARNING
        : StatusColor.SUCCESS
  }

  getHealthCondition(status: StatusColor) {
    return status === StatusColor.ERROR
      ? DiagnosticRate.POOR
      : status === StatusColor.WARNING
        ? DiagnosticRate.FAIR
        : DiagnosticRate.GOOD
  }

  handleSse(req: Request, res: Response, url: string) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();

    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      res.write(`data: ${event.data}\n\n`);
    };

    const heartbeatInterval = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 10000);

    eventSource.onerror = () => {
      console.error('EventSource failed');
      clearInterval(heartbeatInterval);
      eventSource.close();
      res.end();
    };

    req.on('close', () => {
      console.error('Request closed...');
      clearInterval(heartbeatInterval);
      eventSource.close();
      res.end();
    });
  }
}
