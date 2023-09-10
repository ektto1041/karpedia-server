import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { And, ArrayContains, DataSource, DeleteResult, In, Like, QueryBuilder, Repository, SelectQueryBuilder, Transaction, UpdateResult } from 'typeorm';

@Injectable()
export class AuthsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verifyAccessToken(accessToken: string) {
    try {
      const verifiedResult = this.httpService.get('https://www.googleapis.com/oauth2/v1/tokeninfo', { headers: { Authorization: `Bearer ${accessToken}` }});

      // TODO: What is Observable?
      await verifiedResult.forEach(res => {});
    } catch(e) {
      return false;
    }
    
    return true;
  }

  async refreshAccessToken(refreshToken: string) {
    const body = {
      client_id: this.configService.get('GOOGLE_CLIENT_ID'),
      client_secret: this.configService.get('GOOGLE_SECRET'),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    let newAccessToken = '';
    try {
      const refreshResult = this.httpService.post('https://oauth2.googleapis.com/token', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
      });

      await refreshResult.forEach(res => { newAccessToken = res.data.access_token; });
    } catch(e) {
      newAccessToken = '';
    }
    
    return newAccessToken;
  }

  getGoogleUserInfo(accessToken: string): Observable<AxiosResponse<any>> {
    return this.httpService.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', { headers: { Authorization: `Bearer ${accessToken}` } });
  }
}
