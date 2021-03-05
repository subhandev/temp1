import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JwtService {

  private qlikConfig = new BehaviorSubject<any>(undefined);
  qlikConfig$ = this.qlikConfig.asObservable();

  privateKeyFile = 'assets/privatekey.pem';

  private payload = {
    sub: environment.keyId,
    subType: environment.subType,
    name: environment.name,
    email: environment.email,
    email_verified: true,
    groups: ['Administrators', 'Sales', 'Marketing, Developer'],
  };

  // keyid and issuer has to match IdP config in Qlik
  // audience has to be qlik.api/jwt-login-session
  private signingOptions = {
    keyid: environment.keyId,
    algorithm: environment.algorithm,
    issuer: environment.host,
    expiresIn: environment.expiresIn,
    audience: environment.audience,
  } as jwt.SignOptions;

  constructor(private http: HttpClient) { }

  public GetQlikConfig(): any {
    this.http.get(this.privateKeyFile, {responseType: 'text'}).subscribe(key => {
        const token = jwt.sign(this.payload, key, this.signingOptions);
        const webIntegrationId = environment.webIntegrationId;
        const config = {
          host: environment.host,
          secure: true,
          port: environment.port,
          prefix: '',
          appId: environment.appId,
          webIntegrationId,
          token,
        };
        console.log(config);
        this.qlikConfig.next(config);
    },
    error => {
      console.log(`Error: ${error}`);
    });
  }
}
