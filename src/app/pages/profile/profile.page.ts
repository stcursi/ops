import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, LoadingController} from '@ionic/angular';

import {User} from '../../models/user';

import {LoginPage} from '../login/login.page';

import {AuthService} from '../../services/auth/auth.service';
import {FriendshipService} from '../../services/friendship/friendship.service';
import {Friendship} from '../../models/friendship';
import {dismiss, showLoader} from '../../util';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

    currentUser: User;
    setFriends: Friendship[];
    friends: User[];
    requests: User[];

    constructor(public navCtrl: NavController, public authService: AuthService, public loadingCtrl: LoadingController,
                public friendProvider: FriendshipService) {

        this.currentUser = authService.currentUser;
        this.setFriends = [];
        this.friends = [];
        this.requests = [];
    }

    ngOnInit() {
        showLoader(this.loadingCtrl).then(() => {
            this.getAllFriends();
            this.getAllRequests();
            dismiss(this.loadingCtrl);
        });
    }

    getAllFriends() {

        const details = {
            _id: this.currentUser._id,
            accepted: true
        };
        console.log('amici');

        this.friendProvider.getAllFriends(details).subscribe(response => {
            console.log(response);
            this.setFriends = response;
            this.usersFromSubscribes(this.setFriends, false);
        });

    }

    getAllRequests() {

        const details = {
            _id: this.currentUser._id,
            accepted: false
        };
        console.log('richieste di amicizia ');

        this.friendProvider.getPendingRequests(details).subscribe(response => {
            console.log(response);
            this.setFriends = response;
            this.usersFromSubscribes(this.setFriends, true);
        });
    }

    usersFromSubscribes(set: Friendship[], pending: Boolean) {

        const arrayIds = [];
        set.forEach(element => {
            arrayIds.push(element.request_to);
        });


        this.friendProvider.getUsersFromFriends(arrayIds).subscribe(response => {
            if (pending) {
                console.log(response);
                this.requests = response;
            } else {
                this.friends = response;
            }
        });
    }

    // showFriends() {
    //     this.navCtrl.push(Friends, {
    //         all_friends: this.friends
    //     });
    // }
    //
    // showFriendRequest() {
    //     this.navCtrl.push(Pending, {
    //         pending_users : this.requests,
    //         pending_friendship : this.setFriends
    //     })
    // }


    logout() {
        this.authService.logout();
    }

    get avatarPath() {
        if (this.currentUser.img) {
            return this.currentUser.img;
        }
        return '../../../assets/images/profie.jpeg';
    }

}
