import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Repository } from './repository';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Basic Y2xhdWJlci5mZXJyZWlyYUBnbWFpbC5jb206TG5sMDQzMztM' })
};

@Injectable({
  providedIn: 'root'
})

export class AppService {

  constructor(private http: HttpClient) { }
  
  getRepositories(search: string, reposFav: Repository[]): Repository[] {
  	let repositories = [];
	
	this.http.post<Repository[]>('https://api.github.com/graphql', {"query": "query($query:String!) { search(query:$query, type:REPOSITORY, first: 10) { edges { node { ... on Repository { nameWithOwner url primaryLanguage { name } tags: refs(refPrefix: \"refs/tags/\", last: 1) { edges { tag: node { name } } } } } } } }", "variables": { "query": "name:" + search } }, httpOptions).subscribe(obj => {
        
		for (let edge of obj['data']['search']['edges']) {
			let repository = new Repository();
			repository.name = edge['node']['nameWithOwner'];
			repository.language = edge['node']['primaryLanguage'] ? edge['node']['primaryLanguage']['name'] : "";
			repository.latestTag = edge['node']['tags']['edges'][0] ? edge['node']['tags']['edges'][0]['tag']['name'] : "";
			repository.url = edge['node']['url'];
        	repositories.push(repository);
		}
      	this.updateFavouritedRepositories(reposFav, repositories);
      });
  	
	return repositories;
  }
  
  updateFavouritedRepositories(reposFav: Repository[], repos: Repository[]) {
  	for (let repoFav of reposFav) {
    	for (let repo of repos) {
			if (repo.name == repoFav.name) {
				repo.favourited = true;
			}
		}
	}
  }
}
