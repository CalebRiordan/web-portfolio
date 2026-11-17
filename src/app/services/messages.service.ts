import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../environment';
import { CreateMessageModel, Message } from '../models/message';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  baseApiUrl: string = env.baseApiUrl;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseApiUrl}/api/messages`).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  addMessage(message: CreateMessageModel): Observable<Message> {
    return this.http.post<Message>(`${this.baseApiUrl}/api/messages`, message);
  }

  deleteMessage(id: string): Observable<HttpResponse<any>>{
    return this.http.delete<any>(`${this.baseApiUrl}/api/messages/${id}`, {observe: 'response'}).pipe(
      catchError(err => {
        return throwError(() => err);
      }));
  }
}
