import {Injectable} from '@angular/core';
import {ResponseType, Response, ResponseOptions} from '@angular/http';

export class FileResponses {
  public static AWESOME_TEAM: string = '[{"name":"Alex"}, {"name":"Rosen"}, {"name":"Panayot"}]';
}

// Folder mock
class Folder {
  public getFile(url: string): any {
    let data;
    switch (url) {
      case 'test.json':
        data = FileResponses.AWESOME_TEAM;
        break;
      default:
        throw (new Error('Unsupported file for the testing mock - ns-file-system-mock'));
    }
    return {
      readText: () => {
        return new Promise((resolve) => {
          resolve(data);
        });
      }
    }
  }
}

// Filesystem mock
@Injectable()
export class NSFileSystemMock {
  public currentApp(): Folder {
    return new Folder();
  }
}