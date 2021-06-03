import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable()
export class StateService {

  public chat: any;

  constructor(private firestore: AngularFirestore) {

  }


  getChat(id: string, userId: string) {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('messages')
      .doc(id)
      .collection('chat')
      .get()
  }
}

