import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chat = new ReplaySubject<any>();
  public selectedChatId = this.chat.asObservable();
  public user = new ReplaySubject<any>();
  public userId = this.user.asObservable();

  public userIdValue: string;
  public messageIdValue: string;

  public message = new BehaviorSubject<any>({});
  public messages = this.message.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.subscribeToId();
  }

  subscribeToId() {
    this.userId.subscribe((data) => {
      if(data) {
        this.userIdValue = data;
        console.log(this.userIdValue);
      }
    })

    this.selectedChatId.subscribe((data) => {
      if(data) {
        this.messageIdValue = data;
        console.log(this.messageIdValue);
      }
    })
  }

  getstring() {
    console.log(this.userIdValue);
    return this.userIdValue;
  }

  setMessageId(id: string) {
    this.chat.next(id)
  }

  setUserId(id: string) {
    this.user.next(id)
  }

  getChatList(user: string) {
    console.log(user);
    return this.firestore
      .collection('users')
      .doc(user)
      .collection('messages')
      .snapshotChanges()
  }

  getChat(user: string, messageId: string) {
    return this.firestore
      .collection('users')
      .doc(user)
      .collection('messages')
      .doc(messageId)
      .collection('chat', ref => ref.orderBy('createAt'))
      .snapshotChanges()
  }
}

