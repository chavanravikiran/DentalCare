import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsiteDetails } from '@shared/models/websiteDetails.model';
import { DoctorSlot } from 'app/core/services/rdv-utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
   private baseUrl = 'http://localhost:8088/api/v1/website';

  constructor(private http: HttpClient) {}

  getWebsiteDetails(websiteName: string): Observable<WebsiteDetails> {

    const params = new HttpParams().set('websiteName', websiteName);

    return this.http.get<WebsiteDetails>(
      `${this.baseUrl}/getWebsite`,
      { params }
    );
  }

  getDoctorSlots(doctorId:number,date:string){
      return this.http.get<DoctorSlot[]>(
        `${this.baseUrl}/slots/available`,
        {params:{doctorId:doctorId,date:date}}
      );
    }

}
