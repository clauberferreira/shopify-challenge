import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Repository } from './repository';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  search = '';
  searchMade = false;
  repositories: Repository[];
  repositoriesFav: Repository[] = [];
  
  constructor(private appService: AppService) { }
  
  onSearch(): void {
    if (this.search != '') {		
        this.repositories = this.appService.getRepositories(this.search, this.repositoriesFav);
    }
    this.searchMade = true;
  }
  
  onCleanSearch(): void {
    if (this.search == '') {
        this.repositories = [];
        this.searchMade = false;
    }
  }
  
  onAdd(repository: Repository): void {
  	if (this.repositoriesFav.filter(repo => {
		return repo.name == repository.name;
	}).length == 0) {
		repository.favourited = true;
  		this.repositoriesFav.push(repository);
	}
  }
  
  onRemove(repository: Repository):void {
  	this.repositoriesFav = this.repositoriesFav.filter(repo => {
		return repo.name != repository.name;
	});
	
	let repo = this.repositories.filter(repo => {
		return repo.name == repository.name;
	});
	if (repo.length > 0) {
		repo[0].favourited = false;
	}
  }
}
