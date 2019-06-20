import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { FabricmodifyService } from './fabricmodify.service';
import { ManagePagesService } from './managepages.service';
import { NotificationService } from '../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ElementsService {

  userElements: BehaviorSubject<{}[]> = new BehaviorSubject([{}]);
  _userElementList = [];

  private imagedata = {
    name: null,
    encodedImage: null
  };

  constructor(private apiService: ApiService,
    private managePagesService: ManagePagesService,
    private modifyService: FabricmodifyService,
    private notificationService: NotificationService) { }

  /**
   * adds a newly imported element to the list of user elements
   * @param elem element to add to the current user elements
   */
  addUserElement(elem: string) {
    const element = ({
      name: elem.split('/')[1],
      data: 'assets/img/user/'+elem,
      effectAllowed: 'all',
      previewimage: 'assets/img/user/'+elem
    });
    //console.log("new element: "+element.name);
    //console.log("old elements: "+this._userElementList.entries());
    //console.log("old elements: "+this._userElementList.entries());
    this._userElementList = this._userElementList.concat(element);
    this.userElements.next(this._userElementList);
    //add element to canvas
    //const canvas = this.managePagesService.getCanvas();
    //this.modifyService.loadImageFromURL(canvas,element.data);
    this.notificationService.showSuccess("Import of Image successful",element.name +" imported");
  }

  /**
   * sets list of user elements
   * @param elements list of user elements
   */
  setUserElements(elements: {}[]) {
    this._userElementList = elements;
    console.log("setting elment list: "+elements.toLocaleString);
  }

  /**
   * imports an image, sens it to the server and gets the URL of the image back on success
   * @param file image to import
   */
  importImage(file: File) {
    const reader = new FileReader();
    this.imagedata.name = file.name;
    reader.readAsDataURL(file);
    var baseString;
    let _this = this;
    reader.onloadend = function () {
      baseString = reader.result;
      _this.imagedata.encodedImage = baseString;
      _this.sendImage(_this.imagedata).subscribe(
        (response) => {
        //console.log(`import image: ${JSON.stringify(response)}`);
        const resp = JSON.stringify(response);
        let elemURL:string = resp.split('img/user/')[1];
        elemURL = elemURL.substr(0,elemURL.length-4);
        //console.log(elemURL);
        _this.addUserElement(elemURL);
      },
      (error) => {
        //console.log(JSON.stringify(error.error));
        //console.log(JSON.stringify(error,error).split("\"")[3]);
        //const errormessage = JSON.stringify(error,error).split("\"")[3];
        _this.notificationService.showError('Error when importing image', 'Image with the same name already exists');
      });
    };
  }

  /**
   * sends a get request to the server to get a list of available categories and elements
   */
  getElements<T>(): Observable<T> {
    return this.apiService.get<T>('/elements');
  }

  /**
   * sends an image to the server to save
   * @param img image to send
   */
  sendImage(img: object): Observable<any> {
    return this.apiService.post('/elements', img);
  }
}
