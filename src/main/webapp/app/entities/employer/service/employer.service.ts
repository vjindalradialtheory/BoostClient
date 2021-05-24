import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmployer, getEmployerIdentifier } from '../employer.model';

export type EntityResponseType = HttpResponse<IEmployer>;
export type EntityArrayResponseType = HttpResponse<IEmployer[]>;

@Injectable({ providedIn: 'root' })
export class EmployerService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/employers');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(employer: IEmployer): Observable<EntityResponseType> {
    return this.http.post<IEmployer>(this.resourceUrl, employer, { observe: 'response' });
  }

  update(employer: IEmployer): Observable<EntityResponseType> {
    return this.http.put<IEmployer>(`${this.resourceUrl}/${getEmployerIdentifier(employer) as number}`, employer, { observe: 'response' });
  }

  partialUpdate(employer: IEmployer): Observable<EntityResponseType> {
    return this.http.patch<IEmployer>(`${this.resourceUrl}/${getEmployerIdentifier(employer) as number}`, employer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmployer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmployerToCollectionIfMissing(employerCollection: IEmployer[], ...employersToCheck: (IEmployer | null | undefined)[]): IEmployer[] {
    const employers: IEmployer[] = employersToCheck.filter(isPresent);
    if (employers.length > 0) {
      const employerCollectionIdentifiers = employerCollection.map(employerItem => getEmployerIdentifier(employerItem)!);
      const employersToAdd = employers.filter(employerItem => {
        const employerIdentifier = getEmployerIdentifier(employerItem);
        if (employerIdentifier == null || employerCollectionIdentifiers.includes(employerIdentifier)) {
          return false;
        }
        employerCollectionIdentifiers.push(employerIdentifier);
        return true;
      });
      return [...employersToAdd, ...employerCollection];
    }
    return employerCollection;
  }
}
