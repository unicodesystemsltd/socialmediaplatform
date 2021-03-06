import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { DegreePage } from '../degree/degree';
import { UserService } from "../../providers/user-service";
import { CommonService } from "../../providers/common-service";
import { DataService } from '../../providers/data-service';
import { PageService } from '../../providers/page-service';
import { MyWallService } from '../../providers/my-wall-service';
import { CustomVisibiltyPage } from '../custom-visibilty/custom-visibilty';
import { Camera, FileChooser, File, FilePath,MediaCapture,MediaFile } from 'ionic-native';
import { Post } from '../../interfaces/common-interfaces';
declare function unescape(s: string): string;
/*
  Generated class for the DegreeUpdateStatusPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-degree-update-status-page',
  templateUrl: 'degree-update-status-page.html',
  providers: [UserService, CommonService, DataService, PageService, MyWallService]
})

export class DegreeUpdateStatusPagePage {
  public videoembed: boolean = true;
  public photoembed: boolean = true;
  public audioembed: boolean = true;
  public postMsgLinkQuesType = 1;
  public base64Image: string;
  private imageSrc: string;
  public photosToUpload: any[] = [];
  public documentsToUpload: any[] = [];
  public audiosToUpload: any[] = [];
  public videosToUpload: any[] = [];
  public pet: string = "Status";
  public isAndroid: boolean = false;
  public loader: boolean = false;
  public message = { name: { name: '' }, message: { message: '' }, link: { title: '', description: '' }, question: { question: '' }, date: { date: new Date() }, embedLink: { title: '', video: '', audio: '', photo: '' }, custom: [], shareCustom: [] };
  public error = { photo: '', video: '', audio: '', document: '', videoSize: '', audioSize: '', documentSize: '' };
  public catagory = 1;
  public types = 3;
  public degreeId;
  public isMember;
  public wallType = '';
  public fileData;
  public filename: string = '';
  /**Posts */
  public _dataUploadPhotosFiles = '/api/degree_post/postPhotosTypeFiles/';
  public _dataUploadDocumentsFiles = '/api/degree_post/postDocumentsTypeFiles/';
  public _dataUploadAudiosFiles = '/api/degree_post/postAudiosTypeFiles/';
  public _dataUploadVideosFiles = '/api/degree_post/postVideosTypeFiles/';
  public _addPostUrl = '/api/degree_post/postAllTypeData/';
  public _dataUploadEmbedLink = '/api/degree_post/postVideoEmbedLink/';
  public _dataUploadAudioEmbedLink = 'api/degree_post/postAudioEmbedLink/';
  public _dataUploadPhotoEmbedLink = 'api/degree_post/postPhotoEmbedLink/';
  public notiMsg: string = 'Enter your message';
  public degreePostData: Post = new Post();
  public selectedPostPrivacyType: number = 1;
  public taggedUsersIds: Array<number> = [];
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public commonService: CommonService,
    public myWallService: MyWallService,
    public viewCtrl: ViewController,
    public dataService: DataService
  ) {
    this.postMsgLinkQuesType = 1;
    this.types = 3;
    this.photosToUpload = [];
    this.documentsToUpload = [];
    this.audiosToUpload = [];
    this.videosToUpload = [];
    this.degreeId = navParams.data.degreeId;
    this.isMember = navParams.data.sub.is_member;
    this.wallType = navParams.data.wallType;
    this.pet = navParams.data.tabValue;
    this.postMsgLinkQuesType = navParams.data.postType;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DegreeUpdateStatusPagePage');
    this.imageSrc = this.dataService.apiBaseUrl + "public/files/ProfilePicture/no_image.png";
  }

  cancel() {
    console.log("in cancel", this.wallType);
    if (this.wallType == 'degreeWall') {
      let data = { wallId: this.degreeId };
      this.viewCtrl.dismiss(data);
    }
  }

  setMsgLinkQuesType(postType) {
    this.postMsgLinkQuesType = postType;
    this.message.message.message = '';
    this.message.question.question = '';
    this.message.link.description = '';
    this.message.link.title = '';
    this.message.name.name = '';
    this.message.embedLink.video = '';
    this.message.embedLink.audio = '';
    this.message.embedLink.photo = '';
    this.message.embedLink.title = '';
    this.error.photo = '';
    this.error.video = '';
    this.error.audio = '';
    this.error.videoSize = '';
    this.error.audioSize = '';
    this.error.document = '';
    this.error.documentSize = '';
     this.photosToUpload = [];
    this.videosToUpload = [];
    this.audiosToUpload = [];
    this.documentsToUpload = [];
  }



  pastevideoembed() {
    this.videoembed = false;
    this.photoembed = true;
    this.audioembed = true;
  }

  pastephotoembed() {
    this.videoembed = true;
    this.photoembed = false;
    this.audioembed = true;
  }

  pasteaudioembed() {
    this.videoembed = true;
    this.photoembed = true;
    this.audioembed = false;
  }

  canclevideoembed() {
    this.videoembed = true;
    this.photoembed = true;
    this.audioembed = true;
    this.message.name.name = '';
    this.message.embedLink.title = '';
    this.message.embedLink.video = '';
  }

  canclephotoembed() {

    this.videoembed = true;
    this.photoembed = true;
    this.audioembed = true;
    this.message.name.name = '';
    this.message.embedLink.title = '';
    this.message.embedLink.photo = '';
  }

  cancleaudioembed() {
    this.videoembed = true;
    this.photoembed = true;
    this.audioembed = true;
    this.message.name.name = '';
    this.message.embedLink.title = '';
    this.message.embedLink.audio = '';
  }

  addPhotoEmbedLink() {
    if (typeof (this.message.embedLink.title) != 'undefined' && (this.message.embedLink.title != "" && this.message.embedLink.title != null)) {
      if (this.validateImgURL(this.message.embedLink.title)) {
        this.message.embedLink.photo = this.message.embedLink.title;
        this.message.embedLink.title = "";
        this.commonService.showToast("Photo link added successfully.");
      } else {
        this.commonService.showToast("Invalid url!");

      }
    } else {
      this.commonService.showToast("Please paste the photo link here!");
    }
  }

  validateImgURL(textval) {
    var urlregex = /^((https?|ftp):)?\/\/.*(jpeg|jpg|png|gif|bmp)$/;
    return urlregex.test(textval);
  }

  addVideoEmbedLink() {
    if (typeof (this.message.embedLink.title) != 'undefined' && (this.message.embedLink.title != "" && this.message.embedLink.title != null)) {
      var myId = this.getId(this.message.embedLink.title);
      if (myId) {
        this.message.embedLink.video = myId;
        this.message.embedLink.title = "";
        this.commonService.showToast("Video link added successfully.");
      } else {
        this.commonService.showToast("Invalid url!");
      }
    } else {
      this.commonService.showToast("Please paste the youtube link here!");
    }
  }

  getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return false;
    }
  }

  addAudioEmbedLink() {
    if (typeof (this.message.embedLink.title) != 'undefined' && (this.message.embedLink.title != "" && this.message.embedLink.title != null)) {
      if (this.validateURL(this.message.embedLink.title)) {
        this.message.embedLink.audio = this.message.embedLink.title;
        this.message.embedLink.title = "";
        this.commonService.showToast("Audio link added successfully.");
      } else {
        this.commonService.showToast("Invalid url!");
      }
    } else {
      this.commonService.showToast("Please paste the audio link here!");
    }
  }

  onPostAllTypeData() {
    if (this.isMember) {
      this.degreePostData.privacy = this.selectedPostPrivacyType;
      this.degreePostData.types = this.types;
      this.degreePostData.catagory = this.catagory;
      this.degreePostData.created_on = new Date();
      this.degreePostData.custom = this.selectedPostPrivacyType == 5 ? this.taggedUsersIds : [];
      if (typeof (this.photosToUpload) != 'undefined' && this.photosToUpload.length > 0) {
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.photo = this.photosToUpload;
        this.degreePostData.post_type = 3;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.dataService.wallPostFormData(this._dataUploadPhotosFiles + this.degreeId, this.degreePostData)
          .subscribe((result) => {
            if (result['status'] == 2) {
              this.loader = false;
              this.photosToUpload = [];
              this.degreePostData = new Post();
              this.message.name.name = '';
              this.catagory = 1;
              this.selectedPostPrivacyType = 1;
              this.taggedUsersIds = [];
              if (this.wallType == 'degreeWall') {
                let data = { wallId: this.degreeId };
                this.viewCtrl.dismiss(data);
              }
              this.commonService.showToast(result.msg);
            }
          });
      }
      else if (typeof (this.videosToUpload) != 'undefined' && this.videosToUpload.length > 0) {
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.post_type = 4;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.degreePostData.video = this.videosToUpload;
        this.dataService.wallPostFormData(this._dataUploadVideosFiles + this.degreeId, this.degreePostData).subscribe((result) => {
          if (result['status'] == 2) {
            this.taggedUsersIds = [];
            this.selectedPostPrivacyType = 1;
            this.degreePostData = new Post();
            this.loader = false;
            this.videosToUpload = [];
            this.message.name.name = '';
            this.catagory = 1;
            if (this.wallType == 'degreeWall') {
              let data = { wallId: this.degreeId };
              this.viewCtrl.dismiss(data);
            }
            this.commonService.showToast(result.msg);
          }
        })
      }
      else if (typeof (this.audiosToUpload) != 'undefined' && this.audiosToUpload.length > 0) {
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.degreePostData.audio = this.audiosToUpload;
        this.degreePostData.post_type = 6;
        this.dataService.wallPostFormData(this._dataUploadAudiosFiles + this.degreeId, this.degreePostData).subscribe((result) => {
          if (result['status'] == 2) {
            this.taggedUsersIds = [];
            this.selectedPostPrivacyType = 1;
            this.degreePostData = new Post();
            this.loader = false;
            this.audiosToUpload = [];
            this.message.name.name = '';
            this.catagory = 1;
            if (this.wallType == 'degreeWall') {
              let data = { wallId: this.degreeId };
              this.viewCtrl.dismiss(data);
            }
            this.commonService.showToast(result.msg);
          }
        })
      }
      else if (typeof (this.documentsToUpload) != 'undefined' && this.documentsToUpload.length > 0) {
        console.log("from document");
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.post_type = 7;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.degreePostData.document = this.documentsToUpload;
        this.dataService.wallPostFormData(this._dataUploadDocumentsFiles + this.degreeId, this.degreePostData).subscribe((result) => {
          if (result['status'] == 2) {
            this.taggedUsersIds = [];
            this.selectedPostPrivacyType = 1;
            this.degreePostData = new Post();
            this.loader = false;
            this.documentsToUpload = [];
            this.message.name.name = '';
            this.catagory = 1;
            if (this.wallType == 'degreeWall') {
              let data = { wallId: this.degreeId };
              this.viewCtrl.dismiss(data);
            }
            this.commonService.showToast(result.msg);
          }
        })
      }
      else if (typeof (this.message.embedLink.video) != 'undefined' && this.message.embedLink.video != '') {
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.post_type = 5;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.degreePostData.link = this.message.embedLink.video;
        this.dataService.postData(this._dataUploadEmbedLink + this.degreeId, this.degreePostData).subscribe(posts => {
          console.log("Submitted Data" + JSON.stringify(posts['data']));
          if (posts['status'] == 2) {
            this.taggedUsersIds = [];
            this.selectedPostPrivacyType = 1;
            this.degreePostData = new Post();
            this.message.embedLink.video = '';
            this.message.name.name = '';
            this.loader = false;
            this.catagory = 1;
            if (this.wallType == 'degreeWall') {
              let data = { wallId: this.degreeId };
              this.viewCtrl.dismiss(data);
            }
            this.commonService.showToast('Video uploaded successfully.');
          }
        })
      } else if (typeof (this.message.embedLink.audio) != 'undefined' && this.message.embedLink.audio != '') {
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.post_type = 5;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.degreePostData.link = this.message.embedLink.audio;
        this.dataService.postData(this._dataUploadAudioEmbedLink + this.degreeId, this.degreePostData).subscribe(posts => {
          console.log("Submitted Data" + JSON.stringify(posts['data']));
          if (posts['status'] == 2) {
            this.taggedUsersIds = [];
            this.selectedPostPrivacyType = 1;
            this.degreePostData = new Post();
            this.message.embedLink.audio = '';
            this.message.name.name = '';
            this.loader = false;
            this.catagory = 1;
            if (this.wallType == 'degreeWall') {
              let data = { wallId: this.degreeId };
              this.viewCtrl.dismiss(data);
            }
            this.commonService.showToast('Audio uploaded successfully.');
          }
        })
      } else if (typeof (this.message.embedLink.photo) != 'undefined' && this.message.embedLink.photo != '') {
        if (typeof this.message.name.name == 'undefined' || this.message.name.name == null || this.message.name.name == '')
        { this.message.name.name = null; }
        this.loader = true;
        this.degreePostData.link = this.message.embedLink.photo;
        this.degreePostData.name = this.message.name.name ? this.message.name.name.replace(/(^[ \t]*\n)/gm, "") : '';
        this.degreePostData.post_type = 5;
        this.dataService.postData(this._dataUploadPhotoEmbedLink + this.degreeId, this.degreePostData)
          .subscribe((posts) => {
            if (posts['status'] == 2) {
              this.taggedUsersIds = [];
              this.selectedPostPrivacyType = 1;
              this.degreePostData = new Post();
              console.log("response", posts);
              this.message.embedLink.photo = '';
              this.message.name.name = '';
              this.loader = false;
              this.catagory = 1;
              if (this.wallType == 'degreeWall') {
                let data = { wallId: this.degreeId };
                this.viewCtrl.dismiss(data);
              }
              this.commonService.showToast('Photo uploaded successfully.');
            }
          });
      }
      else {
        if ((this.postMsgLinkQuesType !== 0) && (this.postMsgLinkQuesType === 1) && (this.message.message.message !== '')) {
          this.degreePostData.message = this.message.message.message ? this.message.message.message.replace(/(^[ \t]*\n)/gm, "") : '';
          this.degreePostData.post_type = 1;
          this.loader = true;
          this.dataService.postData(this._addPostUrl + this.degreeId, this.degreePostData)
            .subscribe((posts) => {
              if (posts['status'] == 2) {
                console.log("response", posts);
                this.message.message.message = '';
                this.selectedPostPrivacyType = 1;
                this.catagory = 1;
                this.taggedUsersIds = [];
                this.degreePostData = new Post();
                if (this.wallType == 'degreeWall') {
                  let data = { wallId: this.degreeId };
                  this.viewCtrl.dismiss(data);
                }
                this.loader = false;
                this.commonService.showToast('Your Post has been posted successfully.');
              }
            });

        }
        else if ((this.postMsgLinkQuesType !== 0) && (this.postMsgLinkQuesType === 2) && (this.message.question.question !== '')) {
          this.degreePostData.question = this.message.question.question ? this.message.question.question.replace(/(^[ \t]*\n)/gm, "") : '';
          this.degreePostData.post_type = 2;
          this.loader = true;
          this.dataService.postData(this._addPostUrl + this.degreeId, this.degreePostData)
            .subscribe((posts) => {
              if (posts['status'] == 2) {
                console.log("response", posts);
                this.message.question.question = '';
                this.catagory = 1;
                this.selectedPostPrivacyType = 1;

                this.taggedUsersIds = [];
                this.degreePostData = new Post();
                if (this.wallType == 'degreeWall') {
                  let data = { wallId: this.degreeId };
                  this.viewCtrl.dismiss(data);
                }
                this.loader = false;
                this.commonService.showToast('Your Post has been posted successfully.');
              }
            });
        }
        else if ((this.postMsgLinkQuesType !== 0) && (this.postMsgLinkQuesType === 5) && (this.message.link.description !== '')) {
          if (this.validateLinkURL(this.message.link.description)) {
            this.degreePostData.link = this.message.link.description;
            this.degreePostData.linkTitle = this.message.link.title ? this.message.link.title.replace(/(^[ \t]*\n)/gm, "") : '';
            this.degreePostData.post_type = 5;
            this.loader = true;
            this.dataService.postData(this._addPostUrl + this.degreeId, this.degreePostData)
              .subscribe((posts) => {
                if (posts['status'] == 2) {
                  console.log("response", posts);
                  this.message.link.description = '';
                  this.message.link.title = '';
                  this.catagory = 1;
                  this.selectedPostPrivacyType = 1;
                  this.taggedUsersIds = [];
                  this.degreePostData = new Post();
                  if (this.wallType == 'degreeWall') {
                    let data = { wallId: this.degreeId };
                    this.viewCtrl.dismiss(data);
                  }
                  this.loader = false;
                  this.commonService.showToast('Your Post has been posted successfully.');
                }
              });
          }
          else {
            this.commonService.showToast("Invalid url!");
          }
        }
        else {
          this.commonService.showToast('Please fill the field');
        }
      }
    } else {
      this.commonService.showToast("Please Join Degree For Posting!");

    }
  }

  validateLinkURL(textval) {
    if(!textval.includes('http://') && !textval.includes('https://')){
      textval = 'http://'+textval;
      this.message.link.description = textval;
    }
    var urlregex = /^(https?|Https?|HTtps?|HTTps?|HTTPs?|HTTPS?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
  }

  validateURL(textval) {
    var urlregex = /^(https?|Https?|HTtps?|HTTps?|HTTPs?|HTTPS?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
  }

  selectCatagory($event) {
    this.catagory = $event;
  }

  selectVisibility($event) {
    this.degreePostData.privacy = $event;
    if (this.degreePostData.privacy == 5) {
    }
  }

  customVisiblity(visibility) {
    this.degreePostData.privacy = visibility;
    let modal = this.modalCtrl.create(CustomVisibiltyPage);
    modal.onDidDismiss(data => {
      console.log('data', data);
      if (data && data.customPostId && data.custom) {
        this.message.custom = data.custom;
        this.taggedUsersIds = data.customPostId;
      }
    });
    modal.present();
  }

  private openGallery(): void {

    this.photosToUpload = [];
    let cameraOptions = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    }
    Camera.getPicture(cameraOptions)
      .then((file_uri) => {
        this.imageSrc = file_uri;
        console.log("this.imageSrc", this.imageSrc);
        this.commonService.getFileFromUri(this.imageSrc)
          .then((file) => {
            this.photosToUpload.push(file);
            console.log('this.photosToUpload getImage');
            console.log(this.photosToUpload);
          })
          .catch((err) => {
            console.log(err);
          })
      }, (err) => {
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  takePicture() {
    this.photosToUpload = [];
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      console.log("imageData", imageData);
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.imageSrc = "data:image/jpeg;base64," + imageData;
      this.photosToUpload = [this.dataURItoBlob(this.base64Image)];
    }, (err) => {
      console.log(err);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  public dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], { type: "image/jpeg" });
  }

  documentChangeEvent(fileInput: any) {
    this.documentsToUpload = <Array<File>>fileInput.target.files;
    this.fileData = fileInput;
    if (typeof (this.documentsToUpload) != 'undefined' && this.documentsToUpload.length > 0) {
      if (this.documentsToUpload[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || this.documentsToUpload[0].type == 'application/msword' || this.documentsToUpload[0].type == 'application/pdf' || this.documentsToUpload[0].type == 'text/xml' || this.documentsToUpload[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.documentsToUpload[0].type == 'application/vnd.ms-powerpoint' || this.documentsToUpload[0].type == 'application/vnd.ms-excel' || this.documentsToUpload[0].type == 'text/plain') {
        if (this.documentsToUpload[0].size > (1024 * 1024 * 40)) {
          this.commonService.showToast("Document size should be less than 40 MB!.");
          this.documentsToUpload = [];
          this.fileData.target.value = '';
        }
      }
      else {
        this.commonService.showToast('Invalid document format!');
        this.documentsToUpload = [];
        this.fileData.target.value = '';
      }
    }
  }

  // audioChangeEvent() {
  //   FileChooser.open()
  //     .then((uripath) => {
  //       console.log('uripath', uripath);
  //       FilePath.resolveNativePath(uripath)
  //         .then((finalPath) => {
  //           console.log('successNative finalPath', finalPath);
  //           this.filename = finalPath.substring(finalPath.lastIndexOf('/') + 1);
  //           console.log('this.filename', this.filename);
  //           this.commonService.getMediaFileFromUri(finalPath, this.filename)
  //             .then((file) => {
  //               console.log('audio file', file);
  //               this.audiosToUpload.push(file);
  //               console.log('this.audiosToUpload', this.audiosToUpload);
  //               if (typeof (this.audiosToUpload) != 'undefined' && this.audiosToUpload.length > 0) {
  //                 if (this.audiosToUpload[0].type == 'audio/mpeg' || this.audiosToUpload[0].type == 'audio/ogg' || this.audiosToUpload[0].type == 'audio/wav' || this.audiosToUpload[0].type == 'audio/mp3') {
  //                   if (this.audiosToUpload[0].size > (1024 * 1024 * 5)) {
  //                     this.commonService.showToast("Audio size should be less than 5 MB!.");
  //                     this.audiosToUpload = [];
  //                   }
  //                 }
  //                 else {
  //                   this.commonService.showToast('Invalid audio format!');
  //                   this.audiosToUpload = [];
  //                 }
  //               }
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             })
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         })
  //     })
  //     .catch(e => console.log(e));
  // }

  // videoChangeEvent() {
  //   FileChooser.open()
  //     .then((uripath) => {
  //       console.log('uripath', uripath);
  //       FilePath.resolveNativePath(uripath)
  //         .then((finalPath) => {
  //           console.log('successNative finalPath', finalPath);
  //           this.filename = finalPath.substring(finalPath.lastIndexOf('/') + 1);
  //           console.log('this.filename', this.filename);
  //           this.commonService.getMediaFileFromUri(finalPath, this.filename)
  //             .then((file) => {
  //               console.log('audio file', file);
  //               this.videosToUpload.push(file);
  //               console.log('this.videosToUpload', this.videosToUpload);
  //               if (typeof (this.videosToUpload) != 'undefined' && this.videosToUpload.length > 0) {
  //                 if (this.videosToUpload[0].type == 'video/mp4' || this.videosToUpload[0].type == 'video/webm' || this.videosToUpload[0].type == 'video/ogg') {
  //                   if (this.videosToUpload[0].size > (1024 * 1024 * 5)) {
  //                     this.commonService.showToast("Video size should be less than 5 MB!.");
  //                     this.videosToUpload = [];
  //                   }
  //                 }
  //                 else {
  //                   this.commonService.showToast('Invalid video format!');
  //                   this.videosToUpload = [];
  //                 }
  //               }
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             })
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         })
  //     })
  //     .catch(e => console.log(e));
  // }

  videoChangeEvent(fileInput: any) {
    this.videosToUpload = <Array<File>>fileInput.target.files;
    this.fileData = fileInput;
    console.log('this.videosToUpload', this.videosToUpload);
    if (typeof (this.videosToUpload) != 'undefined' && this.videosToUpload.length > 0) {
      if (this.videosToUpload[0].type == 'video/mp4' || this.videosToUpload[0].type == 'video/webm' || this.videosToUpload[0].type == 'video/ogg' || this.videosToUpload[0].type == 'video/quicktime' || this.videosToUpload[0].type == 'video/3gpp') {
        if (this.videosToUpload[0].size > (1024 * 1024 * 40)) {
          this.commonService.showToast("Video size should be less than 40 MB!.");
          this.videosToUpload = [];
          this.fileData.target.value = '';
        }
      }
      else {
        this.commonService.showToast('Invalid video format!');
        this.videosToUpload = [];
        this.fileData.target.value = '';
      }
    }
  }

  audioChangeEvent(fileInput: any) {
    this.audiosToUpload = <Array<File>>fileInput.target.files;
    this.fileData = fileInput;
    console.log('this.audiosToUpload', this.audiosToUpload);
    if (typeof (this.audiosToUpload) != 'undefined' && this.audiosToUpload.length > 0) {
      if (this.audiosToUpload[0].type == 'audio/mpeg' || this.audiosToUpload[0].type == 'audio/ogg' || this.audiosToUpload[0].type == 'audio/wav' || this.audiosToUpload[0].type == 'audio/mp3') {
        if (this.audiosToUpload[0].size > (1024 * 1024 * 40)) {
          this.commonService.showToast("Audio size should be less than 40 MB!.");
          this.audiosToUpload = [];
          this.fileData.target.value = '';
        }
      }
      else {
        this.commonService.showToast('Invalid audio format!');
        this.audiosToUpload = [];
        this.fileData.target.value = '';
      }
    }
  }

  private openGalleryVideo(): void {
    let cameraOptions = {
      mediaType: Camera.MediaType.VIDEO,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      quality: 100,
    }
    Camera.getPicture(cameraOptions)
      .then((file_uri) => {
        this.commonService.getFileFromUri(file_uri)
        .then((file) => {
          this.videosToUpload.push(file);
        })
        .catch((err) => {
          console.log(err);
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  private takeVideo():void {
    MediaCapture.captureVideo().then((data: MediaFile[]) =>{
       this.commonService.getFileFromUri(data[0].fullPath)
        .then((file) => {
          this.videosToUpload.push(file);
        })
        .catch((err) => {
          console.log(err);
        })
    }).catch((err)=>{
      console.log(err);
    })
  }
  private recordAudio():void{
    MediaCapture.captureAudio().then((data:MediaFile[]) =>{
      this.commonService.getFileFromUri(data[0].fullPath)
      .then((file)=>{
        this.audiosToUpload.push(file);
      }).catch((err)=>{
        console.log(err);
      })
    }).catch((err) =>{
      console.log(err);
    });
  }
}


