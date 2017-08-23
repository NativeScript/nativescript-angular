import { Injectable } from "@angular/core";
import { knownFolders, Folder, File } from "tns-core-modules/file-system";

// Allows greater flexibility with `file-system` and Angular
// Also provides a way for `file-system` to be mocked for testing

@Injectable()
export class NSFileSystem {
  public currentApp(): Folder {
    return knownFolders.currentApp();
  }

  public fileFromPath(path: string): File {
    return File.fromPath(path);
  }

  public fileExists(path: string): boolean {
    return File.exists(path);
  }
}
