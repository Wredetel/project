import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { UserService } from '../user.service';

export interface Post {
  text: string;
  author: string;
  authorPhoto: string;
  photo: string;
  publishDate: Date;
}

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent {

  isAuthenticated:boolean = false;

  posts: Post[] = [];
  baseUrl="";

  constructor(private http: HttpClient, @Inject('BASE_API_URL' ) baseUrl: string, private userService: UserService) {
    this.updateUserInfo();
    this.userService.authChanged.subscribe(()=>this.updateUserInfo());

    this.baseUrl=baseUrl;

    http.get<Post[]>(baseUrl+'/NewsFeed').subscribe({
      next: (result) => { this.posts = result },
      error: (e) => console.error(e)

    }
    );

  }
  updateUserInfo(): void {
    this.isAuthenticated = this.userService.isAuthenticated();
  }

  loadNewsfeed() {
    this.http.get<Post[]>(this.baseUrl + '/NewsFeed').subscribe({
      next: (result) => { this.posts = result; },
      error: (e) => console.error(e)
    });
  }

  handleChildSubmitted() {
    this.loadNewsfeed();
  }

}