import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpServis } from './http.servis';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/retry';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  private root;
  private rootPost;
  allPosts$: Observable<Array<Post>>;

  constructor(private httpServis: HttpServis, private ele: ElementRef, private renderer: Renderer2) {
    this.root = this.ele.nativeElement;
    this.rootPost = this.renderer.createElement('ul');
    this.renderer.appendChild(this.root, this.rootPost);
  }

  getPostsObs() {
    this.allPosts$ = this.httpServis.getPosts();
  }

  getPostsBehavior() {
    this.allPosts$ = this.httpServis.posts$;
  }

  createPost(post: Post) {
    const li = this.renderer.createElement('li');
    li.innerHTML = '<p>' + post.id + ' ' + post.title + '</p>';
    this.renderer.appendChild(this.rootPost, li);
  }

  createComment(post) {
    const li = this.renderer.createElement('li');
    li.innerHTML = '<p>' + post.postId + ' <br>' + post.email + '<br>' + post.body + '</p>';
    this.renderer.appendChild(this.rootPost, li);
  }

  getPosts() {
    this.httpServis.getPosts().subscribe(posts => {
      posts.forEach((post) => {
        this.createPost(post);
      });
    });
  }

  /**
   * RETRY OPERARATOR
   * ERROR
   */
  getPost(id) {
    this.httpServis.getPost(id).retry(3).subscribe(post => {
      this.createPost(post);
    },
      (error): HttpErrorResponse => {
        console.log(error);
        return error;
      }
    );
  }

  getPostAsResponse(id) {
    this.httpServis.getPostAsResponse(id).subscribe(post => {
      console.log(post);
    },
      (error): HttpErrorResponse => {
        console.log(error);
        return error;
      }
    );
  }

  getPostComment(postId) {
    this.httpServis.getPostComment(postId).subscribe(posts => {
      posts.forEach((post) => {
        this.createComment(post);
      });
    });
  }

  getPostByUser(userId) {
    this.httpServis.getPostByUser(userId).subscribe(posts => {
      posts.forEach((post) => {
        this.createPost(post);
      });
    });
  }

  addPost() {
    const p: Post = ({
      userId: 1,
      id: null,
      title: 'My title',
      body: 'Post body'
    });

    this.httpServis.addPost(p).subscribe(post1 => {
      this.createPost(post1);
    });
  }

}

export interface Post {
  userId?: number;
  id?: string;
  title?: string;
  body?: string;
}
