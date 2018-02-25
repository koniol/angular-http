import { Injectable } from '@angular/core';
import { Post } from './app.component';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class HttpServis {

  private root = 'https://jsonplaceholder.typicode.com/';


  private postsObs = new BehaviorSubject<Array<Post>>([]);
  posts$ = this.postsObs.asObservable();

  constructor(private http: HttpClient) {
    this.getPostsObsBeh();
  }

  getPostsObsBeh() {
    return this.http.get<Array<Post>>(this.root + 'posts').subscribe(
      posts => {
        this.postsObs.next(posts);
      },
      err => {
        console.log(err);
      }
    );
  }

  getPosts(): Observable<Array<Post>> {
    return this.http.get<Array<Post>>(this.root + 'posts');
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(this.root + 'posts/' + id.toString());
  }

  getPostAsResponse(id: number): Observable<HttpResponse<Response>> {
    return this.http.get<Response>(this.root + 'posts/' + id.toString(),
    {observe: 'response'});
  }

  getPostComment(postId): Observable<Array<Post>> {
    return this.http.get<Array<Post>>(this.root + 'posts/' + postId.toString() + '/comments');
  }

  getPostByUser(userId: number): Observable<Array<Post>> {
    const param = new HttpParams().set('userId', userId + '');
    return this.http.get<Array<Post>>(this.root + 'posts', { params: param });
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post(this.root + 'posts', post);
  }

}
